
// const express = require("express")
import express from 'express'
const app = express()
const port = 8080
// const ejsmate = require("ejs-mate");
import ejsmate from "ejs-mate"
// const path = require("path")
import path from 'node:path'
import { fileURLToPath } from 'url'
// const ejs = require("ejs")
import ejs from 'ejs'
import session from 'express-session';


// ===================================================================================
// importing data from database file

import { chk_pass_from_enr, chk_pass_from_id ,chk_t_lect_num,getLecture,getStudentData,get_teacher_profile_details_from_id,update_teacher_profile,getStudentInfofromENR} from './database.js';

// ==================================================================================

app.set("view engine","ejs");
app.engine("ejs",ejsmate);

const dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("views",path.join(dirname,"/views")); // dirname gives current directory name in which the server file is and path.join is used to join all paths (html files saves with .ejs) with the views folder by default.

app.use(express.json()) //doing smthing very important
app.use(express.urlencoded({extended:true})); //  is a middleware provided by Express that will process the request encoded form and will put all information into the request body object you receive in your handler function.

app.use(express.static(path.join(dirname,"public"))); // used to access static files and making them public 


//////////////////////////////
app.use(session({
    secret: 'yourSecretKey', // replace with a secure secret key
    resave: false,            // prevents session resaving if unmodified
    saveUninitialized: false, // prevents creating a session until stored data exists
    cookie: {secure: false,
            maxAge: 60 * 60 * 1000 //1 hour
     } // set to true in production with HTTPS

}));
//////////////////////
app.get("/",(req,res)=>{
    res.render("index") //or index.ejs it's same
})
//for faculty login
async function t_func1(req, res) {
    // function called without post request
    let text;
    if(typeof(req.dataProcessed) == "undefined") {
        text = "";
        res.render("teachers_login.ejs",{text});
    }
    else{
        let msg = req.dataProcessed.msgcode;
        if(msg == "wrong_username"){
            text = "User does not exist !";
            res.render("teachers_login",{text});
        }else if (msg == "wrong_password"){
            text = "Incorrect Password !";
            res.render("teachers_login",{text});
        }else if (msg == "right_zero_lec"){
            res.redirect("/teacher_edit");
            // res.render("teacher_editprofile");
        }else if (msg== "right_not_zero_lec"){
            res.render("t_dashboard");
        }else{
            res.render("error_page.ejs");
        }
    } 
}

async function t_func2(req, res, next) {

    const t_userid = req.body.t_userid_key;
    const t_password = req.body.t_pass_key;
    
    const check1 = await chk_pass_from_id(t_userid); // get actual value from database
    
    // authenticate user here
    
    // wrong username `
    req.dataProcessed = "";
    if(check1 == "undefined") {
        req.dataProcessed = {"msgcode":"wrong_username"}
    }
    // right username wrong password
    else if(check1 != t_password){
        req.dataProcessed = {"msgcode" :"wrong_password"};
    }
    // both correct - move to next page
    else{
        const t_lectures = await chk_t_lect_num(t_userid);
        req.session.user = {id: t_userid}; // Save user data in session
        if(t_lectures == 0){
            // send to edit profile page to add lectures
            req.dataProcessed = {"msgcode" : "right_zero_lec"}
        }else{
            // send to teacher dashboard - all status good
            req.dataProcessed = {"msgcode" : "right_not_zero_lec"}
        } 
    }
    return next();
}

app.get('/teacher_login', t_func1);
app.post('/teacher_login', t_func2, t_func1);

