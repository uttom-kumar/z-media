import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
  groupID : {type: mongoose.Schema.Types.ObjectId, required: true},
  postID : {type: mongoose.Schema.Types.ObjectId, required: true},

  likeList: [
    {
      userID: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      type: { type: String, enum: ["like", "love", "haha", "sad", "angry"], default: "like" }
    }
  ]
},{timestamps: true, versionKey: false})

export const GroupReactionModel = mongoose.model('GroupReaction', DataSchema)