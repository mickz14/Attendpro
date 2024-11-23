

import express from 'express'
const app = express()
const port = 8080
import ejsmate from "ejs-mate"
import path from 'node:path'
import { fileURLToPath } from 'url'
import session from 'express-session';
const router = express.Router();

// ===================================================================================
// importing data from database file

import {
    chk_pass_from_enr, chk_pass_from_id, chk_pass_from_hod_id, chk_t_lect_num, getLecture, getStudentData,
    get_teacher_profile_details_from_id, update_teacher_profile, getStudentInfofromENR,
    getAvailableSubjects, getAvailableSections, addLecture, remove_lecture, getExistingLectures, check_att_array_existance,
    insertAttendanceEntry, updateAttendanceEntry, getStudentsBySection,getTotalLectures,getLecturesTaken,fetchDetailedAttendance,hod_getsections,hod_get_subjects
} from './database.js';

// ==================================================================================

app.set("view engine", "ejs");
app.engine("ejs", ejsmate);

const dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("views", path.join(dirname, "/views")); // dirname gives current directory name in which the server file is and path.join is used to join all paths (html files saves with .ejs) with the views folder by default.

app.use(express.json()) //doing smthing very important
app.use(express.urlencoded({ extended: true })); //  is a middleware provided by Express that will process the request encoded form and will put all information into the request body object you receive in your handler function.

app.use(express.static(path.join(dirname, "public"))); // used to access static files and making them public 


//////////////////////////////
app.use(session({
    secret: 'yourSecretKey', // replace with a secure secret key
    resave: false,            // prevents session resaving if unmodified
    saveUninitialized: false, // prevents creating a session until stored data exists
    cookie: {
        // httpOnly: true,
        secure: false,
        // SameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000 //1 hour
    } // set to true in production with HTTPS

}));
//////////////////////
app.get("/", (req, res) => {
    // console.log(document.cookie);
    if (typeof (req.session.user) == "undefined") {
        // req.userxists = 0;
        res.render("index") //or index.ejs it's same        
    } else {
        req.session.userxists = 1;
        res.render("index")
    }
})
//for faculty login
async function t_func1(req, res) {
    // function called without post request i.e. when land on this page
    let text;
    if (typeof (req.session.userxists) != "undefined" && req.session.userxists == 1) {
        res.render("t_dashboard");
    }
    else if (typeof (req.dataProcessed) == "undefined") {
        text = "";
        res.render("teachers_login.ejs", { text });
    }
    else {
        let msg = req.dataProcessed.msgcode;
        if (msg == "wrong_username") {
            text = "User does not exist !";
            res.render("teachers_login", { text });
        } else if (msg == "wrong_password") {
            text = "Incorrect Password !";
            res.render("teachers_login", { text });
        } else if (msg == "right_zero_lec") {
            res.redirect("/teacher_edit");
            // res.render("teacher_editprofile");
        } else if (msg == "right_not_zero_lec") {
            res.redirect("/t_dashboard");
        } else {
            res.render("error_page.ejs");
        }
    }
}

async function t_func2(req, res, next) {

    const t_userid = req.body.t_userid_key;
    const t_password = req.body.t_pass_key;

    const check1 = await chk_pass_from_id(t_userid); // get actual value from database

    // authenticate user here

    // wrong username `
    req.dataProcessed = "";
    if (check1 == "undefined") {
        req.dataProcessed = { "msgcode": "wrong_username" }
    }
    // right username wrong password
    else if (check1 != t_password) {
        req.dataProcessed = { "msgcode": "wrong_password" };
    }
    // both correct - move to next page
    else {
        const t_lectures = await chk_t_lect_num(t_userid);
        req.session.user = { id: t_userid }; // Save user data in session
        if (t_lectures == 0) {
            // send to edit profile page to add lectures
            req.dataProcessed = { "msgcode": "right_zero_lec" }
        } else {
            // send to teacher dashboard - all status good
            req.dataProcessed = { "msgcode": "right_not_zero_lec" }
        }
    }
    return next();
}

app.get('/teacher_login', t_func1);
app.post('/teacher_login', t_func2, t_func1);

