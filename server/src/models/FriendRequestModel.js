import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted'],
        default: 'pending'
    }
},{timestamps: true, versionKey: false});

export const FriendRequestModel = mongoose.model('friends', friendSchema);
