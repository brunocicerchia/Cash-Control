const { BrowserWindow, ipcMain } = require("electron");
const Task = require("./models/Task");
const Jornada = require("./models/Jornada");

function createWindow() {
  const win = new BrowserWindow({
    width: 500,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.maximize()
  win.loadFile("app/index.html");
}

ipcMain.on("codebar", async (e, arg) => {
  console.log(arg);
  const codebar = await Task.find(arg);
  e.reply("product-searched", codebar);
});

ipcMain.on("new-task", async (e, arg) => {
  const newTask = new Task(arg);
  const taskSaved = await newTask.save();
  e.reply("new-task-created", JSON.stringify(taskSaved));
});

ipcMain.on("get-tasks", async (e, arg) => {
  const tasks = await Task.find();
  e.reply("get-tasks", JSON.stringify(tasks));
});

ipcMain.on("delete-task", async (e, args) => {
  const taskDeleted = await Task.findByIdAndDelete(args);
  e.reply("delete-task-success", JSON.stringify(taskDeleted));
});

ipcMain.on("update-task", async (e, args) => {
  console.log(args);
  const updatedTask = await Task.findByIdAndUpdate(
    args.idTaskToUpdate,
    { name: args.name, description: args.description, price: args.price, fecha: args.fecha, stock: args.stock },
    { new: true }
  );
  e.reply("update-task-success", JSON.stringify(updatedTask));
});

  ////////////////////////////////////////////////
 /////////////  Jornada Logic ///////////////////
////////////////////////////////////////////////

ipcMain.on("new-jornada", async (e, arg) => {
  const newJornada = new Jornada(arg);
  const jornadaSaved = await newJornada.save();
  e.reply("new-jornada-created", JSON.stringify(jornadaSaved));
});

ipcMain.on("delete-jornada", async (e, args) => {
  const jornadaDeleted = await Jornada.findByIdAndDelete(args);
  e.reply("delete-jornada-success", JSON.stringify(jornadaDeleted));
});

ipcMain.on("update-jornada", async (e, args) => {
  console.log(args);
  const updatedJornada = await Jornada.findByIdAndUpdate(
    args.idJornadaToUpdate,
    { fecha: args.fecha, ventas: args.ventas, horario: args.horario, caja: args.caja },
    { new: true }
  );
  e.reply("update-jornada-success", JSON.stringify(updatedJornada));
});

ipcMain.on("get-jornada", async (e, arg) => {
  const jornada = await Jornada.find();
  e.reply("get-jornada", JSON.stringify(jornada));
});

module.exports = { createWindow };
