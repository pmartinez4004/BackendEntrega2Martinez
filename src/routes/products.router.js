import express from "express";
import ProductManager from "../ProductManager.js";

//instanciamos el router de express para manejar las rutas
const productsRouter = express.Router();
//instanciamos el manejador de nuestro archivo de productos
const productManager = new ProductManager("./src/data/products.json");

//GET "/"
productsRouter.get("/", async(req, res)=> {
  try {
    const data = await productManager.getProducts();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

//GET "/:pid"
productsRouter.get("/:id", async(req, res)=> {
  try {
    const id = Number(req.params.id)
    const data1 = await productManager.getProductById(id);
    res.status(200).send(data1);
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})


//POST "/"
productsRouter.post("/", async(req, res)=> {
  try {
    const body = req.body;
    const data = await productManager.addProduct(body)
    res.status(201).send(data);
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})


//PUT "/:pid"
productsRouter.put("/:id", async(req, res)=> {
  try {
    const body = req.body;
    const id = Number(req.params.id)
    const data = await productManager.setProductById(id, body);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

//DELETE "/:pid"
productsRouter.delete("/:id", async(req, res)=> {
  try {
    const id = Number(req.params.id)
    console.log("idDelete= "+id)
    const data = await productManager.deleteProductById (id);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})



export default productsRouter;