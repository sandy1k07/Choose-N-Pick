import express from "express";
import { upload } from "../configs/multer.js";
import { restrictSeller } from "../middlewares/authSeller.js";
import { addProduct, productById, productList, productSeller, updateStockById } from "../controllers/ProductController.js";


const productRouter = express.Router();

productRouter.post('/add', upload.array(["images"]), restrictSeller, addProduct);
productRouter.get('/list', productList);
productRouter.get('/id', productById);
productRouter.post('/stock', restrictSeller, updateStockById);
productRouter.get('/seller', restrictSeller, productSeller);

export default productRouter;