//===================================================
//for student
async function stu_func1(req, res) { //without post request i.e. when land on this page
    let text2;
    if (typeof (req.dataProcessed) == "undefined") {
        text2 = "";
        res.render("student_login.ejs", { text2 });
    }
    else {
        let msg2 = req.dataProcessed.mssgcode;
        if (msg2 == "wrong_username") {
            text2 = "User does not exist !";
            res.render("student_login", { text2 });
        } else if (msg2 == "wrong_password") {
            text2 = "Incorrect Password !";
            res.render("student_login", { text2 });
        } else if (msg2 == "stu_dashboard") {
            res.redirect("/stu_dashboard");
        }
        else {
            res.render("error_page.ejs");
        }
    }
}
async function stu_func2(req, res, next) {

    const stu_enr = req.body.stu_enr_key;
    const stu_pass = req.body.stu_pass_key;
    console.log("Student Enrollment:", stu_enr);
    console.log("Student Password:", stu_pass);
    const check2 = await chk_pass_from_enr(stu_enr); // get actual value from database
    console.log("Password from DB:", check2);
    // authenticate user here

    // wrong username `
    req.dataProcessed = "";
    if (check2 == "undefined") {
        req.dataProcessed = { "mssgcode": "wrong_username" };
    }
    // right username wrong password
    else if (check2 != stu_pass) {
        req.dataProcessed = { "mssgcode": "wrong_password" };
    }
    // both correct - move to next page
    else {
        req.session.student = { s_enr: stu_enr };
        req.dataProcessed = { "mssgcode": "stu_dashboard" };
        console.log("Login successful, redirecting to dashboard");
    }
    return next();
}

app.get('/student_login', stu_func1);
app.post('/student_login', stu_func2, stu_func1);

//============================================================
//for hod
async function hod_func1(req, res) { //without post request i.e. when land on this page
    let text2;
    if (typeof (req.dataProcessed) == "undefined") {
        text2 = "";
        res.render("hod_login.ejs", { text2 });
    }
    else {
        let msg2 = req.dataProcessed.mssgcode;
        if (msg2 == "wrong_username") {
            text2 = "User does not exist !";
            res.render("hod_login", { text2 });
        } else if (msg2 == "wrong_password") {
            text2 = "Incorrect Password !";
            res.render("hod_login", { text2 });
        } else if (msg2 == "hod_dashboard") {
            res.redirect("/hod_dashboard");
        }
        else {
            res.render("error_page.ejs");
        }
    }
}
async function hod_func2(req, res, next) {

    const hod_id = req.body.hod_id_key;
    const hod_pass = req.body.hod_pass_key;
    console.log("HOD ID:", hod_id);
    console.log("HOD Password:", hod_pass);
    const check3 = await chk_pass_from_hod_id(hod_id); // get actual value from database
    console.log("Password from DB:", check3);
    // authenticate user here

    // wrong username `
    req.dataProcessed = "";
    if (check3 == "undefined") {
        req.dataProcessed = { "mssgcode": "wrong_username" };
    }
    // right username wrong password
    else if (check3 != hod_pass) {
        req.dataProcessed = { "mssgcode": "wrong_password" };
    }
    // both correct - move to next page
    else {
        req.session.hod = { hod_id: hod_id };
        req.dataProcessed = { "mssgcode": "hod_dashboard" };
        console.log("Login successful, redirecting to dashboard");
    }
    return next();
}

app.get('/hod_login', hod_func1);
app.post('/hod_login', hod_func2, hod_func1);

//============================================================
// JSON endpoint to send data to the frontend
//API
//TEACHER LECTURES FETCH 
app.get('/api/teacher_lectures', async (req, res) => {

    const f_id = req.session.user.id;
    // const f_id = req.session.user ? req.session.user.id : 10002; //for testing
    const teacherData = await getLecture(f_id); // Fetch TEACHER LECTURES based on teacher ID
    res.json(teacherData); // Send data as JSON to the frsontend

});

app.get('/api/teacher_details', async (req, res) => {

    const f_id = req.session.user.id; //for testing
    const teacherData = await get_teacher_profile_details_from_id(f_id); // Fetch teacher detail based on teacher ID
    teacherData.F_ID = f_id;
    res.json(teacherData); // Send data as JSON to the frontend

});


