import jwt from 'jsonwebtoken'

const restrictLogin = async (req, res, next) => {
    
    const token = req.cookies.token;
    if(!token){
        return res.json({
            success: false, 
            msg: "Unauthorised access user"
        });
    }

    try {
        const decodeToken = jwt.verify(token, process.env.JWT_KEY)
        
        if(decodeToken.id){
            req.userId = decodeToken.id;
        }
        else {
            return res.json({
                success: false,
                msg: "Unauthorised access user"
            });
        }
        next();
    } catch (error) {
        console.error("JWT Verify Error:", error);
        return res.json({
            success: false,
            msg: error.message,
        })
    }
}

export {restrictLogin};