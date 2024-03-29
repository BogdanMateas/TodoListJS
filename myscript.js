//initializing the consts
const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteListButton = document.querySelector("[data-delete-list-button]");
const listDisplayContainer = document.querySelector(
  "[data-list-display-container]"
);
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const tasksContainer = document.querySelector("[data-tasks]");
const taskTemplate = document.getElementById("task-template");

const allTasks = document.querySelector("[data-list-all-tasks]");
const completedTasks = document.querySelector("[data-list-completed-tasks]");
const incompletedTasks = document.querySelector(
  "[data-list-incompleted-tasks]"
);

//creating a const for storing the lists array, by key
const LOCAL_STORAGE_LIST = "todo.lists";
// creating a let for the selected list by id (you can identify it by the blue color when clicked)
const LOCAL_STORAGE_SELECTED_LIST_ID = "todo.tasks.selectedListId";
//taking it from local storage
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID) || [];
//it takes the ''lists'' from the localstorage, if not empty. And it parse it into an object because it s coming as a string
let todoLists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST)) || [];

//selecting the list when clicked
listsContainer.addEventListener("click", e => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});
//checking and saving the task
tasksContainer.addEventListener("click", e => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = todoLists.find(list => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(
      task => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
  }
});

//creating a list
function createList(name) {
  return {
    //creating a unique id by stringifying the current date in miliseconds from 1970
    id: Date.now().toString(),
    name: name,
    tasks: []
  };
}

function createTask(name) {
  return {
    id: Date.now().toString(),
    name: name,
    complete: false
  };
}

//adding a new list when entered
newListForm.addEventListener("keypress", function(e) {
  if (e.code === "Enter") {
    e.preventDefault();
    const listName = newListInput.value;
    if (listName == null || listName === "") return;
    const list = createList(listName);
    newListInput.value = null;
    todoLists.push(list);
    saveAndRender();
  }
});

//adding new task
newTaskForm.addEventListener("keypress", function(e) {
  if (e.code === "Enter") {
    e.preventDefault();
    const taskName = newTaskInput.value;
    if (taskName == null || taskName === "") return;
    const task = createTask(taskName);
    newTaskInput.value = null;
    const selectedListAllTasks = todoLists.find(
      list => list.id === selectedListId
    );
    selectedListAllTasks.tasks.push(task);
    saveAndRender();
  }
});

function saveAndRender() {
  save();
  render();
}

function save() {
  //saving/setting the lists to the local storage
  localStorage.setItem(LOCAL_STORAGE_LIST, JSON.stringify(todoLists));
  //saving the selected list
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID, selectedListId);
}
//clears everything and then rerenders all
function render() {
  clearElement(listsContainer);
  renderLists();
  const selectedListAllTasks = todoLists.find(
    list => list.id === selectedListId
  );
  if (!selectedListAllTasks) return;
  clearElement(tasksContainer);
  renderTasks(selectedListAllTasks);
  listDisplayContainer.style.display = "flex";
}

const displayOldList = () => {
  tasksContainer.childNodes.forEach(item => {
    item.style.display = "flex";
  });
};

const showCompleted = () => {
  const selectedList = todoLists.find(list => list.id === selectedListId);
  completedTasks.classList = "active";
  if (allTasks.classList.contains("active")) {
    allTasks.classList.remove("active");
  }
  if (incompletedTasks.classList.contains("active")) {
    incompletedTasks.classList.remove("active");
  }
  displayOldList();
  selectedList.tasks.forEach(task => {
    if (task.complete === false) {
      tasksContainer.childNodes.forEach(item => {
        if (item.children[0].getAttribute("for") === task.id) {
          item.style.display = "none";
        }
      });
    }
  });
};

const showIncompleted = () => {
  const selectedList = todoLists.find(list => list.id === selectedListId);
  incompletedTasks.classList = " active";
  if (completedTasks.classList.contains("active")) {
    completedTasks.classList.remove("active");
  }
  if (allTasks.classList.contains("active")) {
    allTasks.classList.remove("active");
  }
  displayOldList();
  tasksContainer.style.display = "flex";
  selectedList.tasks.forEach(task => {
    if (task.complete === true) {
      tasksContainer.childNodes.forEach(item => {
        if (item.children[0].getAttribute("for") === task.id) {
          item.style.display = "none";
        }
      });
    }
  });
};
completedTasks.addEventListener("click", showCompleted);
incompletedTasks.addEventListener("click", showIncompleted);
allTasks.addEventListener("click", displayOldList);
allTasks.addEventListener("click", function() {
  allTasks.classList = " active";
  if (completedTasks.classList.contains("active")) {
    completedTasks.classList.remove("active");
  }
  if (incompletedTasks.classList.contains("active")) {
    incompletedTasks.classList.remove("active");
  }
});

function renderTasks(selectedList) {
  if (!selectedList) return;
  selectedList.tasks.forEach(task => {
    const taskElement = document.createElement("div");
    const checkbox = document.createElement("input");
    const label = document.createElement("label");
    const span = document.createElement("span");
    taskElement.className = "task";
    taskElement.dataset.taskId = task.id;
    checkbox.type = "checkbox";
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    label.className = "container";
    span.className = "checkmark";
    label.htmlFor = task.id;
    label.append(task.name);
    label.append(checkbox);
    label.append(span);
    taskElement.appendChild(label);
    const image = document.createElement("img");
    taskElement.append(image);
    tasksContainer.appendChild(taskElement);
    image.src = "image.svg";
    image.addEventListener("click", function(e) {
      const taskToDelete = this.parentNode.dataset.taskId;
      for (let i = 0; i < selectedList.tasks.length; i++) {
        if (selectedList.tasks[i].id == taskToDelete) {
          selectedList.tasks.splice(i, 1);
        }
      }
      saveAndRender();
    });
  });
}
//rendering the lists
function renderLists() {
  todoLists.forEach(list => {
    const listElement = document.createElement("li");
    const imageElement = document.createElement("img");
    imageElement.src = "image.svg";
    imageElement.className = "del";
    listElement.dataset.listId = list.id;
    listElement.classList.add("list");
    listElement.innerText = list.name;
    listElement.append(imageElement);
    //if our list's id is the selected list's id, add a class which is styling it with blue color
    if (list.id === selectedListId) {
      listElement.classList.add("active-list");
    }
    listsContainer.appendChild(listElement);
    const deleteImage = listElement.querySelector("img");
    deleteImage.addEventListener("click", function() {
      const deleteId = this.parentNode.dataset.listId;
      for (let i = 0; i < todoLists.length; i++) {
        if (todoLists[i].id == deleteId) {
          todoLists.splice(i, 1);
          listDisplayContainer.style.display = "none";
        }
      }
      saveAndRender();
    });
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
