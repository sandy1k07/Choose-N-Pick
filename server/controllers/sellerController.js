import jwt from 'jsonwebtoken'

// Seller Login /api/seller/login

const sellerLogin = async (req, res) => {
    try {
        const body = req.body;
        const email = body.sellerEmail
        const password = body.sellerPassword

        if(!email || !password){
            return res.json({
                success: false, 
                msg: "Email or Password is missing"
            })
        }

        if (email === process.env.ADMIN_MAIL && password === process.env.ADMIN_PASS) {
            const sellerToken = jwt.sign({
                email: email,
            }, process.env.JWT_KEY, { expiresIn: '5d' });

            res.cookie('sellerToken', sellerToken, {
                httpOnly: true, // it prevents JS to access the cookie
                secure: process.env.NODE_ENV === 'production', // use secure cookie in production
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
                maxAge: 5 * 24 * 60 * 60 * 1000, // cookie expiration time
            });

            return res.json({
                success: true,
                msg: "Welcome admin",
            })
        }
        else{
            return res.json({
                success: false,
                msg: "Invalid credentials",
            })
        }
        
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            msg: error.message,
        })
    }
}

// Seller  authorisation /api/seller/checkAuth

const checkSellerAuth = async (req, res) => {
    try {
        return res.json({
            success: true,
            msg: "Admin authorised"
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            msg: error.message,
        })   
    }
}


// Admin logout /api/seller/logout
const sellerLogout = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true, // it prevents JS to access the cookie
            secure: process.env.NODE_ENV === 'production', // use secure cookie in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
        });
        return res.json({
            success: true, 
            msg: "Logged Out successfully"
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            msg: error.message,
        })
    }
}

export {sellerLogin, checkSellerAuth, sellerLogout}