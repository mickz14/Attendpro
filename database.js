//import sql
import mysql from 'mysql2'
const pool = mysql.createPool({
   host:'localhost',
   user:'root',
   password:'Khushi#140903',
   database:'Attendpro'
}).promise();
const result = await pool.query("Select * from faculty;")
console.log(result[0])