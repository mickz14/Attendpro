const user_field = document.querySelector('.user-key');
const pass_field = document.querySelector('.pass-key');
const field1 = document.querySelector('.field');
const field2 = document.querySelector('#fieldpass');
const err = document.querySelector('.txt');

const showBtn = document.querySelector('.show');
const submitbtn = document.querySelector('.login');
const submitbtn2 = document.querySelector('.signup');

// let pass = document.getElementById("pass-key").value;

let example_username = "monica";
let example_password = "123";

showBtn.addEventListener('click', function show(){
 if(pass_field.type === "password"){
   pass_field.type = "text";
   showBtn.textContent = "HIDE";
   showBtn.style.color = "#3498db";
 }     
 else{
   pass_field.type = "password";
   showBtn.textContent = "SHOW";
   showBtn.style.color = "#222";
 }

});

submitbtn.addEventListener('click', function(login){
  event.preventDefault();
  // while(field1.textContent != "" ||field2.textContent != ""){
    if(pass_field.value == example_password && user_field.value == example_username){
     window.location = "/teacher_edit";
  }
  // else if(user_field.textContent == "" || pass_field.textContent == ""){}
  else if (user_field.value != example_username || pass_field.value != example_password){
    field1.style.border = "2px solid red";
    field2.style.border = "2px solid red";
    err.textContent = "Wrong username or Password";
  }
  // else{
    
  // }

  // }
  
});