import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    fullName: {type: String, required: true},
    username: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z][a-zA-Z0-9_-]{1,14}[a-zA-Z0-9]$/, 'Invalid username format']
    },
    gender: {type: String, required: true},
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please fill a valid email address']
    },
    password: {type: String, required: true},
},{timestamps: true, versionKey: false});

export const UserModel = mongoose.model('users', DataSchema)

