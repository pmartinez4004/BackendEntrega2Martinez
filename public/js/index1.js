document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.productAddToCart');
  
    buttons.forEach(button => {
      button.addEventListener('click', async (event) => {
        const productId = event.target.id; 
        const cartId = "67c521c2beba75cc3cc568f6"; // No borrar este carrito!!!. Se usa por default
  
        try {
          
          const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            console.log("Producto agregado al carrito:", data);
            alert("Producto agregado con éxito!");
          } else {
            console.error("Error al agregar el producto al carrito:", response.statusText);
            alert("No se pudo agregar el producto. Inténtalo de nuevo.");
          }
        } catch (error) {
          console.error("Error en la solicitud:", error);
          alert("Ocurrió un error al intentar agregar el producto.");
        }
      });
    });
  });



const buttons1 = document.querySelectorAll('.productDetail');

buttons1.forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.id; 
        window.location.href = `/products/${productId}`; 
    });
});


  const preCartButton = document.getElementById('goToPreCart1');
  preCartButton.addEventListener('click', () => {
    window.location.href = '/preCart/'; 
});
