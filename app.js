// =========== SELECT ELEMENTS ===========
const alert = document.querySelector('.alert');
const form = document.querySelector('.form');
const formInput = document.querySelector('.form-input');
const submitBtn = document.querySelector('.submit-btn');
const clearBtn = document.querySelector('.clear-btn');
const noBtn = document.getElementById('no');
const yesBtn = document.getElementById('yes');
const tasksContainer = document.querySelector('.tasks-container');
const tasks = document.querySelector('.tasks');

// edit option
let taskTitle;
let editStage = false;
let editID = '';

// =========== EVENT LISTENERS ===========
// submiting form
form.addEventListener('submit', checkStage);
// clear all
clearBtn.addEventListener('click', function () {
  document.querySelector('.modal-overlay').classList.add('open-modal');
});
// no btn in confirm box
noBtn.addEventListener('click', function () {
  document.querySelector('.modal-overlay').classList.remove('open-modal');
});
// yes btn in confirm box
yesBtn.addEventListener('click', clearItems);
// load items initially
window.addEventListener('DOMContentLoaded', init);

// =========== FUNCTIONS ===========

// *** Check Stage
function checkStage(e) {
  // 1.) prevent default
  e.preventDefault();
  // 2.) get value of task
  const task = formInput.value;
  // 3.) get a unique id(in milliseconds)
  const id = new Date().getTime().toString();
  // 4.) check conditions
  if (task && !editStage) {
    // a. value exists & edit stage false
    // -------------------> ADD ITEM
    addItem(id, task);
    alertMsg('primary', 'added to tasks ✔');
    addToLocalStorage(id, task);
    setToDefault();
  } else if (task && editStage) {
    // b. value exits & edit stage true
    // -------------------> EDIT ITEM
    taskTitle.textContent = task;
    alertMsg('success', 'task edited successfully ✔');
    editToLocalStorage(editID, task);
    setToDefault();
  } else {
    // c. no value in form input
    // -------------------> ask to enter value(alert)
    alertMsg('danger', 'please add a task!!');
  }
}

// *** Add Item
function addItem(id, task) {
  // create article
  const article = document.createElement('article');
  // add class
  article.classList.add('task');
  // add id
  article.setAttribute('data-id', id);
  // add task
  article.innerHTML = `  
  <p class="task-title">${task}</p>
  <div class="btn-container">
    <button class="edit-btn">
      <i class="lar la-edit"></i>
    </button>
    <button class="delete-btn">
      <i class="lar la-trash-alt"></i>
    </button>
  </div>`;
  // select new btns
  const editBtn = article.querySelector('.edit-btn');
  const deleteBtn = article.querySelector('.delete-btn');
  // event listeneres for btns
  editBtn.addEventListener('click', editItem);
  deleteBtn.addEventListener('click', deleteItem);
  // append to parent
  tasks.appendChild(article);
  // display tasks
  tasksContainer.classList.add('show-container');
}

// *** Edit Item
function editItem(e) {
  // select task
  const task = e.currentTarget.parentElement.parentElement;
  // set edit item
  taskTitle = e.currentTarget.parentElement.previousElementSibling;
  // set input to task title
  formInput.value = taskTitle.textContent;
  // set up input colors for edit
  submitBtn.style.background = '#25bb32';
  formInput.style.borderColor = '#25bb32';
  // set edit stage
  editStage = true;
  // set edit id
  editID = task.dataset.id;
  // change submit btn text
  submitBtn.textContent = 'edit task';
}

// *** Delete Item
function deleteItem(e) {
  // select task
  const task = e.currentTarget.parentElement.parentElement;
  // get task id
  const id = task.dataset.id;
  // remove task
  tasks.removeChild(task);
  // show alert box
  alertMsg('danger', 'removed from tasks ✔');
  // hide clear all btn when only 1 task removed
  if (tasks.children.length === 0) {
    tasksContainer.classList.remove('show-container');
  }
  // remove from Local Storage
  deleteFromLocalStorage(id);
  // set to default
  setToDefault();
}

// *** Clear Items
function clearItems() {
  // select all tasks
  const items = document.querySelectorAll('.task');
  // check if tasks exist
  if (items) {
    items.forEach(function (item) {
      // remove task one by one
      tasks.removeChild(item);
    });
    // show alert box
    alertMsg('danger', 'all tasks removed!');
    // remove clear btn
    tasksContainer.classList.remove('show-container');
    // remove confirm box
    document.querySelector('.modal-overlay').classList.remove('open-modal');
    // clear tasks from LS
    localStorage.removeItem('tasks');
    // set back to default
    setToDefault();
  }
}

// *** Alert Msg
function alertMsg(className, msg) {
  // 1. add a text msg
  alert.textContent = msg;
  // 2. add a color for msg
  alert.classList.add(className);
  // 3. remove the alert msg
  setTimeout(function () {
    alert.textContent = '';
    alert.classList.remove(className);
  }, 1200);
}

// *** Set To Default
function setToDefault() {
  // empty input field
  formInput.value = '';
  // original border-color
  formInput.style.borderColor = '#166abb';
  // no edit stage
  editStage = false;
  // no edit id
  editID = '';
  // original submit btn text
  submitBtn.textContent = 'add task';
  // original submit btn color
  submitBtn.style.background = '#166abb';
}

// =========== LOCAL STORAGE ===========

// ***** Add to Local Storage
function addToLocalStorage(id, task) {
  // set task into a variable
  const item = { id, task };
  // get tasks array from LS
  let tasks = getFromLocalStorage();
  // put task to tasks array
  tasks.push(item);
  // set tasks back to LS
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ***** Edit to Local Storage
function editToLocalStorage(id, title) {
  // get tasks array from LS
  let tasks = getFromLocalStorage();
  // loop over tasks one by one
  tasks = tasks.map(function (task) {
    // if task id matches to edited task id, change task title
    if (task.id === id) {
      task.task = title;
    }
    // return in both cases
    return task;
  });
  // set tasks back to LS
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ***** Delete from Local Storage
function deleteFromLocalStorage(id) {
  // get tasks array from LS
  let tasks = getFromLocalStorage();
  // filter tasks
  tasks = tasks.filter(function (task) {
    // if task id is equal to deleted task id then dont save , otherwise save it to tasks
    if (task.id !== id) {
      return task;
    }
  });
  // set tasks back to LS
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ***** Get tasks from Local Storage
function getFromLocalStorage() {
  // create an array tasks with ternary operator or get it if already exists
  return localStorage.getItem('tasks')
    ? JSON.parse(localStorage.getItem('tasks'))
    : [];
}

// =========== INIT FUNCTION ===========

function init() {
  // get tasks array from LS
  let tasks = getFromLocalStorage();
  // check if tasks array isn't empty
  if (tasks.length > 0) {
    // loop over tasks one by one
    tasks.forEach(function (task) {
      // add task to UI using function
      addItem(task.id, task.task);
    });
  }
}
