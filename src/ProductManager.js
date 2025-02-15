import fs from "fs";

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
    this.loadProducts();
    this.errores=[];
  }
  
  async loadProducts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      if (data.length > 0) {
        this.products = JSON.parse(data);
      }
      else {
        this.products = [];
      }
    } catch (err) {
      console.error(`Error lectura de archivo ${err}`);
      this.products = [];
      throw new Error(`Error al leer archivo de productos ${err.message}`);
    };
  };

  async saveProducts() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      await fs.promises.writeFile(this.path, data);

    } catch (err) {
      console.error(`Error escritura de archivo ${err}`);
      throw new Error(`Error al grabar archivo de productos ${err.message}`);
    };
  };

  //Verifica que no falten parametros
  allFieldsAvailable(title, description, code, price, status, stock, category, thumbnail) {

    const newProduct = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail
    }
    
    if (!Object.values(newProduct).includes(undefined)) {
      return true;
    }
    else {
      console.log("Faltaron completar campos");
      this.errores.push("Se encontraron campos faltantes")
      throw new Error(`Se encontraron campos faltantes`);
      return false;
    }
  }

  //verifica codigos duplicados

  foundDuplicateCode(code) {
    try {
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].code === code) {
          console.log("Se encontraron codigos duplicados");
          alert("codigos duplicados")
          
          this.errores.push("Se encontraron codigos duplicados")
          throw new Error(`Error:numero de producto duplicado`);
          return true;
        }
      }
      return false;
    }
    catch (error) {
      res.status(500).send({ message: error.message })
    }
  }

  //addProduct
  addProduct = async (datos) => {

    const id = this.products.length + 1;
    try {
       
      if (typeof datos.price === 'string') {      //Verifica si viene de post(price es string) o de socket
        datos.price = parseFloat(datos.price);
        datos.stock = parseInt(datos.stock, 10);
        var datos2 = { id: id, ...datos, status: true, thumbnail: "" }
      }
      else {
        var datos2 = { id: id, ...datos }
      }
      const datos1 = datos2

      if (this.allFieldsAvailable(datos1.title, datos1.description, datos1.code, datos1.price, datos1.status, datos1.stock, datos1.category, datos1.thumbnail) && !this.foundDuplicateCode(datos1.code)) {

        this.products.push(datos1)
        this.saveProducts();
        return datos1;
        console.log("Creacion de producto OK.");
      }
      else {
        console.log("No se grabó por errores");
        this.errores.push("No se grabó por errores")
      }
    } catch (error) {
      const errorMessage=this.errores.join('; ')
      this.errores=[]
      console.log(errorMessage)
      throw new Error(errorMessage);
    }
  }


//getProducts
getProducts = async () => {
  try {
    this.loadProducts();
    return this.products;
  } catch (error) {
    throw new Error(`Error al leer el archivo de productos: ${error.message}`);
  }
}

//getProductById
getProductById = async (id) => {
  try {
    if (!this.products.find(producto => producto.id === id)) {
      console.log("Not found");
    }
    else {
      this.loadProducts();
    }
    return this.products.find(producto => producto.id === id);
  } catch (error) {
    throw new Error(`Error al mostrar productos por id: ${error.message}`);
  }
}


//deleteProductById
deleteProductById = async (id) => {
  try {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
    } else {
      console.error(`No se encontró el producto para borrar con id ${id}`);
      throw new Error(`Error al borrar producto: ${id}`);
    };
  } catch (error) {
    throw new Error(`Error al borrar producto: ${error.message}`);
  }
}

//setProductById
setProductById = async (id, updatedProduct) => {
  try {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      this.saveProducts();
      console.log(`Producto editado OK`);
    } else {
      console.error(`No se encontró para editar el producto con id ${id}`);
    };
  } catch (error) {
    throw new Error(`Error al editar el archivo de productos: ${error.message}`);
  }
}

}

export default ProductManager;