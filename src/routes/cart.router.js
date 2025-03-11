import { Router } from 'express';
import cartManager from '../manager/cartManager.js'; 


const cartRouter = Router();
const manager = new cartManager();



cartRouter.post("/", async (req, res) => {
    try {
        const params = req.body; 
        const newCart = await manager.addCart(params);
        res.json({ status: "success", message: "Se agregó al carrito", cart: newCart });
    } catch (error) {
        console.error(error); 
        res.status(400).json({ 
            status: "error", 
            message: error.message || "Error al agregar el producto al carrito" 
        });
    }
});

cartRouter.get("/:id", async (req, res) => {
    try {
        const paramId = req.params.id;
        let cart = await manager.readcartByid(paramId);
        res.render('cart', {cart}); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al leer el carrito" });
    }
});

cartRouter.get("/put/:cid", async (req, res) => {
    const paramId = req.params.cid;

    try {
        const cart = await manager.readcartByid(paramId);
        res.render("putCart", { cart }); 
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al leer el carrito" });
    }
});

cartRouter.put("/put/:cid", async (req, res) => {
    const quantities = req.body.quantities; 
    const productIds = req.body.productIds; 
    const cartId = req.params.cid;

    try {
        const updatedCart = await manager.updateCart(cartId, quantities, productIds);
        res.status(200).json({ status: "success", message: "Carrito actualizado", cart: updatedCart });
    } catch (error) {
        console.error(error);
        res.status(400).json({ 
            status: "error", 
            message: error.message || "Error al actualizar el carrito" 
        });
    }
});

















cartRouter.get("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params; 
    try {
        const cart = await manager.readcartByid(cid);
        
        console.log("Carrito:", cart); 
        console.log("Buscando producto con ID:", pid); 
       
        const product = cart.products.find(p => p.product._id.toString() === pid);
        if (!product) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado en el carrito" });
        }
        
        
        res.render('updateQuantity', { cartId: cid, productId: pid, currentQuantity: product.quantity });
    } catch (error) {
        console.error("Error al obtener el carrito o el producto:", error);
        res.status(500).json({ status: "error", message: "Error al obtener los datos del carrito" });
    }
});



cartRouter.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params; 
    const newQuantity = parseInt(req.body.quantity);
    
    try {
        console.log("Actualizando carrito:", cid, "producto:", pid, "cantidad:", newQuantity);
        
        if (isNaN(newQuantity) || newQuantity < 1) {
            return res.status(400).json({ 
                status: "error", 
                message: "La cantidad debe ser un número válido mayor a 0" 
            });
        }
        
        const result = await manager.updateProductQuantity(cid, pid, newQuantity);
        res.status(200).json({ status: "success", message: "Cantidad actualizada exitosamente", cart: result });
    } catch (error) {
        console.error("Error en la ruta PUT:", error);
        res.status(400).json({ 
            status: "error", 
            message: error.message || "Error al actualizar la cantidad del producto" 
        });
    }
});






cartRouter.delete("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const result = await manager.deletedCart(cartId);

        res.json({ status: "success", result: result })
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: "No se pudo eliminar el carrito" });
    }
})


cartRouter.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        await manager.removeProductFromCart(cartId, productId);
        
        res.json({ status: "success", message: "Producto eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al eliminar el producto" });
    }
});





export default cartRouter;



