import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },

    follower: [{
        userID: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    }],
    following: [{
        userID : { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    }],
    // all mutual Friends -- here -------
    followed: [{
        userID : { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    }]
},{timestamps: true, versionKey: false});

export const FriendRequestModel = mongoose.model('friends', friendSchema);
