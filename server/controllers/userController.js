// Register User  /user/register

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import mongoose from "mongoose";


// SIGNUP route /api/user/register

const register = async (req, res) => {
        try {
            const {name, email, password} = req.body;
            if(!name || !email || !password){
                return res.json({
                    success: false,
                    msg: "Details are missing"
                })
            }

            const existingUser = await User.findOne({email: email});
            if(existingUser){
                return res.json({
                    success: false,
                    msg: "User Already Exists!"
                })
            }

            const passHash = await bcrypt.hash(password, 8);

            const user = await User.create({
                name: name, 
                email: email, 
                password: passHash,
            })

            const token = jwt.sign({
                id: user._id, 
            }, process.env.JWT_KEY, {expiresIn: '5d'});

            res.cookie('token', token, {
                httpOnly: true, // it prevents JS to access the cookie
                secure: process.env.NODE_ENV === 'production', // use secure cookie in production
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
                maxAge: 5 * 24 * 60 * 60 * 1000, // cookie expiration time
            });

            return res.json({
                success: true,
                msg: "User has been created successfully",
                user: {
                    name: user.name,
                    email: user.email,
                }
            })
        } catch (error) {
            console.log(error.message);
            return res.json({
                success: false, 
                msg: error.message,
            })
        }
}

// Login route /api/user/login

const login =  async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.json({
                success: false, 
                msg: "Email or Password is missing"
            })
        }

        const user = await User.findOne({email: email});

        if(!user){
            return res.json({
                success: false,
                msg: "User not found"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.json({
                success: false,
                msg: "Invalid Password",
            })
        }

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_KEY, { expiresIn: '5d' });

        res.cookie('token', token, {
            httpOnly: true, // it prevents JS to access the cookie
            secure: process.env.NODE_ENV === 'production', // use secure cookie in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
            maxAge: 5 * 24 * 60 * 60 * 1000, // cookie expiration time
        });

        return res.json({
            success: true,
            msg: "Logged In successfully",
            user: {
                name: user.name,
                email: user.email,
            }
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            msg: error.message,
        })
    }
}


// Checking for Authorisation  /api/user/checkAuth

const checkAuth = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).select("-password")  // excludes password  

        return res.json({
            success: true,
            user,
        })
    } catch (error) {
        return res.json({
            success: false,
            msg: error.message,
        })   
    }
}


// Logout user  /api/user/logout

const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true, // it prevents JS to access the cookie
            secure: process.env.NODE_ENV === 'production', // use secure cookie in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
        });
        
        return res.json({
            success: true, 
            msg: "Logged Out successfully"
        })
    } catch (error) {
        return res.json({
            success: false,
            msg: error.message,
        })
    }
}

export {register, login, checkAuth, logout}