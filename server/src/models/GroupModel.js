import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
  userID : {type: mongoose.Schema.Types.ObjectId, required: true},
  GroupName: {type: String, unique: true, required: true},
  GroupPhoto: {type: String, required: true},
  bio: {type: String, required: true},
  role: {
    type: String,
    default: "Admin",
  },
  followers: [
    {
      userID: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      role: {
        type: String,
        enum: ["Admin", "Moderator", "Author", "Viewer"],
        default: "Author",
      },
    },
  ],
},{timestamps: true, versionKey: false})

export const GroupModel = mongoose.model('groups', DataSchema)