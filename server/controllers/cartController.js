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

export {updateCart, getCart}