import express from 'express'
import { restrictLogin } from '../middlewares/authUser.js';
import { getAllOrders, getUserOrders, placeOrderCod, placeOrderOnline } from '../controllers/orderController.js';
import { restrictSeller } from '../middlewares/authSeller.js';

const orderRouter = express.Router();

orderRouter.post("/cod", restrictLogin, placeOrderCod);
orderRouter.get("/user", restrictLogin, getUserOrders);
orderRouter.get("/seller", restrictSeller, getAllOrders);
orderRouter.post("/online", restrictLogin, placeOrderOnline);

export default orderRouter;