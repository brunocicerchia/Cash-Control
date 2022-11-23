const { ipcRenderer } = require("electron");
const jornadaForm = document.querySelector("#jornadaForm");
const jornadaVentas = document.querySelector("#jornadaVentas");
const jornadaHorario = document.querySelector("#jornadaHorario");
const jornadaCaja = document.querySelector("#jornadaCaja");
const jornadaList = document.querySelector("#jornadaList");
const ventaItems = document.querySelector("#ventas");

let updateStatus = false;
let idJornadaToUpdate = "";

function deleteJornada(id) {
    const response = confirm("Estas seguro de borrar este producto? Esta accion no se puede deshacer!");
    if (response) {
      ipcRenderer.send("delete-jornada", id);
    }
    return;
  }
  
    function editJornada(id) {
      updateStatus = true;
      idJornadaToUpdate = id;
      const jornada = jornada.find(jornada => jornada._id === id);
      jornadaVentas.value = jornada.ventas;
      jornadaHorario.value = jornada.horario;
      jornadaCaja.value = jornada.caja;
    }
    
    function renderJornada(jornada) {
      console.log(jornada)
      jornadaList.innerHTML = "";
      jornada.map(function (t, index) {
        dateFormat = new Date(t.horario)
        jornadaList.innerHTML += `
          <tr>
            <td>
              <ul>
                ${jornada[index].ventas.map(i=> {
                  return `<li>${i.nombre} x${i.cantidad}</li>`
                })}
              </ul>
            </td>
            <td>${dateFormat.toLocaleString()}</td>
            <td>${t.caja}</td>
            <td>$${t.total}</td>
        </tr>
        `;
      })
      }
    
  
    let jornada = [];
  
  ipcRenderer.send("get-jornada");
  
  // jornadaForm.addEventListener("submit", async e => {
  //   e.preventDefault();
  
  //   const jornada = {
  //     ventas: jornadaVentas.value,
  //     horario: jornadaHorario.value,
  //     caja: jornadaCaja.value
  //   };
  
  //   if (!updateStatus) {
  //     ipcRenderer.send("new-jornada", jornada);
  //   } else {
  //     ipcRenderer.send("update-jornada", { ...jornada, idJornadaToUpdate });
  //   }
  
  //   jornadaForm.reset();
  // });
  
  // ipcRenderer.on("new-jornada-created", (e, arg) => {
  //   console.log(arg);
  //   const jornadaSaved = JSON.parse(arg);
  //   jornada.push(jornadaSaved);
  //   renderJornada(jornada);
  // });
  
  ipcRenderer.on("get-jornada", (e, args) => {
    const receivedJornada = JSON.parse(args);
    jornada = receivedJornada;
    renderJornada(jornada);
  });
  
  // ipcRenderer.on("delete-jornada-success", (e, args) => {
  //   const deletedJornada = JSON.parse(args);
  //   const newJornada = jornada.filter(t => {
  //     return t._id !== deletedJornada._id;
  //   });
  //   jornada = newJornada;
  //   renderJornada(jornada);
  // });
  
  // ipcRenderer.on("update-jornada-success", (e, args) => {
  //   updateStatus = false;
  //   const updatedJornada = JSON.parse(args);
  //   jornada = jornada.map((t, i) => {
  //     if (t._id === updatedJornada._id) {
  //       t.ventas = updatedJornada.ventas;
  //       t.horario = updatedJornada.horario;
  //       t.caja = updatedJornada.caja;
  //     }
  //     return t;
  //   });
  //   renderJornada(jornada);
  // });