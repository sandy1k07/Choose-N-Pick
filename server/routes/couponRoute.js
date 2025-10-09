import express from 'express';
import { restrictSeller } from '../middlewares/authSeller.js';
import { addCoupon, applyCoupon, getCoupons } from '../controllers/couponController.js';
import { restrictLogin } from '../middlewares/authUser.js';

const couponRouter = express.Router()

couponRouter.post("/addCoupon", restrictSeller,addCoupon);
couponRouter.get("/getCoupons", restrictSeller, getCoupons);
couponRouter.post("/applyCoupon", restrictLogin, applyCoupon);

export default couponRouter;