const tablebody = document.querySelector('tbody');
const enr = document.getElementById('enr');
const section = document.getElementById('section');
const year = document.getElementById('year');

async function getInfo(){
    const res = await fetch('/api/studentInfo',
        {method : 'GET', 
        headers : {
            'Content-Type': 'application/json'
        }}
    );
    const studentALLInfo = await res.json();
    console.log(studentALLInfo);

    const studentInfo = studentALLInfo[0];
    const studentSubArray = studentALLInfo[1];

    if(studentInfo.STU_LNAME != null){
        enr.textContent = `${studentInfo.STU_FNAME} ${studentInfo.STU_LNAME}`
    }else{
        enr.textContent = `${studentInfo.STU_FNAME}`
    }

    section.textContent = `${studentInfo.SECTION_ID}`;
    year.textContent = `Semester : ${studentInfo.STU_SEM}`;

    studentSubArray.forEach((sub,i) => {
        const row = `<tr>
                <td class="px-4 py-2 border border-gray-400">${i+1}</td>
                <td class="px-4 py-2 border border-gray-400 overflow-x-auto">${sub.SUB_NAME}</td>
                <td class="px-4 py-2 border border-gray-400"></td>
                <td class="px-4 py-2 border border-gray-400"></td>
                <td class="px-4 py-2 border border-gray-400"></td>
                <td class="px-4 py-2 border border-gray-400"> ${getRemark(20)}
                </td>
                <td class="px-4 py-2 border border-gray-400">
                    <div class="h-8 w-24 self-center bg-[#5254dd] hover:bg-[#5254dd]/90 rounded-lg cursor-pointer text-white font-medium flex justify-center items-center text-center m-auto">More Info</div>
                </td>
            </tr>`
            tablebody.insertAdjacentHTML("beforeend",row);
    });
}

function getRemark(num){
    if (num<=30){
        return `<div class="present h-6 w-20 m-auto bg-red-200 border-2 border-red-400 rounded-md text-center text-red-500">At risk</div>`;
    }
    else if(num<=50){
        return `<div class="h-10 w-24 flex items-center justify-center m-auto bg-yellow-200 border-2 border-yellow-400 rounded-md text-center text-yellow-500">Need Improvement</div>`;
    }
    else{
        return `<div class="present h-6 w-20 m-auto bg-green-200 border-2 border-green-400 rounded-md text-center text-green-500">Excellent</div>`;
    }
}
getInfo();