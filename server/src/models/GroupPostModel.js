import mongoose from "mongoose";

const DataSchema = mongoose.Schema({
  groupID : {type: mongoose.Schema.Types.ObjectId, required: true},
  userID : {type: mongoose.Schema.Types.ObjectId, required: true},
  role : {type: String, required: true},
  title: {type: String, default:''},
  image: {type: String, default: ""},
},{timestamps: true, versionKey: false})

export const GroupPostModel = mongoose.model('GroupPost', DataSchema)