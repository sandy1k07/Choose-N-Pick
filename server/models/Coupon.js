import mongoose, { Mongoose } from "mongoose";

const couponSchema = new mongoose.Schema({
    couponId:{
        type: String,
        required: true,
        unique: true,
    },
    discountPercent:{
        type: Number,
        required: true,
    },
    maxDiscount:{
        type: Number,
    },
    minValue:{
        type: Number, 
        default: 0
    },
    expiry:{
        type: Date,
        required: true
    }
})

const Coupon = mongoose.models.coupon || mongoose.model("coupon", couponSchema);

export default Coupon;