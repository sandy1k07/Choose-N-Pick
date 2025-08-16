import jwt from 'jsonwebtoken';

const restrictSeller = async (req, res, next) => {
    const {sellerToken} = req.cookies;

    if(!sellerToken){
        return res.json({
            success: false,
            msg: "Unauthorised access"
        })
    }

    try {
        const decodeToken = jwt.verify(sellerToken, process.env.JWT_KEY)
        if (decodeToken.email == process.env.ADMIN_MAIL) {
           
        }
        else {
            return res.json({
                success: false,
                msg: "Unauthorised access"
            });
        }
        next();
    } catch (error) {
        return res.json({
            success: false,
            msg: error.message,
        })
    }
}

export {restrictSeller};