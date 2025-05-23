import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  userID: {type : mongoose.Schema.Types.ObjectId,required: true },
  imageUrl: { type: String, default: ""},
  text: { type: String, default: "" },
  background: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // 24 hours auto delete
  views: { type: Number, default: 0 } // View count
},{versionKey: false});

export const StoryModel = mongoose.model("stories", storySchema);


