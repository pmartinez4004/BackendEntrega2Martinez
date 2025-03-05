import express from "express";
import ProductManager from "../ProductManager.js";
import productModel from "../models/product.model.js";
import cartModel from "../models/cart.model.js";


const viewsRouter = express.Router();
const productManager = new ProductManager("./src/data/products.json");

viewsRouter.get("/", async(req, res)=> {
  try {
    const page=parseInt(req.query.page) || 1
    const limit = 4
    const products = await productModel.paginate({},{page, limit, lean:true})
    res.render("home",  products ); 
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


viewsRouter.get("/realtimeproducts", async(req, res)=> {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

viewsRouter.get("/products/:pid", async(req, res)=> {
  try {
    const { pid } = req.params;
        
    const product= await productModel.find({ _id: pid }).lean()//;
    
    res.render("detail", { product});
  } catch (error) {
    res.status(500).send({ status: "error", message: `Error al recuperar los productos: ${error.message}` });
  }
});

viewsRouter.get("/carts/:cid", async(req, res)=> {
  try {
    
    const { cid } = req.params;   
    const cart = await cartModel.find({ _id: cid }).lean()
    res.render("cart", { cart });
  } catch (error) {
    res.status(500).send({ status: "error", message: `Error al recuperar carritos: ${error.message}` });
  }
});


viewsRouter.get('/preCart/', async (req, res) => {
  try {
    const productId = req.params.pid
      const carts = await cartModel.find().lean(); 
      res.render('PreCart', { carts }); 
  } catch (error) {
      console.error('Error al obtener los carritos:', error);
      res.status(500).send('Error al obtener los carritos');
  }
});

export default viewsRouter;