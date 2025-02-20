import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema({
    blogID: {type : mongoose.Schema.Types.ObjectId,  required : true},
    userID: { type: mongoose.Schema.Types.ObjectId, required: true },
    text: { type: String, required: true },
    replies: [
        {
            replyText: { type: String, required: true },
            userID: { type: mongoose.Schema.Types.ObjectId, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
},{timestamps: true, versionKey: false});

export const CommentModel = mongoose.model("comments", CommentSchema);
