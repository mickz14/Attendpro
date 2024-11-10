
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

<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
// ===================================================================================
// importing data from database file

import { chk_pass_from_id ,chk_t_lect_num} from './database.js';

// ==================================================================================

app.set("view engine","ejs");
app.engine("ejs",ejsmate);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("views",path.join(__dirname,"/views")); // dirname gives current directory name in which the server file is and path.join is used to join all paths (html files saves with .ejs) with the views folder by default.

app.use(express.json()) //doing smthing very important
app.use(express.urlencoded({extended:true})); //  is a middleware provided by Express that will process the request encoded form and will put all information into the request body object you receive in your handler function.

app.use(express.static(path.join(__dirname,"public"))); // used to access static files and making them public 

app.get("/",(req,res)=>{
    res.render("index") //or index.ejs it's same
})

async function t_func1(req, res) {
    // function called without post request
    var text;
    if(typeof(req.dataProcessed) == "undefined") {
        text = "";
        res.render("teachers_login.ejs",{text});
    }
    else{
        var msg = req.dataProcessed.msgcode;
        if(msg == "wrong_username"){
            text = "User does not exist !";
            res.render("teachers_login",{text});
        }else if (msg == "wrong_password"){
            text = "Incorrect Password !";
            res.render("teachers_login",{text});
        }else if (msg == "right_zero_lec"){
            res.render("teacher_editprofile");
        }else if (msg== "right_not_zero_lec"){
            res.render("t_dashboard");
        }else{
            res.render("error_page.ejs");
        }
    } 
}

async function  t_func2(req, res, next) {

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

app.get("/teacher_edit",(req,res) => {
    res.render("teacher_editprofile")
})

app.post("/teacher_edit",(req,res) => {
    
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
app.get("/student_login",(req,res)=>{
    res.render("student_login")
})

app.use((req, res, next) => { 
    res.status(404).render("error_page");
}) 
app.listen(port,()=>{
    console.log("server is listening on http://localhost:8080/");
})
