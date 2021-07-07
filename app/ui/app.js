const { ipcRenderer, remote } = require("electron");
const {PosPrinter} = require('electron').remote.require("electron-pos-printer");

const searchForm = document.querySelector("#searchForm");
const searchCodebar = document.querySelector("#searchCodebar");
const precioProducto = document.querySelector("#precioTotal");
const searchList = document.querySelector("#searchList");
const ticketItems = document.querySelector("#itemsList");
const ticketPrint = document.querySelector("#imprimir");

console.log("7798008292598");
console.log("7790070936479");

let cantidad = 1;
let cuentaTotal = 0;
let productosCarrito = 1;
let codigoScanned = null;
let productosDiferentes = 0;
let clicks = 0;

const ventas = [];

let updateStatus = false;
let idJornadaToUpdate = "";

//Exportar Valores Ticket
let precioFinal = 0;

searchForm.addEventListener("submit", async e => {
  e.preventDefault();

  var codebarToSearch = searchCodebar.value;

  const codebarSearch = { codebar: codebarToSearch }

  ipcRenderer.send("codebar", codebarSearch);
  searchForm.reset();
});

ipcRenderer.on('product-searched', (e, arg) => {
  const nameResult = arg[0]._doc.name
  let priceResult = arg[0]._doc.price
  let codebarResult = arg[0]._doc.codebar

  //if(codigoScanned == codebarResult) {
    
  if(document.querySelector('#A' + codebarResult) !== null) {
    //Producto Duplicado
    codigoScanned = codebarResult;
    let idCantidad = "#A" + codebarResult;
    let idTicket = "#cantidadTicket" + productosDiferentes;
    cantidadResult = document.querySelector(idCantidad);
    cantidadTicket = document.querySelector(idTicket);
    cantidad = cantidadResult.innerHTML;
    cantidadResult.innerHTML = ++cantidad;
    cantidadTicket.innerHTML = "x" + cantidad;
    contadorUnidad = cantidad;
  } else {
    //Producto Nuevo
    codigoScanned = codebarResult;
    cantidad = 1;
    productosDiferentes = productosDiferentes + 1;
    searchList.innerHTML += `
    <tr>
      <th scope="row" id="${productosDiferentes}">${nameResult}</th>
      <td class="text-center" id="precioProducto${productosDiferentes}">$${priceResult}</td>
      <th class="text-center" id="A${codigoScanned}">${cantidad}</th>
      <td class="text-center" id="codigoProducto${productosCarrito}">${codebarResult}</td>
      <td></td>
    </tr>
    `;  
    ticketItems.innerHTML += `
    <tr>
      <th scope="row" id="nombreProductos${productosDiferentes}">${nameResult} <b id="cantidadTicket${productosDiferentes}">x${cantidad}</b></th>
      <td class="text-center" id="precioProductos${productosDiferentes}">$${priceResult}</td>
    </tr>
    `;
  }

  priceResult = parseInt(priceResult, 10)
  cuentaTotal = cuentaTotal + priceResult;
  precioFinal = cuentaTotal;
  precioProducto.innerHTML = `
    <h3>Precio Total: $${cuentaTotal}</h3>
  `;
})



//IMPRIMIR TICKET

console.log(webContent.getPrinters());

const options = {
  preview: false,                // Preview in window or print
  width: '100%',                //  width of content body
  margin: '0 0 0 0',            // margin of content body
  copies: 1,                    // Number of copies to print
  printerName: 'HP Deskjet 3050 J610 series (Red)',        // printerName: string, check with webContent.getPrinters()
  timeOutPerLine: 400,
  pageSize: { height: 150000, width: 80000 },  // page size
  silent: false
}

let data = [
  {
     type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
     value: 'Polleria de Tobias',
     style: `text-align:center;`,
     css: {"font-weight": "700", "font-size": "18px"}
  },
]

function cobrarTicket() {
  let precioFinal = document.querySelector("#precioFinal");
  
  data = [];
  data.push({
    type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
    value: 'Polleria de Tobias',
    style: `text-align:center;`,
    css: {"font-weight": "700", "font-size": "18px"}
 })

  for(let contadorTicket = 0; ticketItems.rows.length > contadorTicket; contadorTicket++) {
    let contadorTicket2 = contadorTicket+1;
    let idNombre = "#nombreProductos" + contadorTicket2;
    let idPrecio = "#precioProductos" + contadorTicket2;
    let nombre = document.querySelector(idNombre).innerHTML;
    let precio = document.querySelector(idPrecio).innerHTML;

    data.push({
      id: 'item',
      type: 'text',
      value: `${nombre} -- ${precio}`,
      css: {"font-size": "12px", "text-align": "center"}
    });
  }

  data.push({
    id: 'precio',
    type: 'text',
    value: `Total: $${precioFinal.innerHTML}`,
    css: {"font-size": "12px", "text-align": "center"}
  });
  
  PosPrinter.print(data, options)
  .then(() => {})
  .catch((error) => {
     console.error(error);
  });
}

function cobrar() {
  let precioFinal = document.querySelector("#precioFinal");
  let precioFooter = document.querySelector("#priceFooter");
  if(clicks < 1) {
    precioFooter.innerHTML += `
    <tr>
      <th >Total: $<b id="precioFinal">${cuentaTotal}</b></th>
    </tr>
    `;
    clicks = 100;
  } else {    
    precioFinal.innerHTML = `${cuentaTotal}`;
  }

  for ( var i = 0; i < searchList.rows.length; i++ ) {
    let precio = searchList.rows[i].cells[1].innerHTML.replace('$', '');
    precio = parseInt(precio, 10)
    ventas.push({
        nombre: searchList.rows[i].cells[0].innerHTML,
        precio: precio,
        cantidad: searchList.rows[i].cells[2].innerHTML,
        codigo: searchList.rows[i].cells[3].innerHTML,
    });
  }

  // Necesito convertir los productos en un array

  const jornada = {
    ventas: ventas,
    horario: new Date(),
    caja: 1
  };

  if (!updateStatus) {
    ipcRenderer.send("new-jornada", jornada);
  } else {
    ipcRenderer.send("update-jornada", { ...jornada, idJornadaToUpdate });
  }

  ipcRenderer.on("new-jornada-created", (e, arg) => {
    console.log(arg);
    const jornadaSaved = JSON.parse(arg);
    jornada.push(jornadaSaved);
    renderJornada(jornada);
    jornadaFecha.focus();
  });
}