import express from 'express';
import Razorpay from 'razorpay'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import connectDb from './configs/db.js';
import dotenv from 'dotenv'
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import paymentRouter from './routes/paymentRoute.js';
dotenv.config()
const app = express();
const PORT = process.env.PORT || 3007;

const init = async () => {
  try {
    await connectDb();
    await connectCloudinary();

    if(process.env.NODE_ENV !== 'production'){
      app.listen(PORT, () =>
        console.log(`Server listening at PORT: ${PORT}`)
      );
    }
    
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

// Allowing what all origins are allowed to access the backend
const allowedOrigins = ['http://localhost:5173', 'https://choose-n-pickfrontend.vercel.app'] 

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}))
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)
app.use('/api/payment', paymentRouter)

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

init();

export default app;
// app.listen(PORT, ()=> console.log(`Server listening at PORT: ${PORT}`));

