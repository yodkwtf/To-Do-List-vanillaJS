// =========== SELECT ELEMENTS ===========
const alert = document.querySelector('.alert');
const form = document.querySelector('.form');
const formInput = document.querySelector('.form-input');
const submitBtn = document.querySelector('.submit-btn');
const clearBtn = document.querySelector('.clear-btn');
const tasksContainer = document.querySelector('.tasks-container');
const tasks = document.querySelector('.tasks');

// edit option
let editElement;
let editStage = false;
let editID = '';

// =========== EVENT LISTENERS ===========
// submiting form
form.addEventListener('submit', addItem);

// =========== FUNCTIONS ===========

// *** Add Item
function addItem(e) {
  // 1.) prevent default
  e.preventDefault();
  // 2.) get value of task
  const value = formInput.value;
  // 3.) get a unique id(in milliseconds)
  const id = new Date().getTime().toString();
  // 4.) check conditions
  if (value && !editStage) {
    // -------------------> ADD ITEM
    // create article
    const article = document.createElement('article');
    // add class
    article.classList.add('task');
    // add id
    article.setAttribute('data-id', id);
    // add task
    article.innerHTML = `  
    <p class="task-title">${value}</p>
    <div class="btn-container">
      <button class="edit-btn">
        <i class="lar la-edit"></i>
      </button>
      <button class="delete-btn">
        <i class="lar la-trash-alt"></i>
      </button>
    </div>`;
    // append to parent
    tasks.appendChild(article);
    // show alert
    alertMsg('success', 'added to tasks :)');
    // display tasks
    tasksContainer.classList.add('show-container');
    // set to default
    setToDefault();
  } else if (value && editStage) {
    // -------------------> EDIT ITEM
    console.log('Edit item');
  } else {
    // -------------------> ask to enter value(alert)
    alertMsg('danger', 'please add a task!!');
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
  formInput.value = '';
  editStage = false;
  editID = '';
  submitBtn.textContent = 'add task';
}
