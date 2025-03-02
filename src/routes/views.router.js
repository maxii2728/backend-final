import { Router } from "express";
import manager from "../manager/productManager.js";

const views = Router()

views.get("/",(req,res)=>{
    res.send("bienvenido al proyecto final del curso de backend I")
})

views.get("/newProduct",(req,res)=>{
    res.render("newProduct")
})

export default views