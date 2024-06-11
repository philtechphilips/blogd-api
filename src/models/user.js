import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            min: 3,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            min: 3,
        },
        profileImgUrl: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            required: true,
            default: false,
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
    }
);


//generate user tokens
userSchema.methods.generateAuthToken = async function (useragent) {
    const user = this;
    const token = jwt.sign(
        { _id: this._id.toString(), role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: "2 hours" }
    );
    await user.save();
    return token;
};

//remove private fields response
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};



const User = mongoose.model("User", userSchema);

export default User;