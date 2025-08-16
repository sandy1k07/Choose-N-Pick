import {v2 as cloudinary} from 'cloudinary'
import Product from '../models/Product.js';


// Add product /api/product/add

const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);
        const images = req.files;

        let imagesURL = await Promise.all(
            images.map(async (prodImg) => {
                let result = await cloudinary.uploader.upload(
                    prodImg.path,
                    {resource_type: 'image'}
                );
                return result.secure_url;
            })
        )

        await Product.create({
            ...productData,
            images: imagesURL
        })

        return res.json({
            success: true,
            msg: "Product added successfully"
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            msg: error.message,
        })
    }
}

// Get products /api/products/list

const productList = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({
            success: true,
            products
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            msg: error.message,
        })
    }
}

// Get product by id /api/products/:id

const productById = async (req, res) => {
    try {
        const {prodId} = req.body;
        const product = await Product.findById(prodId);
        res.json({
            success: true,
            product
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            msg: error.message,
        })
    }
}


// change product in stock /api/products/stock

const updateStockById = async (req, res) => {
    try {
        const {prodId, inStock} = req.body;
        await Product.findByIdAndUpdate(prodId, {inStock: inStock}) 
        res.json({
            success: true,
            msg: "Product stock updated"
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            msg: error.message,
        })
    }
}
export {addProduct, productList, productById, updateStockById};