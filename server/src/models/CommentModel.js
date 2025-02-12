import mongoose from "mongoose"

const ReplySchema = new mongoose.Schema({
    blogID: {type : mongoose.Schema.Types.ObjectId,  required : true},
    userID: { type: mongoose.Schema.Types.ObjectId, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
},{timestamps: true, versionKey: false});

const CommentSchema = new mongoose.Schema({
    blogID: {type : mongoose.Schema.Types.ObjectId,  required : true},
    userID: { type: mongoose.Schema.Types.ObjectId, required: true },
    text: { type: String, required: true },
    replies: [ReplySchema],
    createdAt: { type: Date, default: Date.now }
},{timestamps: true, versionKey: false});

export const CommentModel = mongoose.model("comments", CommentSchema);
