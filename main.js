let todoInput_DOM = document.querySelector(".initial-input");
let toggleCheckboxes_DOM = document.querySelector(".toggle-all-checkboxes");
let ul_DOM = document.querySelector("ul");

let todoArr = [];
let isChecked = true;
let input_id = ""

function randomIdGenerator(){
    let randomId = "a"
    for(let i = 0;i < 10;i++){
        randomId += Math.floor(Math.random() * 10);
    }
    return randomId;
}

function printAllTodos(todoArr){
    ul_DOM.innerHTML = "";
    todoArr.forEach(todoItem => {
        ul_DOM.innerHTML += `
        <li class="todo-item" id="${todoItem.id}">
            <span class="todo-item-checkbox-span">
                <input type="checkbox" class="todo-item-checkbox" ${todoItem.checked ? "checked" : ""}>
            </span>
            <span class="todo-item-content-span">
            ${todoItem.todo}
            </span>
            <span class="todo-item-close">
            &times;
            </span>
        </li>
    `
    })
    const todoCheckboxes_DOM = document.querySelectorAll(".todo-item-checkbox");
    todoCheckboxes_DOM.forEach(todoCheckbox => {
        todoCheckbox.addEventListener("click",handleIndividualTodoCheckbox);
    })

    const todoRemove_DOM = document.querySelectorAll(".todo-item-close");
    todoRemove_DOM.forEach(todoClose => {
        todoClose.addEventListener("click",handleIndividualCloseTodo);
    })
    
}




function insertInfoAtEnd(){
    
    let liEndHtml = `
    <li class="last-li-one">
        <div class="items-left">
            ${todoArr.reduce((todosLeft,todo) => {
                if(!todo.checked) todosLeft++
                return todosLeft;
            },0)} items left
        </div>
        <div>
            <button class="all-tasks last-li-button">All</button>
            <button class="active-tasks last-li-button">Active</button>
            <button class="completed-tasks last-li-button">Completed</button>
        </div>
        <button class="clear-completed-tasks last-li-button">
            Clear completed
        </button>
    </li>
        <li class="last-li-two">
    </li>
    `
    return liEndHtml;
}


function handleIndividualCloseTodo(event){
    const getId = event.target.parentElement.getAttribute("id");
    todoArr = todoArr.filter(todoItem => todoItem.id !== getId);
    printAllTodos(todoArr);
    if(todoArr.length) {
        ul_DOM.insertAdjacentHTML("beforeend",insertInfoAtEnd());
        
    }
    if(!todoArr.length) toggleCheckboxes_DOM.style.visibility = "hidden";
}

function handleIndividualTodoCheckbox(event){
   const getId = event.target.parentElement.parentElement.getAttribute("id");
   const index = todoArr.findIndex(todoItem => todoItem.id === getId);
   
   const todoItemObj = todoArr[index];
   todoItemObj.checked = !todoItemObj.checked;
   todoArr[index] = todoItemObj;
   printAllTodos(todoArr);
   if(todoArr.length) {
       ul_DOM.insertAdjacentHTML("beforeend",insertInfoAtEnd());
       
    }
}




function handleTodoAdd(event){
    if(event.keyCode !== 13)return;
    let todoValue = todoInput_DOM.value;

    todoArr.push({
        todo:todoValue,
        checked: false,
        id:`${randomIdGenerator()}`
    })

    printAllTodos(todoArr);
    if(todoArr.length) {
        ul_DOM.insertAdjacentHTML("beforeend",insertInfoAtEnd());
        ;
    }


    todoInput_DOM.value = "";
    toggleCheckboxes_DOM.style.visibility = "visible";
}

function handleClickOnToggleCheckboxes(event){
    if(!event.target.closest(".toggle-all-checkboxes")) return;
    todoArr = todoArr.map(todoItem => ({id:todoItem.id,todo:todoItem.todo,checked:isChecked}) );
    printAllTodos(todoArr);
    if(todoArr.length) {
        ul_DOM.insertAdjacentHTML("beforeend",insertInfoAtEnd());
        
    }
    isChecked = !isChecked;
}

function handleClickOnActiveTasksButton(event){
    if(!event.target.closest(".active-tasks"))return;
    let activeTodoArr = todoArr.filter(todoItem => !todoItem.checked);
    printAllTodos(activeTodoArr);
    
    ul_DOM.insertAdjacentHTML("beforeend",insertInfoAtEnd());
    //event.target.closest(".active-tasks").classList.add("selected")
}

function handleClickOnAllTasksButton(event){
    if(!event.target.closest(".all-tasks")) return;
    printAllTodos(todoArr);
    ul_DOM.insertAdjacentHTML("beforeend",insertInfoAtEnd());
}

function handleClickOnCompletedTasksButton(event){
    if(!event.target.closest(".completed-tasks")) return;
    let completedTodoArr = todoArr.filter(todoItem => todoItem.checked);
    printAllTodos(completedTodoArr);
    ul_DOM.insertAdjacentHTML("beforeend",insertInfoAtEnd());
}

function handleClickOnClearCompletedTasksButton(event){
    if(!event.target.closest(".clear-completed-tasks")) return;
    todoArr = todoArr.filter(todoItem => !todoItem.checked);
    printAllTodos(todoArr);
    ul_DOM.insertAdjacentHTML("beforeend",insertInfoAtEnd());

}

todoInput_DOM.addEventListener("keyup",handleTodoAdd);

document.body.addEventListener("click",function(event){
    handleClickOnToggleCheckboxes(event);

    //handle click on clicking activeTasks;
    handleClickOnActiveTasksButton(event);

    //handle click on clicking allTasks;
    handleClickOnAllTasksButton(event);

    //handle click on clicking completed tasks
    handleClickOnCompletedTasksButton(event);

    //handle clear-completed-tasks
    handleClickOnClearCompletedTasksButton(event);
})

document.body.addEventListener("keyup",function(event){
    if(event.keyCode !== 13) return;
    if(event.target.closest(".initial-input")) return;
    handleClickOutsideOrEnterOnEditTodo(event);
    
})

function handleClickOutsideOrEnterOnEditTodo(event){
    if(input_id.length){
        let selector = `#${input_id}`;
        let newTodo = document.querySelector(selector);
        let index = todoArr.findIndex(todoItem => todoItem.id === input_id);
        let toBeReplacedTodo = todoArr[index] ;
        toBeReplacedTodo = {id:toBeReplacedTodo.id,checked:toBeReplacedTodo.checked,todo:newTodo.children[1].value};
        todoArr[index] = toBeReplacedTodo;
        printAllTodos(todoArr);
        ul_DOM.insertAdjacentHTML("beforeend",insertInfoAtEnd());
       input_id = "";
    }
}

document.body.addEventListener("dblclick",function(event){
    if(!event.target.closest(".todo-item")) return;
    let liElement = event.target.closest(".todo-item");

    let oldElement = liElement.querySelector(".todo-item-content-span")
    input_id = oldElement.parentElement.getAttribute("id");


    let todoItemInputContentSpan = document.createElement("input");
    todoItemInputContentSpan.className = "todo-item-input-content-span"
    
    todoItemInputContentSpan.autofocus = true;
    todoItemInputContentSpan.value = oldElement.textContent.trim();

    liElement.replaceChild(todoItemInputContentSpan,oldElement);
})


