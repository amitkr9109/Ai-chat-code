import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [6, "Email must be at least 6 characters long"],
        maxLength: [50, "Email must not be longer than 50 characters"],
    },

    password: {
        type: String,
        select: false,
    },
});

UserSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateJWT = function(){
    return jwt.sign({ email: this.email }, process.env.JWT_SECRET, {expiresIn: "24h"});
};

const userModel = mongoose.model("User", UserSchema);
export default userModel;