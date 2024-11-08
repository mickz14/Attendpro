//import sql
import mysql from 'mysql2'

import dotenv from 'dotenv' // for enviornment variables file
dotenv.config()

// ==================================================================================================
const pool = mysql.createPool({
   host : process.env.MYSQL_HOST,
   user : process.env.MYSQL_USER,
   password : process.env.MYSQL_PASSWORD,
   database :process.env.MYSQL_DATABASE,
   connectionLimit: 10,
}).promise();


// this function takes the faculty id and return the password associated with it 
export async function chk_pass_from_id(id){
   const [result] = await pool.query(
      'SELECT F_PASSWORD FROM FACULTY WHERE F_ID = ?',[id])

   if(typeof(result[0]) == "undefined") return "undefined"
   return result[0].F_PASSWORD
}

export async function chk_t_lect_num(id){
   const [result] = await pool.query(
      'SELECT COUNT(F_ID) AS RES FROM LECTURE WHERE F_ID = ?',[id]
   )
   const send = result[0].RES;
   return send
}

// const r = await chk_t_lect_num(10001);
// console.log(r);
// console.log(typeof(r));

// pool.end();