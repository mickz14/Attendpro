
// const express = require("express")
import express from 'express'
const app = express()

// const ejsmate = require("ejs-mate");
import ejsmate from "ejs-mate"
// const path = require("path")
import path from 'node:path'
import { fileURLToPath } from 'url';
// const ejs = require("ejs")
import ejs from 'ejs'

// ==================================================================================

app.set("view engine","ejs");
app.engine("ejs",ejsmate);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("views",path.join(__dirname,"/views")); // dirname gives current directory name in which the server file is and path.join is used to join all paths (html files saves with .ejs) with the views folder by default.

app.use(express.urlencoded({extended:true})); //  is a middleware provided by Express that will process the request encoded form and will put all information into the request body object you receive in your handler function.

app.use(express.static(path.join(__dirname,"public"))); // used to access static files and making them public 

app.use(express.json()) //doing smthing very important

app.get("/",(req,res)=>{
    res.render("index") //or index.ejs it's same
})

app.get("/teacher_login",(req,res)=>{
    res.render("teachers_login.ejs")
})

app.post("/teacher_login",(req,res) =>{
    // authenticate user here
    
    console.log("blah");
    console.log(req.body);

    // res.render("");
})

app.get("/teacher_edit",(req,res) => {
    res.render("teacher_editprofile")
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

app.listen(8080,()=>{
    console.log("server is listening on http://localhost:8080/");
})
