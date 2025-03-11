import cartModel from '../models/cart.model.js'; 
import productsModel from '../models/products.model.js'; 

class cartManager {
    async addCart({ code, quantity }) {
        try {
            
            const product = await productsModel.findOne({ code });
            if (!product) {
                throw new Error("Producto no encontrado");
            }

            
            quantity = parseInt(quantity);
            if (isNaN(quantity) || quantity < 1) {
                throw new Error("La cantidad debe ser un número válido mayor a 0");
            }

            
            let cart = await cartModel.findOne();
            if (!cart) {
                console.log("No se encontró un carrito existente, creando uno nuevo.");
                cart = new cartModel({ products: [] });
            }

            
            
            const productId = product._id.toString();
            
            
            let totalCurrentQuantity = 0;
            const productEntries = cart.products.filter(item => 
                item.product.toString() === productId || 
                (item.product._id && item.product._id.toString() === productId)
            );
            
            productEntries.forEach(entry => {
                totalCurrentQuantity += entry.quantity;
            });
            
            console.log(`Cantidad total actual del producto ${product.title} en el carrito: ${totalCurrentQuantity}`);
            
            
            const newTotalQuantity = totalCurrentQuantity + quantity;
            if (newTotalQuantity > product.stock) {
                throw new Error(`No se puede agregar ${quantity} unidades más. Ya tienes ${totalCurrentQuantity} en el carrito y solo hay ${product.stock} disponibles en stock.`);
            }
            
           
            
            if (productEntries.length > 0) {
                
                const firstEntryIndex = cart.products.findIndex(item => 
                    item.product.toString() === productId || 
                    (item.product._id && item.product._id.toString() === productId)
                );
                
                
                cart.products[firstEntryIndex].quantity = newTotalQuantity;
                
                
                if (productEntries.length > 1) {
                    cart.products = cart.products.filter((item, index) => {
                        const itemProductId = item.product.toString() || 
                                            (item.product._id && item.product._id.toString());
                        
                        
                        return itemProductId !== productId || index === firstEntryIndex;
                    });
                }
                
                console.log(`Producto actualizado en el carrito. Nueva cantidad: ${newTotalQuantity}`);
            } else {
                
                cart.products.push({ product: product._id, quantity });
                console.log(`Producto agregado al carrito. Cantidad: ${quantity}`);
            }

            await cart.save();
            console.log("Carrito guardado exitosamente:", cart);
            return cart.toObject(); 
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
            throw error; 
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

            
            const updatedProducts = [];
            for (let i = 0; i < productIds.length; i++) {
                const productId = productIds[i];
                const quantity = parseInt(quantities[i]);
                
                if (isNaN(quantity) || quantity < 1) {
                    throw new Error(`La cantidad para el producto ${i+1} debe ser un número válido mayor a 0`);
                }
                
                
                const product = await productsModel.findById(productId);
                if (!product) {
                    throw new Error(`Producto con ID ${productId} no encontrado en la base de datos`);
                }
                
                
                if (quantity > product.stock) {
                    throw new Error(`No se puede actualizar el producto "${product.title}" a ${quantity} unidades. Solo hay ${product.stock} disponibles en stock.`);
                }
                
                updatedProducts.push({
                    product: productId,
                    quantity: quantity
                });
            }
            
            
            cart.products = updatedProducts;
            
            await cart.save();
            return cart.toObject(); 
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            throw error; 
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

        
        const productIndex = cart.products.findIndex(p => 
            p.product._id.toString() === productId || 
            (typeof p.product === 'string' && p.product === productId)
        );
        
        if (productIndex === -1) {
            throw new Error("Producto no encontrado en el carrito");
        }

        
        const productInDB = await productsModel.findById(productId);
        
        if (!productInDB) {
            throw new Error("Producto no encontrado en la base de datos");
        }
        
        
        let totalCurrentQuantity = 0;
        const productEntries = cart.products.filter((item, index) => {
            const itemProductId = item.product._id ? item.product._id.toString() : item.product.toString();
            return itemProductId === productId && index !== productIndex;
        });
        
        productEntries.forEach(entry => {
            totalCurrentQuantity += entry.quantity;
        });
        
        console.log(`Cantidad total actual del producto ${productInDB.title} en el carrito (excluyendo el que se actualiza): ${totalCurrentQuantity}`);
        
        
        const newTotalQuantity = totalCurrentQuantity + newQuantity;
        if (newTotalQuantity > productInDB.stock) {
            throw new Error(`No se puede actualizar a ${newQuantity} unidades. Ya tienes ${totalCurrentQuantity} unidades de este producto en otras entradas del carrito y solo hay ${productInDB.stock} disponibles en stock.`);
        }

        console.log("Producto encontrado en índice:", productIndex);
        console.log("Actualizando cantidad de", cart.products[productIndex].quantity, "a", newQuantity);
        
        // Actualizar la cantidad
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