//==============================================================
//STUDENT LIST FETCH
app.get('/api/get_students', async (req, res) => {
    const sectionId = req.query.section_id; // Get the section_id from query parameter
    const subID = req.query.sub_id;
    const attendanceDate = req.query.attendance_date;

    try {
        const students = await getStudentData(sectionId);
        // res.json(students); // Send the student data as JSON
        const attendanceStatus = await check_att_array_existance(sectionId, subID, attendanceDate);
        res.json({ stu: students, stat: attendanceStatus });
        
    } catch (error) {
        console.error("Error fetching student data:", error);
        res.status(500).json({ error: 'Failed to retrieve student data' });
    }
});

//================================================================
//STUDENT DASHBOARD INFO FETCH
app.get('/api/studentInfo', async (req, res) => {
    const studentENR = req.session.student.s_enr;
    const studentInfo = await getStudentInfofromENR(studentENR);
    const studentpinfo = studentInfo[0];
    const studentSubjects = studentInfo[1];

    for (const subject of studentSubjects) {
        console.log(`Processing Subject: ${studentpinfo.SECTION_NAME}, ${subject.SUB_NAME}`);
        subject["total_lec"] = await getTotalLectures(studentpinfo.SECTION_NAME, subject.SUB_NAME);
        subject['lec_taken'] = await getLecturesTaken(studentENR, studentpinfo.SECTION_NAME, subject.SUB_NAME);
         
    }

    res.json([studentpinfo, studentSubjects]);
});
// get student attendance to show in view attendance table
app.get('/api/get_students_by_section', async (req, res) => {
    const { sectionName } = req.query;

    try {
        const students = await getStudentsBySection(sectionName);
        res.json(students);
    } catch (error) {
        console.error('Error fetching student data:', error);
        res.status(500).json({ error: 'Failed to fetch student data' });
    }
});

app.post('/markAttendance', async (req, res) => {
    try {
        const attendanceData = req.body; // Array of attendance objects
        // Iterate through the data and insert/update attendance table
        // Check if an entry already exists
        var sec_id = attendanceData[0].section_id;
        var subj_id = attendanceData[0].sub_id;
        var att_date = attendanceData[0].attendance_date;
        const existingEntry = await check_att_array_existance(sec_id, subj_id, att_date);

        for (let entry of attendanceData) {
            var { attendance_date, enr_number, sub_id, section_id, status } = entry;
            enr_number = parseInt(enr_number);
            // console.log(entry);

            if (existingEntry == 0) {
                // Insert new entry
                const insert = await insertAttendanceEntry(attendance_date, sub_id, section_id, enr_number, status);
            }

            else {
                // Update existing entry
                const update = await updateAttendanceEntry(attendance_date, sub_id, section_id, enr_number, status);
            }
        }
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error saving attendance.' });
    }
});

// Endpoint to fetch lecture attendance data
app.post('/api/get_lectures_taken', async (req, res) => {
    const { enr_number, section_name, subject_name } = req.body;

    try {
        const lecturesTaken = await getLecturesTaken(enr_number, section_name, subject_name);
        // console.log('Lectures Taken:', lecturesTaken); // Debug log
        res.json({ lecturesTaken });
    } catch (error) {
        console.error('Error fetching lectures taken:', error);
        res.status(500).json({ error: 'Failed to fetch lectures taken' });
    }
});

// API to get total lectures for a lecture
app.post('/api/get_total_lectures', async (req, res) => {
    const { section_name, subject_name } = req.body;

    try {
        const totalLectures = await getTotalLectures(section_name, subject_name);
        // console.log('Total Lectures:', totalLectures); // Debug log
        res.json({ totalLectures });
    } catch (error) {
        console.error('Error fetching total lectures:', error);
        res.status(500).json({ error: 'Failed to fetch total lectures' });
    }
});

app.get("/teacher_edit", async (req, res) => {
    const f_id = req.session.user.id;
    const r = await get_teacher_profile_details_from_id(f_id);

    let data = r;
    res.render("teacher_editprofile.ejs", { data, f_id });
 
})

app.post("/teacher_edit", (req, res) => {
    const f_id = req.session.user.id;
    const t_profile_data = req.body;
    const result = update_teacher_profile(t_profile_data, f_id);
    res.redirect("/teacher_edit");
})

////////////////////////////////////////////

