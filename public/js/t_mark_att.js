const attendanceDate = document.querySelector("#att-date");
const takeAttendanceBtn = document.querySelector(".take-att-btn");
const lectureSelect = document.getElementById("select-lect");
const errorMessage = document.querySelector(".error-msg");

// Function to format the date as YYYY-MM-DD
function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
}

// Get today's date
const today = new Date();
const todayFormatted = getFormattedDate(today);

attendanceDate.textContent = `${todayFormatted}`

takeAttendanceBtn.addEventListener("click", () => {
    if (lectureSelect.value === "") {
        errorMessage.classList.remove("hidden"); // Show error message
    } else {
        errorMessage.classList.add("hidden"); // Hide error message if valid
        // Continue with attendance-taking actions here
    }
});

lectureSelect.addEventListener('focus',()=>{
    errorMessage.classList.add("hidden");
})