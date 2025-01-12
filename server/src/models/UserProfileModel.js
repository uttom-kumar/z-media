import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, required: true },
    profilePicture: { type: String, default: '' },
    coverPicture: { type: String, default: '' },
    bio : {type: String , max: 200},
    location : {type: String, required: true},
},{timestamps: true, versionKey: false});

export const UserProfileModel = mongoose.model('userprofiles', DataSchema)