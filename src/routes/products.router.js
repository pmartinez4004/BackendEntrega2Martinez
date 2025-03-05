import express from "express";
import productModel from "../models/product.model.js";

const productsMRouter = express.Router();

/*productsMRouter.get("/", async(req, res)=> {
  try {
    const products = await productModel.find();
    res.status(200).send({ status: "success", payload: products });
  } catch (error) {
    res.status(500).send({ status: "error", message: `Error al recuperar los productos: ${error.message}` });
  }
});*/


productsMRouter.post("/", async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;
    if (!title || !description || !code || !price || !status || !stock || !category) return res.status(400).send({ status: "error", message: "Datos del usuario incompleto" });

    const response = await productModel.insertOne({ title, description, code, price, status, stock, category, thumbnail });
    res.status(201).send({ status: "success", payload: response });
  } catch (error) {
    res.status(500).send({ status: "error", message: `Error al agregar el producto: ${error.message}` });
  }
});

productsMRouter.put("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const productUpdates = req.body;

    const response = await productModel.updateOne({ _id: uid }, productUpdates);
    res.status(200).send({ status: "success", payload: response });
  } catch (error) {
    res.status(500).send({ status: "error", message: `Error al modificar el producto: ${error.message}` });
  }
})

productsMRouter.delete("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    const response = await productModel.deleteOne({ _id: uid });
    res.status(200).send({ status: "success", payload: response });
  } catch (error) {
    res.status(500).send({ status: "error", message: `Error al eliminar el producto: ${error.message}` });
  }
})

//Ejemplo consulta: ?sort=des&category=Raquetas
productsMRouter.get("/", async (req, res) => {        
  try {

    let { limit, page, sort, category } = req.query;
    
    !limit && (limit = 10);
    
    !page && (page = 1);
    
    sort === 'asc' && (sort = 1);
    sort === 'des' && (sort = -1);

    const filter = category ? { category: category } : {};
    const queryOptions = { limit: limit, page: page, lean: true };

    if (sort === 1 || sort === -1) {
      queryOptions.sort = { price: sort };
    }

   
    const getProducts = await productModel.paginate(filter, queryOptions);
    getProducts.isValid = !(page <= 0 || page > getProducts.totalPages); 
    getProducts.prevLink =
      getProducts.hasPrevPage &&
      `?page=${getProducts.prevPage}&limit=${limit}`;
    getProducts.nextLink =
      getProducts.hasNextPage &&
      `?page=${getProducts.nextPage}&limit=${limit}`;

    getProducts.status = getProducts ? 'success' : 'error';

    res.status(200).send({ status: "success", payload: getProducts });
  } catch (error) {
    res.status(500).send({ status: "error", message: `Error al recuperar los productos: ${error.message}` });
  }
})

export default productsMRouter;


// rutas de preentrega 2
/*import express from "express";
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


export default productsRouter;*/