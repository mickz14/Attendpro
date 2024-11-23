const year = document.getElementById("year");
const sem = document.getElementById("sem");
const sec = document.getElementById("sec");
const sub = document.getElementById("sub");

function fetchSem() {
    const yearSelected = year.value;

    // Clear existing options
    sem.innerHTML = '';

    if (yearSelected === '1') {
        sem.insertAdjacentHTML('beforeend', `
            <option value="" disabled selected hidden>Select Semester: </option>
            <option value="1">1</option>
            <option value="2">2</option>
        `);
    } else if (yearSelected === '2') {
        sem.insertAdjacentHTML('beforeend', `
            <option value="" disabled selected hidden>Select Semester: </option>
            <option value="3">3</option>
            <option value="4">4</option>
        `);
    } else if (yearSelected === '3') {
        sem.insertAdjacentHTML('beforeend', `
            <option value="" disabled selected hidden>Select Semester: </option>
            <option value="5">5</option>
            <option value="6">6</option>
        `);
    } else {
        sem.insertAdjacentHTML('beforeend', `
            <option value="" disabled selected hidden>Select Semester: </option>
            <option value="7">7</option>
            <option value="8">8</option>
        `);
    }
}