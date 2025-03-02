import cartModel from '../models/cart.model.js'; 
import productsModel from '../models/products.model.js'; 

class cartManager {
    async addCart  ({ code, quantity }) {
        try {
            
            const product = await productsModel.findOne({ code });
            if (!product) {
                throw new Error("Producto no encontrado");
            }

            
            let cart = await cartModel.findOne();
            if (!cart) {
                console.log("No se encontró un carrito existente, creando uno nuevo.");
                cart = new cartModel({ products: [] });
            }

           
            const productIndex = cart.products.findIndex(item => item.product.toString() === product._id.toString());

            if (productIndex > -1) {
              
                console.log(`El producto ya está en el carrito. Incrementando cantidad de ${cart.products[productIndex].quantity} a ${cart.products[productIndex].quantity + quantity}`);
                cart.products[productIndex].quantity += quantity;
            } else {
                
                cart.products.push({ product: product._id, quantity });
            }

            await cart.save();
            console.log("Carrito guardado exitosamente:", cart);
            return cart.toObject(); 
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
            throw new Error("No se pudo agregar al carrito");
        }
    }

    async readcartByid(id) {
        try {
            const cart = await cartModel.findById(id) 
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            return cart.toObject(); 
        } catch (error) {
            console.error("Error al buscar el carrito por ID:", error);
            throw new Error("Error al buscar el carrito por ID");
        }
    }

    
    
    async updateCart(cid, quantities, productIds) {
        try {
           
            const cart = await cartModel.findById(cid);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            
            if (quantities.length !== productIds.length) {
                throw new Error("Las longitudes de cantidades e IDs de productos no coinciden");
            }

            
            cart.products = productIds.map((id, index) => ({
                product: id,
                quantity: quantities[index] 
            }));

            
            await cart.save();
            return cart.toObject(); 
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            throw new Error("No se pudo actualizar el carrito");
        }
    }



async updateProductQuantity(cartId, productId, newQuantity) {
    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        
        console.log("Carrito encontrado:", cart);
        console.log("Buscando producto con ID:", productId);
        
       
        newQuantity = parseInt(newQuantity);
        if (isNaN(newQuantity) || newQuantity < 1) {
            throw new Error("La cantidad debe ser un número válido mayor a 0");
        }

       
        const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);
        if (productIndex === -1) {
            throw new Error("Producto no encontrado en el carrito");
        }

        console.log("Producto encontrado en índice:", productIndex);
        console.log("Actualizando cantidad de", cart.products[productIndex].quantity, "a", newQuantity);

        
        cart.products[productIndex].quantity = newQuantity;
        
        await cart.save();
        
        return cart.toObject();
    } catch (error) {
        console.error("Error detallado:", error);
        throw error;
    }
}



    async deletedCart(cid) {
        try {
            const deletedCart = await cartModel.findByIdAndDelete(cid);
    
            if (!deletedCart) {
                return { status: "error", error: "No se pudo borrar el carrito" };
            }
            return { status: "success", message: "Carrito eliminado correctamente" };
        } catch (error) {
            console.error(error);
            return { status: "error", error: "Error al eliminar el carrito" };
        }
    }



    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
    
            
            cart.products = cart.products.filter(product => product.product._id.toString() !== productId);
            
         
            await cart.save();
            return cart.toObject();
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            throw new Error("Error al eliminar el producto del carrito");
        }
    }


    }

export default cartManager;