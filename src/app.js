//importo express
import express from "express";
//importo dotenv
import dotenv from "dotenv";
//importo handlebars
import handlebars from "express-handlebars";
//importo  monggose
import mongoose from "mongoose";
//importo method-override
import methodOverride from "method-override";
//importo dirname
import __dirname from "./utils.js";
//importo rutas
import view from "./routes/views.router.js";
import products from "./routes/product.router.js";
import cart from "./routes/cart.router.js"

//inicializo express
const app = express();

//dotenv
dotenv.config();
const PORT = process.env.PORT
const URI_MONGO = process.env.URI_MONGO

//configuro handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//middleware laburo con json y urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middleware laburo con method-override
app.use(methodOverride("_method")); 

//configuro la carpeta de archivos estaticos
app.use(express.static(__dirname + "/public"));



//CONCECCION A LA BASE DE DATOS
mongoose.connect(URI_MONGO)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Coneccion a la base de datos exitosa, Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("Error al conectar a la base de datos", error);
    });

//RUTAS
app.use("/", view);
app.use("/api/product", products);
app.use("/api/cart", cart);
