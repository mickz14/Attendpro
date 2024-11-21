async function getMOREInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const subId = urlParams.get('subId');
    const res = await fetch(`/api/detailedStuAttendance?subId=${subId}`,
        {method : 'GET', 
        headers : {
            'Content-Type': 'application/json'
        }}
    );
    const detailedAttendance = await res.json();

}
getMOREInfo();