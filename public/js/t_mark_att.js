const attendanceDate = document.querySelector("#att-date");

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
