const socket = io();

const formNewProduct = document.getElementById("formNewProduct");

formNewProduct.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const formData = new FormData(formNewProduct);
  const productData = {};
  formData.forEach((value, key) => {
    productData[key] = value;
  });

  //enviamos los datos del producto al servidor
  socket.emit("newProduct", productData);
  
  // Borramos los inputs
  formNewProduct.querySelectorAll('input').forEach(input => {
    input.value = ''
  })
});


const formProductsList = document.getElementById("productsList");

socket.on("actualizar1", (products) => {
  
  const productsList = document.getElementById("productsList");
  productsList.innerHTML = ``
  products.forEach((message) => {
    productsList.innerHTML += 
    `<div id="cards"><p>Producto: ${message.title}</p><p>Precio: ${message.price}</p><p>Stock: ${message.stock}</p><button class="productDelete" id=${message.id}>Borrar</button></div>`
  })
  registerButton()

})

function registerButton() {
  addButton = document.querySelectorAll(".productDelete")
  addButton.forEach(button => {

    button.onclick = (e) => {
      const productId = e.currentTarget.id
      console.log("borrando")
      socket.emit('deleteProduct', productId);

    }
  })
}

registerButton()

