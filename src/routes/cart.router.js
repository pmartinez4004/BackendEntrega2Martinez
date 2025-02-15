import express from "express";
import CartManager from "../CartManager1.js";

//instanciamos el router de express para manejar las rutas
const cartRouter = express.Router();
//instanciamos el manejador de nuestro archivo de carrito
const cartManager = new CartManager("./src/data/cart.json");


//POST "/"
cartRouter.post("/", async (req, res) => {
  try {
    const data = await cartManager.addCart()
    res.status(201).send(data);
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})


//GET "/:cid"
cartRouter.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data1 = await cartManager.getCartById(id);
    res.status(200).send(data1);
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

//POST "/:cid/product/:pid"
cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const pId = Number(req.params.pid);
    const cid = Number(req.params.cid);
    const data = await cartManager.addProductInCartById(cid, pId)
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})


export default cartRouter;