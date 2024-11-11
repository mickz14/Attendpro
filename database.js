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
      'SELECT F_PASSWORD FROM FACULTY WHERE F_ID = ?',[id]);
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
//=============================
// for student
export async function chk_pass_from_enr(id) {
      const [result2] = await pool.query(
          'SELECT STU_PASSWORD FROM STUDENT WHERE ENR_NUMBER = ?', [id]);
      if (result2.length === 0) return "undefined"; // Check length explicitly
      return result2[0].STU_PASSWORD;
  
  
}

//////////////////////////////
export async function getLecture(f_id){
   const [result2] = await pool.query(
      //'SELECT * FROM LECTURE WHERE F_ID = ?', [f_id]);
      'SELECT * FROM (SELECT SUBJECT.SUB_ID, SUBJECT.SUB_NAME, SECTION.SECTION_ID, SECTION.SECTION_NAME FROM LECTURE JOIN SUBJECT ON LECTURE.SUB_ID = SUBJECT.SUB_ID JOIN SECTION ON LECTURE.SECTION_ID = SECTION.SECTION_ID WHERE LECTURE.F_ID= ?) AS FACULTY_LECTURES;',[f_id]);
  return result2;
}

export async function getStudentData(sectionID) {
   const [result2] = await pool.query(
      'SELECT ENR_NUMBER,STU_FNAME,STU_LNAME FROM STUDENT WHERE SECTION_ID = ?', [116]);
  return result2;  
}


// const [result2] = await pool.query(
//    'SELECT (SELECT SECTION_ID,SECTION_NAME FROM SECTION) FROM LECTURE WHERE F_ID = ?', [10001]);

// console.log(result2);




// const r = await chk_t_lect_num(10001);
// console.log(r);
// console.log(typeof(r));

// pool.end();