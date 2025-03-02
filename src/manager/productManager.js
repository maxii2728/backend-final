import productsModel from "../models/products.model.js";

class ProductManager {

    async addProduct({ title, description, code, price, status, stock, category }) {
        try {
            const newProduct = new productsModel({ title, description, code, price, status, stock, category });
            await newProduct.save();
            return { status: "success", payload: newProduct.toObject() };
        } catch (error) {
            throw new Error("Error al agregar el producto");
        }
    }


    async readProducts({ paramLimit = 10, paramPage = 1 }) {

        paramLimit = parseInt(paramLimit) || 10;
        paramPage = parseInt(paramPage) || 1;


        const options = {
            page: paramPage,
            limit: paramLimit,
        };


        const infoPaginate = await productsModel.paginate({}, options);


        const response = {
            status: "success",
            payload: infoPaginate.docs.map(doc => doc.toObject()),
            totalPages: infoPaginate.totalPages,
            prevPage: infoPaginate.prevPage,
            nextPage: infoPaginate.nextPage,
            page: infoPaginate.page,
            hasPrevPage: infoPaginate.hasPrevPage,
            hasNextPage: infoPaginate.hasNextPage,
            prevLink: infoPaginate.hasPrevPage ? `/products?page=${infoPaginate.prevPage}&limit=${paramLimit}` : null,
            nextLink: infoPaginate.hasNextPage ? `/products?page=${infoPaginate.nextPage}&limit=${paramLimit}` : null
        };

        return response;
    }



    async readProductsByCategory({ category }) {



        if (!category) {
            throw new Error("La categoría es requerida");
        }



        const infoPaginate = await productsModel.paginate({ category }, {});


        if (infoPaginate.totalDocs === 0) {
            throw new Error("No existen productos para la categoría especificada");
        }


        const response = {
            status: "success",
            payload: infoPaginate.docs.map(doc => doc.toObject())

        };

        return response;
    }
    async readProductsByAscSort({ paramLimit = 10, paramPage = 1 }) {

        paramLimit = parseInt(paramLimit) || 10;
        paramPage = parseInt(paramPage) || 1;


        const options = {
            page: paramPage,
            limit: paramLimit,
            sort: { price: 1 }
        };


        const infoPaginate = await productsModel.paginate({}, options);


        const response = {
            status: "success",
            payload: infoPaginate.docs.map(doc => doc.toObject()),
            totalPages: infoPaginate.totalPages,
            prevPage: infoPaginate.prevPage,
            nextPage: infoPaginate.nextPage,
            page: infoPaginate.page,
            hasPrevPage: infoPaginate.hasPrevPage,
            hasNextPage: infoPaginate.hasNextPage,
            prevLink: infoPaginate.hasPrevPage ? `/api/product/priceASC?page=${infoPaginate.prevPage}&limit=${paramLimit}` : null,
            nextLink: infoPaginate.hasNextPage ? `/api/product/priceASC?page=${infoPaginate.nextPage}&limit=${paramLimit}` : null
        };

        return response;
    }





    async readProduct(id) {
        try {
            let idproduct = id
            const product = await productsModel.findById(idproduct)
            const conversion = product.toObject()
            return conversion;

        } catch (error) {
            throw new Error("buscar producto por id");
        }
    }


    async putProduct(id, { title, description, code, price, status, stock, category }) {
        try {
            let params = { title, description, code, price, status, stock, category };
            const product = await productsModel.findByIdAndUpdate(id, params, { new: true });
            if (!product) {
                return { status: "error", error: "No se pudo actualizar el producto" };
            }
            return { status: "success", message: "Se actualizó el producto correctamente" };
        } catch (error) {
            console.error(error);
            throw new Error("Producto no actualizado");
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await productsModel.findByIdAndDelete(id);

            if (!deletedProduct) {
                return { status: "error", error: "No se pudo borrar el producto" };
            }
            return { status: "success", message: "Producto eliminado correctamente" };
        } catch (error) {
            console.error(error);
            return { status: "error", error: "Error al eliminar el producto" };
        }
    }
}

export default ProductManager;