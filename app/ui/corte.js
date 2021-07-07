const { ipcRenderer } = require("electron");
const jornadaForm = document.querySelector("#jornadaForm");
const jornadaVentas = document.querySelector("#jornadaVentas");
const jornadaHorario = document.querySelector("#jornadaHorario");
const jornadaCaja = document.querySelector("#jornadaCaja");
const jornadaList = document.querySelector("#jornadaList");

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
      jornadaList.innerHTML = "";           
      jornada.map(t => {
        let dateFormat = new Date();
        dateFormat = dateFormat.toLocaleString();//toISOString().split('.')[0]+"Z";
        jornadaList.innerHTML += `
        <tr>
          <td>
            <div class="accordion accordion-flush" id="ventasAccordion">                    
            </div>
          </td>
          <td>${dateFormat}</td>
          <td>${t.caja}</td>
          <td id="recaudacion"></td>
      </tr>
        `;
        console.log(t.ventas);
        let recaudacion = document.querySelector("#recaudacion");
        let ventasAccordion = document.querySelector("#ventasAccordion");
        let total = 0;
        for(var i=0; i < t.ventas.length; i++) {
          total = total + t.ventas[i].precio;
          ventasAccordion.innerHTML += `
          <div class="accordion-item">
          <h2 class="accordion-header" id="panelsStayOpen-headingOne">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
              ${t.ventas[i].nombre} x${t.ventas[i].cantidad}
            </button>
          </h2>
          <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
            <div class="accordion-body">
            <p>Nombre: ${t.ventas[i].nombre}</p>
            <p>Precio: $${t.ventas[i].precio}</p>
            <p>Cantidad: ${t.ventas[i].cantidad}</p>
            <p>Codigo: ${t.ventas[i].codigo}</p>
            </div>
          </div>
        </div>
          `;
        }
        recaudacion.innerHTML = total;
      });      
    }
    
  
    let jornada = [];
  
  ipcRenderer.send("get-jornada");
  
  jornadaForm.addEventListener("submit", async e => {
    e.preventDefault();
  
    const jornada = {
      ventas: jornadaVentas.value,
      horario: jornadaHorario.value,
      caja: jornadaCaja.value
    };
  
    if (!updateStatus) {
      ipcRenderer.send("new-jornada", jornada);
    } else {
      ipcRenderer.send("update-jornada", { ...jornada, idJornadaToUpdate });
    }
  
    jornadaForm.reset();
  });
  
  ipcRenderer.on("new-jornada-created", (e, arg) => {
    console.log(arg);
    const jornadaSaved = JSON.parse(arg);
    jornada.push(jornadaSaved);
    renderJornada(jornada);
  });
  
  ipcRenderer.on("get-jornada", (e, args) => {
    const receivedJornada = JSON.parse(args);
    jornada = receivedJornada;
    renderJornada(jornada);
  });
  
  ipcRenderer.on("delete-jornada-success", (e, args) => {
    const deletedJornada = JSON.parse(args);
    const newJornada = jornada.filter(t => {
      return t._id !== deletedJornada._id;
    });
    jornada = newJornada;
    renderJornada(jornada);
  });
  
  ipcRenderer.on("update-jornada-success", (e, args) => {
    updateStatus = false;
    const updatedJornada = JSON.parse(args);
    jornada = jornada.map((t, i) => {
      if (t._id === updatedJornada._id) {
        t.ventas = updatedJornada.ventas;
        t.horario = updatedJornada.horario;
        t.caja = updatedJornada.caja;
      }
      return t;
    });
    renderJornada(jornada);
  });