// Route to get sections based on selected year and facultyid
app.get("/get-sections", async (req, res) => {
    const facultyId = req.session.user.id;
    const { year } = req.query;
    let yr = 0;
    if (year == "First") {
        yr = 1;
    }
    else if (year == "Second") {
        yr = 2;
    }
    else if (year == "Third") {
        yr = 3;
    }
    else if (year == "Fourth") {
        yr = 4;
    }

    try {
        const sections = await getAvailableSections(yr, facultyId);
        res.json(sections);
    } catch (error) {
        console.error("Error fetching sections:", error);
        res.status(500).json({ error: "Error fetching sections" });
    }
});

// Route to get subjects based on selected semester
app.get("/get-subjects", async (req, res) => {
    // const facultyId = req.session.user.id;
    const { semester, sectionID } = req.query;
    try {
        const subjects = await getAvailableSubjects(semester, sectionID);
        res.json(subjects);
    } catch (error) {
        console.error("Error fetching subjects:", error);
        res.status(500).json({ error: "Error fetching subjects" });
    }
});

app.get('/getExistingLectures', async (req, res) => {
    const facultyId = req.session.user.id;; // session ID for logged-in faculty
    try {
        const lectures = await getExistingLectures(facultyId);
        res.json(lectures);
    } catch (error) {
        console.error("Error fetching existing lectures:", error);
        res.status(500).json({ error: "Failed to fetch existing lectures" });
    }
});
// Route to add a lecture
app.post("/add-lecture", async (req, res) => {
    const { facultyId, sectionId, subjectId } = req.body;
    // console.log(sectionId);
    // console.log(req.body);

    try {
        const result = await addLecture(facultyId, sectionId, subjectId);
        res.json({ message: "Lecture added successfully" });
    } catch (error) {
        console.error("Error adding lecture:", error);
        res.status(500).json({ error: "Error adding lecture" });
    }
});

/////////////////////////////////////////////




app.get("/t_dashboard", (req, res) => {
    res.render("t_dashboard")
})
app.get("/t_profile", (req, res) => {
    res.render("t_profile")
})

app.get("/t_view_attendance", (req, res) => {
    res.render("t_view_attendance")
})
app.get("/t_mark_attendance", (req, res) => {
    res.render("t_mark_attendance")
})
app.get("/t_help", (req, res) => {
    res.render("t_help")
})
app.get("/t_logout", (req, res) => {
    res.render("t_logout")
})
app.get("/t_destroySession", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error occurred while logging out');
        }
        res.redirect('/teacher_login'); // Redirect to the login page
    });
})

app.get("/stu_destroySession", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error occurred while logging out');
        }
        res.redirect('/student_login'); // Redirect to the login page
    });
})



app.get("/student_login", (req, res) => {
    res.render("student_login")
})
app.get("/stu_dashboard", (req, res) => {
    res.render("stu_dashboard")
})
app.get('/stu_more_info', async (req, res) => {
    res.render('stu_more_info');
});

app.get('/api/detailedStuAttendance',async (req, res) => {
    const {subId} = req.query;
    // console.log(typeof(subId));
    const enr = req.session.student.s_enr;
    // const enr = 196202721;
    const detailedAttendance = await fetchDetailedAttendance(enr, subId);
    console.log(detailedAttendance);
    res.json(detailedAttendance);
})



app.get("/hod_login",(req,res)=>{
    res.render("hod_login")
})
app.get("/hod_dashboard",(req,res)=>{
    res.render("hod_dashboard")
})

app.get("/hod_destroySession", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error occurred while logging out');
        }
        res.redirect('/hod_login'); // Redirect to the login page
    });
})

app.get("/api/hod_get_Section", async (req, res) => {
    const { year } = req.query;
    if (!year) {
        return res.status(400).send('Year is required');
    }

    try {
        const sec = await hod_getsections(year);
        res.json(sec);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get("/api/hod-get-subjects", async (req, res) => {
    const { semester } = req.query;
    if (!semester) {
        return res.status(400).send('Year is required');
    }

    try {
        const subjects = await hod_get_subjects(semester);
        res.json(subjects);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/hod_view_att', async (req, res) => {
    res.render('hod_view_att');
});




app.use((req, res, next) => {
    res.status(404).render("error_page");
})


function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
}

// Getting today's date
const today = new Date();
const todayFormatted = getFormattedDate(today);
console.log(todayFormatted);


app.listen(port, () => {
    console.log("server is listening on http://localhost:8080/");
})
