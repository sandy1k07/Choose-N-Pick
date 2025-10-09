import Coupon from "../models/Coupon.js";
import User from "../models/User.js";

// adding coupon api/coupon/addCoupon

const addCoupon = async (req, res) => {
    const { couponId, maxDiscount, discountPercent, minValue } = req.body;
    const expiry = new Date(req.body.expiry);
    const coupon = { couponId, maxDiscount, discountPercent, minValue, expiry};
    
    const currentDate = new Date();
    
    
    if(currentDate >= expiry){
        return res.json({
            success: false,
            msg: "Expiry date should be in future"
        })
    }
    try {
        
        const existCoupon = await Coupon.findOne({ couponId: couponId });
        
        if (existCoupon && existCoupon.expiry >= currentDate){
            return res.json({
                success: false,
                msg: "Coupon already exists"
            })
        }else if(existCoupon){
            await Coupon.deleteOne(existCoupon);
        }

        await Coupon.insertOne(coupon);

        return res.json({
            success: true,
            msg: "Coupond added successfully"
        })
    } catch (error) {
        return res.json({
            success: false, 
            msg: error.message
        })
    }

}

// fetch all coupons /api/coupon/getCoupons

const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({});
        return res.json({
            success: true,
            coupons
        })
    } catch (error) {
        return res.json({
            success: false,
            msg: error.message
        })
    }
}

// apply coupon /api/coupon/apply
const applyCoupon = async (req, res) => {
    const {coupon, itemAmount} = req.body;
    const userId = req.userId;

    const dbCoupon = await Coupon.findOne({couponId: coupon});
    
    if(!dbCoupon){
        return res.json({
            success: false,
            msg: "Coupon not found or has expired"
        })
    }

    const userAvailedCoupon = await User.findOne({
        _id: userId,
        couponsApplied: dbCoupon._id
    })
    
    console.log(dbCoupon._id);
    

    if(userAvailedCoupon){
        return res.json({
            success: false,
            msg: "You have already availed the coupon"
        })
    }
    
    const {discountPercent, maxDiscount, minValue, expiry} = dbCoupon;
    const currentDate = new Date();
    
    if(currentDate > expiry){
        return res.json({
            success: false,
            msg: "Coupon has expired"
        })
    }else if(itemAmount < minValue){
        return res.json({
            success: false,
            msg: `You need to add items worth ${minValue - itemAmount} Rs to avail the coupon`
        })
    }else{
        let discount = Math.floor(itemAmount * (discountPercent / 100));
        if(maxDiscount) discount = Math.min(maxDiscount, discount);

        return res.json({
            success: true,
            msg: "Coupon applied successfully",
            itemAmount: itemAmount-discount
        })
    }
    
}


export { addCoupon, getCoupons, applyCoupon };