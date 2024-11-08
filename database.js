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
}).promise();

// const result = await pool.query("Select * from faculty;")
// console.log(result[0])

// this function takes the faculty id and return the password associated with it 
export async function chk_pass_from_id(id){
   const [result] = await pool.query(
      'SELECT F_PASSWORD FROM FACULTY WHERE F_ID = ?',
      [id])
      return result[0]
}

const r = await chk_pass_from_id(10004)
console.log(r)