const year = document.getElementById("year");
const sem = document.getElementById("sem");
const sec = document.getElementById("sec");
const sub = document.getElementById("sub");
const errormsg = document.querySelector(".error-msg");

function fetchSemSec() {
    const yearSelected = year.value;

    // Clear existing options
    sem.innerHTML = '<option value="" disabled selected hidden>Select Semester: </option>';

    if (yearSelected === '1') {
        sem.insertAdjacentHTML('beforeend', `
            <option value="1">1</option>
            <option value="2">2</option>
        `);
    } else if (yearSelected === '2') {
        sem.insertAdjacentHTML('beforeend', `
            <option value="3">3</option>
            <option value="4">4</option>
        `);
    } else if (yearSelected === '3') {
        sem.insertAdjacentHTML('beforeend', `
            <option value="5">5</option>
            <option value="6">6</option>
        `);
    } else {
        sem.insertAdjacentHTML('beforeend', `
            <option value="7">7</option>
            <option value="8">8</option>
        `);
    }
    fetchSec();
}

async function fetchSec(){
    const res = await fetch(`/api/hod_get_Section?year=${year.value}`,
        {method : 'GET', 
            headers : {
                'Content-Type': 'application/json'
        }}
    );
    const sections = await res.json();
    console.log(sec);

    sec.innerHTML='<option value="" disabled selected hidden>Select Section:</option>';
    
    for (const section of sections) {
        sec.insertAdjacentHTML('beforeend',
            `<option value="${section.section_name}">${section.section_name}</option>
            `
        )
    }
}
async function fetchSubjects() {
    const selectedSemester = sem.value;
    if (selectedSemester) {
      try {
        const response = await fetch(`/api/hod-get-subjects?semester=${selectedSemester}`);
        const subjects = await response.json();
        // console.log("Fetched subjects:", subjects);

        sub.innerHTML = "<option value=''>Select Subject</option>";
        subjects.forEach(subject => {
          const option = document.createElement("option");
          option.value = subject.sub_id;
          option.textContent = subject.sub_name;
          sub.appendChild(option);
        });
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    }
  }

function viewatt(){
    if(year.value && sub.value && sec.value && sem.value){
        window.location.href = `/hod_view_att?sem=${sem.value}&sub=${sub.value}`;
    }
    else{
        errormsg.classList.toggle('hidden')
    }
}