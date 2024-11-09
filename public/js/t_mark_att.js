const attendanceDate = document.querySelector("#att-date");
const takeAttendanceBtn = document.querySelector(".take-att-btn");
const lectureSelect = document.getElementById("select-lect");
const errorMessage = document.querySelector(".error-msg");
const ctobeloaded = document.querySelector(".content-to-be-loaded");
const tablebody = document.querySelector("tbody");
const rowsperpage = document.querySelector("#rows-per-page");
const prevpage = document.querySelector("#prev-page");
const nextpage = document.querySelector("#next-page");
const pagemsg = document.querySelector(".page-msg");


function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
}

// Getting today's date
const today = new Date();
const todayFormatted = getFormattedDate(today);

attendanceDate.textContent = `${todayFormatted}`

takeAttendanceBtn.addEventListener("click", () => {
    if (lectureSelect.value === "") {
        errorMessage.classList.remove("hidden"); // Show error message
    } else {
        errorMessage.classList.add("hidden"); // Hide error message if valid
        // Continue with attendance-taking actions here
        ctobeloaded.classList.remove("hidden");

        // Initial render
        renderPage(1);
    }
});

lectureSelect.addEventListener('focus',()=>{
    errorMessage.classList.add("hidden");
})

// pagination

// Sample data 
const rowsData = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Student ${i + 1}`,
    status: i % 2 === 0 ? "Present" : "Absent"
}));

let currentpage = 1;

// Handling the next and previous page buttons
nextpage.addEventListener('click',()=>{
    const rows = rowsperpage.value === "all" ? rowsData.length : parseInt(rowsperpage.value, 10)
    const totalPages = Math.ceil(rowsData.length /rows);
    if(currentpage<totalPages) {currentpage++;}
    else{
        currentpage=totalPages;
    }
    renderPage(currentpage);
})
prevpage.addEventListener('click',()=>{
    if(currentpage>1) {currentpage--;}
    else{
        currentpage = 1;
    }
    renderPage(currentpage);
})


//render data rows acc to page number
async function renderPage(page){
    tablebody.innerHTML = "";  // Clear previous rows

    let rowsperpageValue = rowsperpage.value;
    const rows = rowsperpageValue === "all" ? rowsData.length : parseInt(rowsperpageValue, 10); //no. of rows to be shown
    const startIndex = (page - 1) * rows;
    //rowsData.length can be less than rowsperpageValue selected
    const endIndex = Math.min(startIndex + rows, rowsData.length);   


    for (let i = startIndex; i < endIndex; i++) {
        const student = rowsData[i];
        const row = `
            <tr>
                <td class="border-2 px-4 py-2">${student.id}</td>
                <td class="border-2 px-4 py-2">${student.name}</td>
                <td class="border-2 px-4 py-2 text-center"><input type="checkbox" class="checkbox">
                </td>
                <td class="border-2 px-4 py-2"></td>

            </tr>
        `;
        tablebody.insertAdjacentHTML("beforeend", row);
    }

    
    const totalPages = Math.ceil(rowsData.length/rows);
    pagemsg.textContent = `Page ${page} of ${totalPages}`;
}

rowsperpage.addEventListener("change", () => {
    currentpage = 1; // Reset to the first page
    renderPage(currentpage);
});

// Async function to set up event listeners after rendering the table
async function setupCheckboxListeners() {
    await renderPage(); // Wait until the table is rendered

    // Add event listeners to checkboxes
    document.querySelectorAll(".checkbox").forEach(checkbox => {
        checkbox.addEventListener("click", handleCheckboxClick);
    });
}
function handleCheckboxClick(e){
    if(e.target.checked ='true'){
        const tablerow = e.target.closest('tr');
        // tr.removeAdjacentHTML("beforeend", row);

            console.log('hiiiiiiiii');
    }
}


