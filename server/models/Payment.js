import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    paymentNo: {
        Type: String, 
        required: true,
        unique: true,
    },
    userId: {
        Type: String,
        required: true,
        ref: 'user'
    },
    OrderId: {
        Type: String,
        required: true,
        ref: 'order'
    }
})

const Payment = mongoose.model("payment", PaymentSchema);

export default Payment;