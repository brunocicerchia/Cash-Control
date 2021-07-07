const { ipcRenderer } = require("electron");

const taskForm = document.querySelector("#taskForm");
const taskName = document.querySelector("#taskName");
const taskPrice = document.querySelector("#taskPrice");
const taskCodebar = document.querySelector("#taskCodebar");
const taskDescription = document.querySelector("#taskDescription");
const taskList = document.querySelector("#taskList");

let updateStatus = false;
let idTaskToUpdate = "";

function deleteTask(id) {
  const response = confirm("Estas seguro de borrar este producto? Esta accion no se puede deshacer!");
  if (response) {
    ipcRenderer.send("delete-task", id);
  }
  return;
}

  function editTask(id) {
    updateStatus = true;
    idTaskToUpdate = id;
    const task = tasks.find(task => task._id === id);
    taskName.value = task.name;
    taskDescription.value = task.description;
    taskPrice.value = task.price;
    taskCodebar.value = task.codebar;
  }
  
  function renderTasks(tasks) {
    taskList.innerHTML = "";
    tasks.map(t => {
      taskList.innerHTML += `
      <tr>
      <td>${t.name}</td>
      <td>${t.description}</td>
      <td>${t.price}</td>
      <td>${t.codebar}</td>
      <td>
        <button class="btn btn-secondary" onclick="editTask('${t._id}'); document.getElementById('tituloAgregar').innerText = 'Editar Producto'" data-bs-toggle="modal" data-bs-target="#productModal">
          Editar
        </button>
      </td>
      <td>
        <button class="btn btn-danger" onclick="deleteTask('${t._id}')">
          Eliminar
        </button>
      </td>
    </tr>
      `;
    });
  }
  
  let tasks = [];

ipcRenderer.send("get-tasks");

taskForm.addEventListener("submit", async e => {
  e.preventDefault();

  const task = {
    name: taskName.value,
    description: taskDescription.value,
    price: taskPrice.value,
    codebar: taskCodebar.value
  };

  console.log(updateStatus);

  if (!updateStatus) {
    ipcRenderer.send("new-task", task);
  } else {
    ipcRenderer.send("update-task", { ...task, idTaskToUpdate });
  }

  taskForm.reset();
});

ipcRenderer.on("new-task-created", (e, arg) => {
  console.log(arg);
  const taskSaved = JSON.parse(arg);
  tasks.push(taskSaved);
  console.log(tasks);
  renderTasks(tasks);
  taskName.focus();
});

ipcRenderer.on("get-tasks", (e, args) => {
  const receivedTasks = JSON.parse(args);
  tasks = receivedTasks;
  console.log(tasks);
  renderTasks(tasks);
});

ipcRenderer.on("delete-task-success", (e, args) => {
  const deletedTask = JSON.parse(args);
  const newTasks = tasks.filter(t => {
    return t._id !== deletedTask._id;
  });
  tasks = newTasks;
  renderTasks(tasks);
});

ipcRenderer.on("update-task-success", (e, args) => {
  updateStatus = false;
  const updatedTask = JSON.parse(args);
  tasks = tasks.map((t, i) => {
    if (t._id === updatedTask._id) {
      t.name = updatedTask.name;
      t.description = updatedTask.description;
      t.price = updatedTask.price;
      t.codebar = updatedTask.codebar;
    }
    return t;
  });
  renderTasks(tasks);
});