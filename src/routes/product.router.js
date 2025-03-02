import { Router } from "express";
import ProductManager from "../manager/productManager.js";


const productRouter = Router();
const manager = new ProductManager();

productRouter.post("/", async (req, res) => {
    try {
        const values = req.body;
        const newProduct = await manager.addProduct(values);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ status: "error", message: "error al crear agregar el producto" });
    }
});
productRouter.get("/", async (req, res) => {
    try {

        const paramPage = req.query.page || 1;
        const paramLimit = req.query.limit || 10;

        const productsResponse = await manager.readProducts({ paramLimit, paramPage });

        res.render("index", { products: productsResponse });

    } catch (error) {
        res.status(500).json({ status: "error", message: "error al leer todos los productos" });
    }
});
productRouter.post('/category', async (req, res) => {
    try {
        const cuerpo = req.body


        const category = cuerpo.category;


        if (!category) {
            return res.status(400).json({ status: "error", message: "La categoría es requerida" });
        }


        const productsResponse = await manager.readProductsByCategory({ category });


        res.render("productsCategory", { products: productsResponse });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: "Error al filtrar por categoría" });
    }
});


productRouter.get('/priceASC', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const productsResponse = await manager.readProductsByAscSort({ paramLimit: limit, paramPage: page }); res.render("productsAscSort", { products: productsResponse });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: "Error al filtrar por precio" });
    }
});
productRouter.get("/:id", async (req, res) => {
    try {
        const paramId = req.params.id
        let product = await manager.readProduct(paramId)
        res.render("individualProduct", { product })
    } catch (error) {
        res.status(500).json({ status: "error", message: "error al leer un unico producto" });

    }
});

productRouter.get("/put/:id", async (req, res) => {
    const paramId = req.params.id
    let product = await manager.readProduct(paramId)
    res.render("putProduct", { product })
})


productRouter.put("/put/:id", async (req, res) => {
    try {
        const paramId = req.params.id
        const newData = req.body
        let product = await manager.putProduct(paramId, newData)
        res.status(201).json({ status: "success", message: "se logro actualizar el producto" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "error al actualizar" });

    }
});

productRouter.delete("/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const result = await manager.deleteProduct(productId);

        if (result.status === "error") {
            return res.status(404).json(result);
        }

        res.json({ status: "success", result: result })
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: "No se pudo eliminar el producto" });
    }
});



export default productRouter