//===================================================
//for student
async function stu_func1(req,res){ //without post request
    let text2;
    if(typeof(req.dataProcessed) == "undefined"){
        text2 = "";
        res.render("student_login.ejs",{text2});
    }   
    else{ 
        let msg2 = req.dataProcessed.mssgcode;
        if(msg2 == "wrong_username"){
            text2 = "User does not exist !";
            res.render("student_login",{text2});
        }else if (msg2 == "wrong_password"){
            text2 = "Incorrect Password !";
            res.render("student_login",{text2});
        }else if(msg2 == "stu_dashboard"){
            res.render("stu_dashboard.ejs");
        }
        else{
            res.render("error_page.ejs");
        }
    } 
}
async function stu_func2(req, res, next) {

    const stu_enr = req.body.stu_enr_key;
    const stu_pass = req.body.stu_pass_key;
    console.log("Student Enrollment:", stu_enr);
    console.log("Student Password:", stu_pass);
    const check2 = await chk_pass_from_enr(stu_enr); // get actual value from database
    console.log("Password from DB:", check2);
    // authenticate user here
    
    // wrong username `
    req.dataProcessed = "";
    if(check2 == "undefined") {
        req.dataProcessed = {"mssgcode":"wrong_username"};
    }
    // right username wrong password
    else if(check2 != stu_pass){
        req.dataProcessed = {"mssgcode" :"wrong_password"};
    }
    // both correct - move to next page
    else{
        req.session.student = {s_enr: stu_enr};
        req.dataProcessed = {"mssgcode" : "stu_dashboard"};
        console.log("Login successful, redirecting to dashboard");
    }
    return next();
}

app.get('/student_login', stu_func1);
app.post('/student_login', stu_func2, stu_func1);

//============================================================
// JSON endpoint to send data to the frontend
//API
//TEACHER LECTURES FETCH 
app.get('/api/teacher_lectures', async (req, res) => {
    
    const f_id = req.session.user ? req.session.user.id : 10002; //for testing
    const teacherData = await getLecture(f_id); // Fetch TEACHER LECTURES based on teacher ID
    res.json(teacherData); // Send data as JSON to the frontend

});

//==============================================================
//STUDENT LIST FETCH
app.get('/api/get_students', async (req, res) => {
    const sectionId = req.query.section_id; // Get the section_id from query parameter
    try {
        const students = await getStudentData(sectionId);
        res.json(students); // Send the student data as JSON
    } catch (error) {
        console.error("Error fetching student data:", error);
        res.status(500).json({ error: 'Failed to retrieve student data' });
    }
});

//================================================================
//STUDENT INFO FETCH
app.get('/api/studentInfo', async (req, res) => {
    // const studentENR = req.session.student.s_enr;
    const studentInfo = await getStudentInfofromENR(196202721);
    res.json(studentInfo);
});




// app.post('/api/post_attendanceData',async(req,res)=>{

// })




app.get("/teacher_edit",async(req,res) => {
    const f_id = req.session.user.id;
    const r = await get_teacher_profile_details_from_id(f_id);
    
    let data = r;
    res.render("teacher_editprofile",{data,f_id});
})

app.post("/teacher_edit",(req,res) => {
    const f_id = req.session.user.id;
    const t_profile_data = req.body;
    const result = update_teacher_profile(t_profile_data,f_id);
    res.redirect("/teacher_edit");
})

app.get("/t_dashboard",(req,res)=>{
    res.render("t_dashboard")
})
app.get("/t_profile",(req,res)=>{
    res.render("t_profile")
})

app.get("/t_view_attendance",(req,res)=>{
    res.render("t_view_attendance")
})
app.get("/t_mark_attendance",(req,res)=>{
    res.render("t_mark_attendance")
})
app.get("/t_logout",(req,res)=>{
    res.render("t_logout")
})
app.get("/t_destroySession",(req,res)=>{
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error occurred while logging out');
        }
        res.redirect('/teacher_login'); // Redirect to the login page
    });
})

app.get("/student_login",(req,res)=>{
    res.render("student_login")
})
app.get("/stu_dashboard",(req,res) =>{
    res.render("stu_dashboard")
})
app.use((req, res, next) => { 
    res.status(404).render("error_page");
}) 

function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
}

// Getting today's date
const today = new Date();
const todayFormatted = getFormattedDate(today);
console.log(todayFormatted);


app.listen(port,()=>{
    console.log("server is listening on http://localhost:8080/");
})
