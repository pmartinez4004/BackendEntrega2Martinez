import express from "express";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

const cartMRouter = express.Router();

cartMRouter.get("/", async (req, res) => {
    try {
        const carts = await cartModel.find();
        res.status(200).send({ status: "success", payload: carts });
    } catch (error) {
        res.status(500).send({ status: "error", message: `Error al recuperar los carritos: ${error.message}` });
    }
});

cartMRouter.post("/", async (req, res) => {
    try {
        let cartData = {};
        const newCart = await cartModel.create(cartData);
        console.log('Carrito creado con éxito:', newCart);
        res.status(201).send({ status: "success", payload: newCart });
    } catch (error) {
        res.status(500).send({ status: "error", message: `Error al crear el carrito: ${error.message}` });
    }
});


cartMRouter.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        
        const carts = await cartModel.find({ _id: cid })//.lean()//;
        res.status(200).send({ status: "success", payload: carts });
    } catch (error) {
        res.status(500).send({ status: "error", message: `Error al recuperar los carrito: ${error.message}` });
    }
});


//POST "/:cid/product/:pid"  Agrega productos al carrito
cartMRouter.post("/:cid/product/:pid", async (req, res) => {
    try {

        const { cid } = req.params;
        const { pid } = req.params;
        const cart = await cartModel.findOne({ _id: cid });
        const productToAdd = await productModel.findOne({ _id: pid });    
        const productIndex = cart.products.findIndex(item => item.productID.toString() == productToAdd._id.toString());
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1; 
        } else {
            cart.products.push({ productID: pid }) 
        }
        await cartModel.updateOne({ _id: cid }, cart);
        res.status(200).send({ status: "success", payload: cart });

    } catch (error) {
        console.log('Error al agregar el producto al carrito:', error.message);
        throw error;
    }
})



cartMRouter.delete("/:cid/products/:pid", async (req, res) => {
    try {

        const { cid } = req.params;
        const { pid } = req.params;
        const cart = await cartModel.findOne({ _id: cid });
        const product = await productModel.findOne({ _id: pid })
        const filter = cart.products.filter((item) => item.productID.toString() !== product._id.toString());
        await cartModel.updateOne({ _id: cid }, { products: filter });
        res.status(200).send({ status: "success", payload: cart });

    } catch (error) {
        console.log('Error al borrar producto de carrito:', error.message);
        throw error;
    }
})

cartMRouter.delete("/:cid", async (req, res) => {
    try {

        const { cid } = req.params;
        const filter = { _id: cid };    
        const update = { $set: { products: [] } };
        const updateCart = await cartModel.findOneAndUpdate(filter, update, { new: true });
        res.status(200).send({ status: "success", payload: updateCart });

    } catch (error) {
        console.log('Error al borrar producto de carrito:', error.message);
        throw error;
    }
})

cartMRouter.put("/:cid/products/:pid", async (req, res) => {
  try {

      const { cid } = req.params;
      const { pid } = req.params;
      const quantity1 = req.body;   /// Pasar por el body con formato "quantity":2 por ejemplo
      const quantity2 = Number(JSON.stringify(quantity1.quantity))
      console.log("quantity=" + quantity2)
      if (typeof quantity2 !== 'number' || quantity2 <= 0) {
          console.log('La cantidad debe ser un número mayor que cero.');
      }     
      const filter = { _id: cid, 'products.productID': pid };
      const update = { $set: { 'products.$.quantity': quantity2 } };
      const updatedCart = await cartModel.findOneAndUpdate(filter, update, { new: true }); 
      res.status(200).send({ status: "success", payload: updatedCart });
      if (!updatedCart) {
          console.log(`Producto ${pid} no encontrado en el carrito ${cid}.`);
      }

  } catch (error) {
      console.log('Error al agregar un producto al carrito:', error.message);
      throw error;
  }
})


cartMRouter.put("/:cid", async (req, res) => {
  try {
      const { cid } = req.params;
      const { body: arrayOfproducts } = req;   // Ver formato del array mas abajo
      const arr = [];
      for (const item of arrayOfproducts) {
          const object = await productModel.findById(item.productID);
          arr.push({
              productID: object._id,
              quantity: item.quantity
          });
      }
      
      const filter = { _id: cid };
      const update = { $set: { products: arr } };
      const updateCart = await cartModel.findOneAndUpdate(filter, update, {
          new: true,
      });
      res.status(200).send({ status: "success", payload: updateCart });

  } catch (error) {
      console.log('Error al agregar matriz al carrito:', error.message);
      throw error;
  }
})

/* Formato del array a pasar por body
[
  {
  "productID":"67c5237dddd81062ff05f601",
  "quantity":10
  },
  {
  "productID":"67c533f225ca33ca9e58ed93",
  "quantity":22
  }
  ]
*/

export default cartMRouter;

//Rutas preentrega 2 

/*import express from "express";
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


export default cartRouter;*/