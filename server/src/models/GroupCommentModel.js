import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
  GroupID: { type: mongoose.Schema.Types.ObjectId, required: true},
  userID: { type: mongoose.Schema.Types.ObjectId, required: true},
  comment: { type: String, required: true },

  replies: [
    {
      GroupID: { type: mongoose.Schema.Types.ObjectId, required: true},
      replyText: { type: String, required: true },
      userID: { type: mongoose.Schema.Types.ObjectId, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
},{timestamps: true, versionKey: false})

export const GroupCommentModel = mongoose.model('GroupComment', DataSchema)