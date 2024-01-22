import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        maxlength: 30
    }
})

export const userModel = mongoose.model("User",userSchema);