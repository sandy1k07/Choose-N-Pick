import Order from "../models/Orders.js";
import User from "../models/User.js";
import { instance } from "../server.js"
import crypto from "crypto";

// checkout /api/payment/checkout
const checkout = async (req, res) => {
    const {amount} = req.body;
    const orderData = req.orderInfo;
    
    
    const options = {
        amount: Math.round(amount * 100),  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
    };
    
    const order = await instance.orders.create(options)
    return res.json({
        success: true,
        msg: "order created",
        order,
        orderData
    })
}

// payment verification /api/payment/verification
const paymentVerification = async (req, res) => {
    const {razorpay_payment_id, razorpay_order_id, razorpay_signature, orderData} = req.body;
    const userId = req.userId;
    

    const user = await User.findById(userId).select("-password");

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSIgnature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest('hex');
    
    if(expectedSIgnature === razorpay_signature){
        await Order.create({
            ...orderData,
            isPaid: true
        })

        return res.json({
        success: true,
        msg: "Payment verified and order placed successfully",
    })} else{
        return res.json({
            success: false,
            msg: "Payment Not verified"
        })
    }  
}

// get Key for verification /api/payment/key
const getKey = async (req, res) => {
    return res.json({
        success: true,
        key: process.env.RAZORPAY_API_KEY
    })
}

export {checkout, paymentVerification, getKey}