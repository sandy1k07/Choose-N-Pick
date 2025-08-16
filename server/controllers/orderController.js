import Order from "../models/Orders.js";
import Product from "../models/Product.js";


// Place Order (COD) /api/order/cod
const placeOrderCod = async (req, res) => {
    try {
        const {items, address} = req.body;
        const userId = req.userId;
        if(!address || items.length === 0){
            return res.json({
                success: false,
                msg: "Invalid data"
            })
        }

        // calculate amount of items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0);

        // const products = await Promise.all(items.map(i => Product.findById(i.product)));
        // const amount = products.reduce((sum, product, idx) =>
        //     sum + product.offerPrice * items[idx].quantity,
        //     0);

        // calculate tax (12% GST)
        amount+= Math.floor(amount * 0.12);

        await Order.create({
            userId: userId,
            items: items,
            amount: amount,
            address: address,
            paymentType: "COD"
        })

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
        const {items, address} = req.body;
        const userId = req.userId;
        if(!address || items.length === 0){
            return res.json({
                success: false,
                msg: "Invalid data"
            })
        }

        // calculate amount of items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0);

        // const products = await Promise.all(items.map(i => Product.findById(i.product)));
        // const amount = products.reduce((sum, product, idx) =>
        //     sum + product.offerPrice * items[idx].quantity,
        //     0);

        // calculate tax (12% GST)
        amount+= Math.floor(amount * 0.12);

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
