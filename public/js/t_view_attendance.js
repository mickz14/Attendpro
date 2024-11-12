const viewAttendanceBtn = document.querySelector(".view-att-btn");
const lectureSelect = document.getElementById("select-lect");
const errorMessage = document.querySelector(".error-msg");
const ctobeloaded = document.querySelector(".content-to-be-loaded");
const rowsperpage = document.querySelector("#rows-per-page");
const prevpage = document.querySelector("#prev-page");
const nextpage = document.querySelector("#next-page");
const pagemsg = document.querySelector(".page-msg");

viewAttendanceBtn.addEventListener("click", () => {
    if (lectureSelect.value === "") {
        errorMessage.classList.remove("hidden"); // Show error message
    } else {
        errorMessage.classList.add("hidden"); // Hide error message if valid
        // Continue with attendance-taking actions here
        ctobeloaded.classList.remove("hidden");

    //     sectionID = lectureSelect.value;

    // fetch(`/api/get_students?section_id=${sectionID}`, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    // .then(response => response.json())
    // .then(studentData => {
    //     rowsData = studentData;
    //     console.log(rowsData);
    //     attendanceStatus = Array(rowsData.length).fill(false);
    //     // Initial render
    //     renderPage(1).then(() => setupCheckboxListeners());
    // })
    // .catch(error => {
    //     console.error("Error fetching student data:", error);
}
});

lectureSelect.addEventListener('focus',()=>{
    errorMessage.classList.add("hidden");
})

fetch('/api/teacher_lectures', {
    method: 'GET', 
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then(response => response.json()) // Parse the response as JSON
    .then(lectureData => {
        // Loop through each item in lectureData and create an option element
        lectureData.forEach(item => {
            const option = document.createElement('option');
            option.value = item.SECTION_ID; // Using SECTION_ID as the option value
            option.textContent = `${item.SECTION_NAME} - ${item.SUB_NAME}`; 
            lectureSelect.appendChild(option); 
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });


    