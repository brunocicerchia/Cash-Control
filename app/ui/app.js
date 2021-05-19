const { ipcRenderer } = require("electron");

const searchForm = document.querySelector("#searchForm");
const searchCodebar = document.querySelector("#searchCodebar");
const precioProducto = document.querySelector("#precioTotal");
const searchList = document.querySelector("#searchList")
var cantidad = 1;
var cuentaTotal = 0;
var productosCarrito = 1;
var codigoScanned = null;
var productosDiferentes = 0;


searchForm.addEventListener("submit", async e => {
  e.preventDefault();

  var codebarToSearch = searchCodebar.value;

  const codebarSearch = { codebar: codebarToSearch }

  ipcRenderer.send("codebar", codebarSearch);
  searchForm.reset();
});

ipcRenderer.on('product-searched', (e, arg) => {
  const nameResult = arg[0]._doc.name
  const descResult = arg[0]._doc.description
  let priceResult = arg[0]._doc.price
  const codebarResult = arg[0]._doc.codebar
  var cantidadResult = document.querySelector("#cantidadProducto");

  if(codigoScanned == codebarResult) {
    codigoScanned = codebarResult;
    var idCantidad = "#cantidadProducto" + productosDiferentes;
    cantidadResult = document.querySelector(idCantidad);
    cantidadResult.innerHTML = ++cantidad;
  } else {
    codigoScanned = codebarResult;
    cantidad = 1;
    productosDiferentes = productosDiferentes + 1;
    searchList.innerHTML += `
    <tr>
      <th scope="row">${nameResult}</th>
      <td class="text-center" id="precioProducto">$${priceResult}</td>
      <th class="text-center" id="cantidadProducto${productosDiferentes}">${cantidad}</th>
      <td class="text-center" id="codigoProducto${productosCarrito}">${codebarResult}</td>
      <td></td>
    </tr>
    `;    
  }

  priceResult = parseInt(priceResult, 10)
  cuentaTotal = cuentaTotal + priceResult;
  precioProducto.innerHTML = `
    <h3>Precio Total: $${cuentaTotal}</h3>
  `;  
})