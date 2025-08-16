import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: Object,
        default: {},
    } 
}, {minimize: false})

// Without { minimize: false } (default is true)
// If you have a field like cart: {}, Mongoose will not store it in the database — it will completely omit it.

const User = mongoose.models.user || mongoose.model("user", userSchema);

// if the model is already available then it will use mongoose.models.user else it will create ne wmodel

export default User;