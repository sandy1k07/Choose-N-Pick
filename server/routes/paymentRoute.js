import express from "express";
import { checkout, getKey, paymentVerification } from "../controllers/paymentController.js";
import { restrictLogin } from "../middlewares/authUser.js";
import { publishOrder } from "../middlewares/orderPublish.js";

const paymentRouter = express.Router();

paymentRouter.post('/checkout', restrictLogin, publishOrder, checkout);
paymentRouter.post('/verification', restrictLogin, paymentVerification);
paymentRouter.get('/key', restrictLogin, getKey);

export default paymentRouter;