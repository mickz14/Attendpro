//import sql
import mysql from 'mysql2'

import dotenv from 'dotenv' // for enviornment variables file
import e from 'connect-flash';
dotenv.config()

// ==================================================================================================
const pool = mysql.createPool({
   host: process.env.MYSQL_HOST,
   user: process.env.MYSQL_USER,
   password: process.env.MYSQL_PASSWORD,
   database: process.env.MYSQL_DATABASE,
   connectionLimit: 10,
}).promise();


// this function takes the faculty id and return the password associated with it 
export async function chk_pass_from_id(id) {
   const [result] = await pool.query(
      'SELECT F_PASSWORD FROM FACULTY WHERE F_ID = ?', [id]);
   if (typeof (result[0]) == "undefined") return "undefined"
   return result[0].F_PASSWORD
}

export async function chk_t_lect_num(id) {
   const [result] = await pool.query(
      'SELECT COUNT(F_ID) AS RES FROM LECTURE WHERE F_ID = ?', [id]
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

//===========================================
//for hod login
export async function chk_pass_from_hod_id(id) {
   const [result3] = await pool.query('SELECT HOD_PASSWORD FROM HOD WHERE HOD_ID = ?',[id]);
   if (result3.length === 0) return "undefined"; // Check length explicitly
   return result3[0].HOD_PASSWORD;   
}

//////////////////////////////
export async function getLecture(f_id) {
   const [result2] = await pool.query(
      //'SELECT * FROM LECTURE WHERE F_ID = ?', [f_id]);
      'SELECT * FROM (SELECT SUBJECT.SUB_ID, SUBJECT.SUB_NAME, SECTION.SECTION_ID, SECTION.SECTION_NAME FROM LECTURE JOIN SUBJECT ON LECTURE.SUB_ID = SUBJECT.SUB_ID JOIN SECTION ON LECTURE.SECTION_ID = SECTION.SECTION_ID WHERE LECTURE.F_ID=?) AS FACULTY_LECTURES', [f_id]);
   return result2;
}

export async function getStudentData(sectionID) {
   const [result2] = await pool.query(
      'SELECT ENR_NUMBER,STU_FNAME,STU_LNAME FROM STUDENT WHERE SECTION_ID = ?', [sectionID]);
   return result2;
}

// this function is used to get the profile details of the teacher

export async function get_teacher_profile_details_from_id(id) {
   const [result] = await pool.query(
      'SELECT F_FNAME,F_LNAME,F_PHONE_NUMBER FROM FACULTY WHERE F_ID = ?', [id]
   )
   return result[0];
}

export async function update_teacher_profile(data, fid) {
   const new_data = data;
   if (new_data.fac_phone == "") new_data.fac_phone = null;

   const result = await pool.query(
      'UPDATE FACULTY SET F_FNAME = ? , F_LNAME = ?, F_PHONE_NUMBER = ? WHERE F_ID = ?', [new_data.fac_fname, new_data.fac_lname, new_data.fac_phone, fid]
   )
}
// ///////////////////////////////////////////////////////////////////////////////////////////////////


export async function check_att_array_existance(sectionId, subID, attendanceDate) {
   // console.log(sectionId,subID,attendanceDate);
   const [result] = await pool.query(
      // check attendance existence on that date
      `select enr_number from attendance where sub_id=? AND section_id=? and attendance_date=?;`, [subID, sectionId, attendanceDate]
   )
   if (result.length == 0) {
      // no record of that day so attendance has not been marked previously
      return 0;
   }
   else {
      const [result2] = await pool.query(
         `select enr_number,status from attendance where sub_id=? AND section_id=? and attendance_date=?`, [subID, sectionId, attendanceDate]
      )
      // attendance of this day has been marked previously
      return result2;
   }
}

// Get sections based on year, excluding those already used with the selected subject
export const getAvailableSections = async (year, facultyId) => {
   const [sections] = await pool.query(
      'SELECT S.SECTION_ID, S.SECTION_NAME FROM SECTION S LEFT JOIN LECTURE L ON S.SECTION_ID = L.SECTION_ID AND L.F_ID = ? WHERE S.SECTION_YEAR = ? AND L.SUB_ID IS NULL', [facultyId, year]
   )
   // console.log(sections);
   return sections;

}

// Get subjects based on semester, excluding those already used with the selected section
export const getAvailableSubjects = async (semester, sectionID) => {
   const [subjects] = await pool.query('SELECT SUB.SUB_ID, SUB.SUB_NAME FROM SUBJECT SUB WHERE SUB.SUB_SEM = ? AND SUB.SUB_ID NOT IN (SELECT L.SUB_ID FROM LECTURE L WHERE L.SECTION_ID = ?)', [semester, sectionID]);
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


export const getExistingLectures = async (facultyId) => {
   const [rows] = await pool.query(`SELECT S.SECTION_NAME, SUB.SUB_ALIAS FROM LECTURE L JOIN SECTION S ON L.SECTION_ID = S.SECTION_ID JOIN SUBJECT SUB ON L.SUB_ID = SUB.SUB_ID WHERE L.F_ID = ?`, [facultyId]);
   // console.log(rows);
   // console.log(facultyId);
   return rows;


};

export async function remove_lecture(section_name, subject_alias) {
   const result = await pool.query(`DELETE FROM LECTURE WHERE SUB_ID = (SELECT SUB_ID FROM SUBJECT WHERE SUB_ALIAS = ?) AND SECTION_ID = (SELECT SECTION_ID FROM SECTION WHERE SECTION_NAME = ?);`, [subject_alias, section_name]);
   return result[0];
}


// Update an existing attendance entry
export async function updateAttendanceEntry(attendance_date, sub_id, section_id, enr_number, status) {
   const [result] = await pool.query(`UPDATE attendance SET status = ? WHERE attendance_date = ? AND sub_id = ? AND section_id = ? AND enr_number = ?`, [status, attendance_date, sub_id, section_id, enr_number])
   //  console.log(result);
   return result;

}

// Insert a new attendance entry
export async function insertAttendanceEntry(attendance_date, sub_id, section_id, enr_number, status) {
   const [result] = await pool.query(`INSERT INTO attendance (attendance_id,attendance_date, sub_id, section_id, enr_number, status) VALUES (null,?, ?, ?, ?, ?)`, [attendance_date, sub_id, section_id, enr_number, status])
   return result;
}

///////
//view attendance ke liye
export async function getStudentsBySection(sectionName) {
   // Step 1: Get the section_id based on section_name from the section table
   const [section] = await pool.query(`SELECT section_id FROM section WHERE section_name = ?`,[sectionName]);

   // If section is not found
   if (section.length === 0) {
      throw new Error('Section not found');
   }

   const sectionId = section[0].section_id;

   // Step 2: Get students based on section_id
   const [students] = await pool.query(`SELECT ENR_NUMBER, STU_FNAME, STU_LNAME FROM student WHERE section_id = ?`,[sectionId]);
   return students;
}
export async function getLecturesTaken(enr_number, section_name, subject_name) {
   const [result] = await pool.query(`SELECT COUNT(attendance_id) AS lecturesTaken FROM attendance WHERE enr_number = ? AND section_id = (SELECT section_id FROM section WHERE section_name = ?) AND sub_id = (SELECT sub_id FROM subject WHERE sub_name = ?) AND status = 1;`,[enr_number, section_name, subject_name]);
   // const send1 = result[0].LRES;
   //return send1;
   try{
      //console.log(result[0]);
      return result[0]?.lecturesTaken || 0;
   }catch (error) {
      console.error("getLecturesTaken Error:", error);
      throw error;
  }   
}   
export async function getTotalLectures(section_name, subject_name) {
   const [result] = await pool.query(`SELECT COUNT(DISTINCT attendance_date) AS totalLectures FROM attendance WHERE section_id = (SELECT section_id FROM section WHERE section_name = ?) AND sub_id = (SELECT sub_id FROM SUBJECT WHERE sub_name = ?);`,[section_name, subject_name]);
   // console.log(result);
   // const send2 = result[0].TRES;
   //return send2;
   try{
      //console.log(result[0]);
      return result[0]?.totalLectures || 0; 
      // Return count or 0 if no records found
   }catch (error) {
      console.error("getTotalLectures Error:", error);
      throw error;
  }
}   

// func to get student data and student sub data from student ENR
export async function getStudentInfofromENR(studentENR) {
   const [result] = await pool.query(
      'SELECT ENR_NUMBER,STU_FNAME,STU_LNAME,SECTION_ID,STU_SEM FROM STUDENT WHERE ENR_NUMBER = ?', [studentENR]
   )
   const sem = result[0].STU_SEM;
   const section_id = result[0].SECTION_ID;

   const [studentSubjects] = await pool.query(
      `select * from subject where sub_sem = ?;`, [sem]
   )
   const [[section_name]] = await pool.query(
      `select SECTION_NAME from section where SECTION_ID=?;`, [section_id]
   )
   result[0].SECTION_NAME = section_name.SECTION_NAME;
   console.log(result[0]);

   return ([result[0], studentSubjects]); //array of (object and array)
}

export async function fetchDetailedAttendance(enr,subId) {
   console.log(subId,enr);
   console.log(typeof(subId));
   const [result] = await pool.query(
      `SELECT DATE_FORMAT(attendance_date, '%Y-%m-%d') AS attendance_date, status
      FROM attendance where SUB_ID= ${subId} AND ENR_NUMBER= ${enr};`)


      console.log(result);
   
   return result;

}










// const [result] = await pool.query(
//    `select attendance_date,status from attendance where SUB_ID='ETCS_413' AND ENR_NUMBER=35196202721;`
// )
// result.forEach((row)=>{
//    const date = new Date(row.attendance_date);
//    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
//    row.attendance_date=formattedDate;
// })
// console.log(result);
// console.log(result[0].attendance_date);
// console.log(typeof(result[0].attendance_date));


// pool.end();
////////////////////////////////////////
// SELECT COUNT(ATTENDANCE_ID) FROM ATTENDANCE WHERE ENR_NUMBER = 141202722 AND SECTION_ID = (SELECT SECTION_ID FROM SECTION WHERE SECTION_NAME = "T1") AND SUB_ID = (SELECT SUB_ID FROM SUBJECT WHERE SUB_NAME = "OPERATING SYSTEM") AND STATUS = 1;
// SELECT COUNT(ATTENDANCE_ID) FROM ATTENDANCE WHERE SECTION_ID = (SELECT SECTION_ID FROM SECTION WHERE SECTION_NAME = "T1") AND SUB_ID = (SELECT SUB_ID FROM SUBJECT WHERE SUB_NAME = "OPERATING SYSTEM");