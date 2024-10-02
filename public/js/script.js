let menu_btn = document.getElementById('menu-btn-in');
let sidebar = document.getElementById('sidebar1');

menu_btn.addEventListener('click', () => {
  sidebar.classList.toggle('active'); 
});


let addTask1=document.getElementById('add-task1');
let addTask2=document.getElementById('add-task2');
let addContainer=document.getElementById('add-container');

addTask1.addEventListener('click', () => {
    overlay.style.display = 'block';  
    addContainer.style.display = 'block';
});

addTask2.addEventListener('click', () => {
  overlay.style.display = 'block';  
  addContainer.style.display = 'block';
});


/*js for add new list button*/ 
let listContainer = document.getElementById('list-container');
let addNewTask1=document.getElementById('add-new-list1');
let addNewTask2=document.getElementById('add-new-list2');
let editProfileBtn1=document.getElementById('edit-profile-btn1');
let editProfileBtn2=document.getElementById('edit-profile-btn2');
let editProfileContainer=document.getElementById('editProfileContainer');

addNewTask1.addEventListener('click',()=>{
  listContainer.style.display = 'block'; 
  overlay.style.display = 'block'; 
})

addNewTask2.addEventListener('click',()=>{
  listContainer.style.display = 'block'; 
  overlay.style.display = 'block'; 
})


overlay.addEventListener('click', () => {
  addContainer.style.display = 'none'; 
  overlay.style.display = 'none';   
  listContainer.style.display = 'none';  
  editProfileContainer.style.display = 'none';
});

editProfileBtn1.addEventListener('click',()=>{
  editProfileContainer.style.display = 'block'; 
  overlay.style.display = 'block'; 
})

editProfileBtn2.addEventListener('click',()=>{
  editProfileContainer.style.display = 'block'; 
  overlay.style.display = 'block'; 
})

