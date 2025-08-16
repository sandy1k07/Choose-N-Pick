import express from "express";
import { checkSellerAuth, sellerLogin, sellerLogout } from "../controllers/sellerController.js";
import { restrictSeller } from "../middlewares/authSeller.js";

const sellerRouter = express.Router();

sellerRouter.post('/login', sellerLogin);
sellerRouter.get('/logout', restrictSeller, sellerLogout);
sellerRouter.get('/checkAuth', restrictSeller, checkSellerAuth);

export default sellerRouter;