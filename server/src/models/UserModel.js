import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

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

DataSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

export const UserModel = mongoose.model('users', DataSchema);
