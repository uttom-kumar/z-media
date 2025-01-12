import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    userID : { type: mongoose.Schema.Types.ObjectId, required: true },
    title: {type: String, required: true},
    image: {type: String, default: ""},
},{timestamps: true, versionKey: false})
export const BlogPostModel = mongoose.model('blogposts', DataSchema)