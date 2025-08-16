import express from "express";
import { restrictLogin } from "../middlewares/authUser.js";
import { addAddress, fetchAddress } from "../controllers/addressController.js";

const addressRouter = express.Router();

addressRouter.post('/add', restrictLogin, addAddress);
addressRouter.get('/fetch', restrictLogin, fetchAddress);

export default addressRouter;