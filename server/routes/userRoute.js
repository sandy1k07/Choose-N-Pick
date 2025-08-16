import express from "express";
import { checkAuth, login, logout, register } from "../controllers/userController.js";
import { restrictLogin } from "../middlewares/authUser.js";

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/checkAuth', restrictLogin, checkAuth);
userRouter.get('/logout', restrictLogin, logout); 

export default userRouter;
