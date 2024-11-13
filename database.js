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
      'SELECT * FROM (SELECT SUBJECT.SUB_ID, SUBJECT.SUB_NAME, SECTION.SECTION_ID, SECTION.SECTION_NAME FROM LECTURE JOIN SUBJECT ON LECTURE.SUB_ID = SUBJECT.SUB_ID JOIN SECTION ON LECTURE.SECTION_ID = SECTION.SECTION_ID WHERE LECTURE.F_ID=?) AS FACULTY_LECTURES',[f_id]);
  return result2;
}

export async function getStudentData(sectionID) {
   const [result2] = await pool.query(
      'SELECT ENR_NUMBER,STU_FNAME,STU_LNAME FROM STUDENT WHERE SECTION_ID = ?', [sectionID]);
  return result2;  
}

// export function insertIntoAttendanceTable(){

// }


// const [result2] = await pool.query(
//    'SELECT * FROM (SELECT SUBJECT.SUB_ID, SUBJECT.SUB_NAME, SECTION.SECTION_ID, SECTION.SECTION_NAME FROM LECTURE JOIN SUBJECT ON LECTURE.SUB_ID = SUBJECT.SUB_ID JOIN SECTION ON LECTURE.SECTION_ID = SECTION.SECTION_ID WHERE LECTURE.F_ID= 10001) AS FACULTY_LECTURES;');

// console.log(result2);




// const r = await chk_t_lect_num(10001);
// console.log(r);
// console.log(typeof(r));


// this function is used to get the profile details of the teacher

export async function get_teacher_profile_details_from_id(id){
   const [result] = await pool.query(
      'SELECT F_FNAME,F_LNAME,F_PHONE_NUMBER FROM FACULTY WHERE F_ID = ?',[id]
   )
   return result[0];
}

export async function update_teacher_profile(data,fid){
   const new_data = data;
   if(new_data.fac_phone == "") new_data.fac_phone = null;
   
   const result = await pool.query(
      'UPDATE FACULTY SET F_FNAME = ? , F_LNAME = ?, F_PHONE_NUMBER = ? WHERE F_ID = ?',[new_data.fac_fname,new_data.fac_lname,new_data.fac_phone,fid]
   )
}
// ///////////////////////////////////////////////////////////////////////////////////////////////////
// database.js

// func to get student data from student ENR
export async function getStudentInfofromENR(studentENR) {
   const result = await pool.query(
      'SELECT STU_FNAME,STU_LNAME,SECTION_ID,STU_SEM FROM STUDENT WHERE ENR_NUMBER = ?',[studentENR]
   )
   return (result[0]);
}


// Get sections based on year, excluding those already used with the selected subject
export const getAvailableSections= async (year,facultyId) => {
   const [sections] = await pool.query(
      'SELECT S.SECTION_ID, S.SECTION_NAME FROM SECTION S LEFT JOIN LECTURE L ON S.SECTION_ID = L.SECTION_ID AND L.F_ID = ? WHERE S.SECTION_YEAR = ? AND L.SUB_ID IS NULL',[facultyId,year]
   )
   // console.log(sections);
   return sections;
   
}

// Get subjects based on semester, excluding those already used with the selected section
export const getAvailableSubjects= async (semester,sectionID) => {
   const [subjects] = await pool.query(
      'SELECT SUB.SUB_ID, SUB.SUB_NAME FROM SUBJECT SUB WHERE SUB.SUB_SEM = ? AND SUB.SUB_ID NOT IN (SELECT L.SUB_ID FROM LECTURE L WHERE L.SECTION_ID = ?)',[semester,sectionID]
   )
   return subjects;
}

export const addLecture = async (facultyId, sectionId, subjectId) => {
   // Ensure that the section + subject combination doesn't already exist in the 'lecture' table
   const [existingLecture] = await pool.query(`SELECT * FROM LECTURE WHERE SECTION_ID = ? AND SUB_ID = ?`, [sectionId, subjectId]);
   //console.log(existingLecture);
   if (existingLecture.length > 0) {
       throw new Error("This lecture already exists.");
   }

   // Insert the new lecture
   await pool.query(`INSERT INTO lecture (F_ID, SECTION_ID, SUB_ID) VALUES (?, ?, ?)`, [facultyId, sectionId, subjectId]);
};





///////////////////////////////////
// const r = await get_teacher_profile_details_from_id(10001);
// console.log(r);
// console.log(typeof(r));

// pool.end();