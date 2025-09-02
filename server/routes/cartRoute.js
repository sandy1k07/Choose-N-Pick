import express from "express";
import { restrictLogin } from "../middlewares/authUser.js";
import { checkCart, getCart, updateCart } from "../controllers/cartController.js";

const cartRouter = express.Router()

cartRouter.get('/', restrictLogin, getCart)
cartRouter.post('/update', restrictLogin, updateCart)
cartRouter.post('/cartCheck', restrictLogin, checkCart)

export default cartRouter