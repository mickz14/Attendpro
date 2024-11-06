
const express = require("express")
const app = express()
const ejsmate = require("ejs-mate");
const path = require("path")
const ejs = require("ejs")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.engine("ejs",ejsmate);

app.use(express.urlencoded({extended:true})); //  is a middleware provided by Express that will process the request encoded form and will put all information into the request body object you receive in your handler function.

app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
    // console.log(req)
    res.render("index.ejs")
})

app.get("/teacher_login",(req,res)=>{
    res.render("teachers_login.ejs")
})
app.get("/t_dashboard",(req,res)=>{
    res.render("t_dashboard.ejs")
})
app.get("/t_profile",(req,res)=>{
    res.render("t_profile")
})

app.listen(8080,()=>{
    console.log("server is listening on http://localhost:8080/")
})


// random code - ignore


// const mysql = require("mysql"); 
  
// let db_con  = mysql.createConnection({ 
//     host: "localhost", 
//     user: "root", 
//     password: '', 
//     database: 'gfg_db'
// }); 
  
// db_con.connect((err) => { 
//     if (err) { 
//       console.log("Database Connection Failed !!!", err); 
//       return; 
//     } 
  
//     console.log("We are connected to gfg_db database"); 
  
//     This query will be used to select columns 
//     let query = 'SELECT * FROM users'; 
  
//     db_con.query(query, (err, rows) => { 
//         if(err) throw err; 
  
//         console.log(rows); 
//     }); 
// });
