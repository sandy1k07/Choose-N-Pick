import Product from "../models/Product.js";
import User from "../models/User.js";

// Get cart data upon login

const getCart = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        
        const cart = user.cart
        return res.json({
            success: true,
            cart,
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            msg: error.message,
        })
    }
}


// Update user CART data  /api/cart/update

const updateCart = async (req, res) => {
    try {
        const {cart} = req.body;
        const userId = req.userId;
        await User.findByIdAndUpdate(userId, {
            cart: cart,
        })
        return res.json({
            success: true, 
            msg: "Cart updated successfully"
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            msg: error.message,
        })
    }
} 

const checkCart = async (req, res) => {
    const {cart} = req.body;
    
    const userId = req.userId;

    try {
        const cartItemIds = Object.keys(cart);
        const products = await Product.find({ '_id': { $in: cartItemIds } });

        let updatedCart = {};
        let isUpdated = false;

        const productMap = new Map();
        products.forEach(item => {
            productMap.set(item._id.toString(), item);
        })
        
        for (let productId in cart) {
            const product = productMap.get(productId);
            if (product.inStock) {
                updatedCart[productId] = cart[productId];
            }else{
                isUpdated = true;
            }
        }
        
        if(!isUpdated){
            return res.json({
                success: true,
                updated: false,
            })
        }
        const user = await User.findByIdAndUpdate(userId, {cart: updatedCart});
        
        return res.json({
            success: true,
            updated: true,
            cart: updatedCart
        })

    } catch (error) {
        console.log(error.message);
        
        return res.json({
            success: false,
            msg: error.message,
        })
    }
}

export {updateCart, getCart, checkCart}