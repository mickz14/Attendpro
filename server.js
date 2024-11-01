
const express = require("express")
const app = express()
const ejsmate = require("ejs-mate");
const path = require("path")
const ejs = require("ejs")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.engine("ejs",ejsmate);

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
    // console.log(req)
    res.render("index.ejs")
})

app.get("/teacher_login",(req,res)=>{
    res.render("teachers_login.ejs")
})

app.listen(8080,()=>{
    console.log("server is listening on http://localhost:8080/")
})
