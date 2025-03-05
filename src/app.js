import express from "express";
import productsRouter from "./routes/products.router.js";
//import productsMRouter from "./routes/productsM.router.js"
import cartRouter from "./routes/cart.router.js";
//import cartMRouter from "./routes/cart.router.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./ProductManager.js";
import mongoose from "mongoose";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//puerto de nuestro servidor
const PORT = 8080;

//habilitamos poder recibir json
app.use(express.json());

//habilitamos la carpeta public
app.use(express.static("public"));

const connectMongoDB = async() => {
  try {
    await mongoose.connect("mongodb+srv://coder121:movimiento@ecommerce-cluster.bj9eg.mongodb.net/ecommerceDB?retryWrites=true&w=majority&appName=ecommerce-cluster");
    console.log("Conectado con MongoDB!");
  } catch (error) {
    console.error("Error al conectar con MongoDB: ", error.message);
    process.exit(1); // Detiene la aplicacion si hay un error en la conexion
  }
}

connectMongoDB();

//endpoints
app.use("/api/products", productsRouter);
//app.use("/api/productsM", productsMRouter);
//app.use("/api/carts", cartRouter);
app.use("/api/carts", cartRouter);
//app.use("/api/cartsM", cartMRouter);
app.use("/", viewsRouter);


//websockets
const productManager = new ProductManager("./src/data/products.json");

io.on("connection", (socket) => {
  //console.log("Nuevo usuario conectado");
  socket.on("newProduct", async (productData) => {
    try {
      const newProduct = await productManager.addProduct(productData);
    } catch (error) {
      console.log("Error añadiendo el nuevo producto");
    }
    try {
      const products = await productManager.getProducts();
      io.emit("actualizar1", products);
    } catch (error) {
      console.log("Error leyendo productos");
    }
  });


  socket.on('deleteProduct', async (product) => {
    const productToDelete = Number(product);
    productManager.deleteProductById(productToDelete);
    try {
      const products = await productManager.getProducts();
      io.emit("actualizar1", products);
    } catch (error) {
      console.log("Error leyendo productos");
    }
  })

})

//iniciamos el servidor y escuchamos en el puerto definido
server.listen(PORT, () => console.log(`Servidor iniciado en: http://localhost:${PORT}`));

