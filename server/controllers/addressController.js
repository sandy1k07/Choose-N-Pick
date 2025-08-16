import Address from "../models/Address.js";


// Add Address /api/address/add
const addAddress = async (req, res) => {
    
    try {
        const {address} = req.body;
        const userId = req.userId;
        await Address.create({
            ...address, 
            userId: userId
        })
        return res.json({
            success: true,
            msg: "Address added successfully"
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            msg: error.message,
        })   
    }
}

// Get address /api/address/fetch
const fetchAddress = async  (req, res) => {
    try {
        const userId = req.userId;
        const addresses = await Address.find({
            userId: userId
        })
        return res.json({
            success: true, 
            addresses
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            msg: error.message,
        })
    }
}

export {addAddress, fetchAddress};