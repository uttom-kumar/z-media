import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, required: true },
    profilePicture: { type: String, default: '' },
    coverPicture: { type: String, default: '' },
    bio : {type: String , max: 200, default:""},
    location : {type: String, default:""},
    profession : {type: String, default:""},
    address : {type: String, default:""},
},{timestamps: true, versionKey: false});

export const UserProfileModel = mongoose.model('userprofiles', DataSchema)