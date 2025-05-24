import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    gender: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    otp : {type: String, default: null}
}, { timestamps: true, versionKey: false });

export const UserModel = mongoose.model('users', DataSchema);
