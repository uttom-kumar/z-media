import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
    userID : { type: mongoose.Schema.Types.ObjectId, required: true , },
    role: {
        type: String,
        enum: ["public", "friends", "only me"],
        default: "public"
    },
    title: {type: String, default:''},
    image: {type: String, default: ""},
},{timestamps: true, versionKey: false})
export const BlogPostModel = mongoose.model('blogposts', DataSchema)