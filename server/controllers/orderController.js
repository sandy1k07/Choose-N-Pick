import Coupon from "../models/Coupon.js";
import Order from "../models/Orders.js";
import Product from "../models/Product.js";
import User from "../models/User.js";


// Place Order (COD) /api/order/cod
const placeOrderCod = async (req, res) => {
    try {
        const {items, address, amount, coupon} = req.body;
        const userId = req.userId;
        if(!address || items.length === 0){
            return res.json({
                success: false,
                msg: "Invalid data"
            })
        }

        await Order.create({
            userId: userId,
            items: items,
            amount: amount,
            address: address,
            paymentType: "COD"
        })

        for(let item of items){
            await Product.findByIdAndUpdate(item.product, {$inc: {stockCount: -item.quantity}});
        }

        if(coupon){
            const appliedCoupon = await Coupon.findOne({couponId: coupon});
            await User.findByIdAndUpdate(userId, {
                $push: {couponsApplied: appliedCoupon._id}
            })
        }

        return res.json({
            success: true,
            msg: "Order placed successfully"
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            msg: error.message,
        })
    }
}

// Place Order (COD) /api/order/online
const placeOrderOnline = async (req, res) => {
    try {
        const {items, address, amount} = req.body;
        const userId = req.userId;
        if(!address || items.length === 0){
            return res.json({
                success: false,
                msg: "Invalid data"
            })
        }

        
        const order = {
            userId: userId,
            items: items,
            amount: amount,
            address: address,
            paymentType: "Online"
        }


        return res.json({
            success: true,
            msg: "Order generated, confirmation on payment",
            order,
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            msg: error.message,
        })
    }
}


// GET orders by userId: /api/order/user
const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await Order.find({
            userId: userId,
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product").sort({createdAt: -1})

        return res.json({
            success: true,
            orders,
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            msg: error.message,
        })
    }
}


// GET all orders for seller  /api/order/seller
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1})

        return res.json({
            success: true,
            orders,
        })
    } catch (error) {
        // console.log("idhar dikkat hai");
        return res.json({
            success: false,
            msg: error.message,
        })
    }
}

export {placeOrderCod, getUserOrders, getAllOrders, placeOrderOnline};
