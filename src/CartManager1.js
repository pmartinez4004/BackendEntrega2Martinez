import fs from "fs";

class CartManager {
  constructor(pathFile) {

    this.pathCart = pathFile;
    this.cart = [];
    this.loadCarts();
  }

 
  // CART
  async loadCarts() {
    try {
      const data = await fs.promises.readFile(this.pathCart, 'utf-8');
      if (data.length>0){
      this.cart = JSON.parse(data);
      }
      else{
        this.cart = [];
      }

    } catch (err) {
      console.error(`Error carga archivo: ${err}`);
      throw new Error(`Error al leer archivo de carrito ${err.message}`);
    };
  };

  async saveCart() {
    try {
      const data = JSON.stringify(this.cart, null, 2);
      await fs.promises.writeFile(this.pathCart, data);
    } catch (err) {
      console.error(`Error escritura archivo: ${err}`);
      throw new Error(`Error al guardar el archivo de carrito ${err.message}`);
    };
  };


  generadorId() {
    let id = 0;
    if (this.cart.length === 0) {
      id = 1;
    } else {
      id = this.cart[this.cart.length - 1].id + 1;
    };
    return id;
  };

  //addCart
  addCart = async () => {
    try {
      const newCart = {
        id: this.generadorId(),
        products: [],
      };

      this.cart.push(newCart);
      this.saveCart();
      console.log(`Creado carrito ${this.generadorId() - 1}`)
    } catch (error) {
      throw new Error(`Error al crear carrito ${error.message}`);
    }
  }

  //getCartById
  getCartById = async (id) => {
    try {
      return this.cart.find((cart) => cart.id === id);;
    } catch (error) {
      throw new Error(`Error al buscar carrito ${error.message}`);
    }
  }


  //addProductInCartById
  addProductInCartById = async (cartId, productId) => {
    try {
      const cartIndex = this.cart.findIndex((cart) => cart.id === cartId);
      if (cartIndex !== -1) {
        const productInCartIndex = this.cart[cartIndex].products.findIndex((product) => product.id === productId);
        if (productInCartIndex !== -1) {
          this.cart[cartIndex].products[productInCartIndex].quantity += 1;
          this.saveCart();
          console.log(`Se agregó producto al carrito`);
        } else {
          this.cart[cartIndex].products.push({ id: productId, quantity: 1 });
          this.saveCart();
          console.log(`Se agregó producto al carrito`);
        };
      } else {
        console.error(`Carrito ${cartId} no encontrado`);
      };
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito con id ${error.message}`);
    }
  }

}

export default CartManager;