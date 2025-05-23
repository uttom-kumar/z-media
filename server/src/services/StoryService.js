import mongoose from "mongoose";

let ObjectId = mongoose.Types.ObjectId;
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import {StoryModel} from "../models/StoryModel.js";
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const CreateStoryService = async (req) => {
  try{
    let user_id = req.headers.user_id;
    const { text, background} = req.body;
    const file = req.files?.imageUrl;

    let imageUrl = null; // ডিফল্টভাবে null রাখছি

    // যদি ছবি থাকে, তাহলে Cloudinary-তে আপলোড করবো
    if (file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {folder: "story_photo"},
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }).end(file.data)
      })
      imageUrl = uploadResult.secure_url; // Add image URL to the profile fields
    }

    // ব্লগ পোস্ট তৈরি
    const blogPost = await StoryModel.create({
      userID: user_id,
      text: text,
      background:background,
      imageUrl: imageUrl, // যদি ছবি থাকে, তাহলে URL; না থাকলে null
    });

    return {
      status: "success",
      message : "create story successfully",
      data: blogPost
    }
  }
  catch (err) {
    return{
      status: "failed",
      message : "create failed story service",
      error : err.toString()
    }
  }
}


export const ReadStoryService = async (req) => {
  try{
    const JoinWithUserStage = {
      $lookup : {
        from: "users",
        localField: "userID",
        foreignField: "_id",
        as: "user"
      }
    }
    const JoinWithProfileStage = {
      $lookup: {
        from: "userprofiles",
        localField: "userID",
        foreignField: "userID",
        as: "profile"
      }
    }
    const UnwindProfileStage = {
      $unwind: {path : "$profile", preserveNullAndEmptyArrays: true},
    }

    const UnwindUserStage = {$unwind:"$user"}
    const projectionStage = {
      $project: {
        "user.password":0,
        "user.username":0,
        "user.email":0,
        "user.gender":0,
        "user.phone":0,
        "user.createdAt":0,
        "user.updatedAt":0,
        "profile.bio":0,
        "profile.address":0,
        "profile.profession":0,
        "profile.location":0,
        "profile.coverPicture":0,
        "profile.createdAt":0,
        "profile.updatedAt":0,
      }
    }

    const data = await StoryModel.aggregate([
      JoinWithUserStage,
      UnwindUserStage,
      JoinWithProfileStage,
      UnwindProfileStage,
      projectionStage,
    ])
    return {
      status: "success",
      message: "read successfully",
      data: data
    }
  }
  catch(err){
    return{
      status: "failed",
      message : "read failed story service",
      error : err.toString()
    }
  }
}


export const DeleteStoryService = async (req) => {
  try{
    const {storyID} = req.body
    const user_id = req.headers.user_id

    // ব্লগ পোস্ট খোঁজা যাতে তার ইমেজ URL পাওয়া যায়
    let StoryPost = await StoryModel.findOne({ userID: user_id, _id: storyID });

    if (!StoryPost) {
      return {
        status: "failed",
        message: "Blog post not found",
      };
    }
    // যদি ব্লগ পোস্টে ছবি থাকে, তাহলে Cloudinary থেকে মুছতে হবে
    if (StoryPost["imageUrl"]) {
      // Cloudinary-র public_id বের করা (image URL থেকে)
      const publicId = StoryPost["imageUrl"].split('/').pop().split('.')[0];
      // Cloudinary থেকে ছবি ডিলিট করা
      await cloudinary.uploader.destroy(`story_photo/${publicId}`);
    }

    const data = await StoryModel.deleteOne(
      {
        userID: user_id,
        _id : storyID
      }
    )
    if(data.deletedCount === 0){
      return {
        status: "failed",
        message : "story not found"
      }
    }
    return {
      status: "success",
      message: "read successfully",
      data: data
    }
  }
  catch (err){
    return{
      status: "failed",
      message : "Delete failed story service",
      error : err.toString()
    }
  }
}


export const ReadSingleStoryService = async (req) => {
  try{
    const storyID = new ObjectId(req.params.storyID)

    const MatchStage = {
      $match : {_id: storyID},
    }

    const JoinWithUserStage = {
      $lookup : {
        from: "users",
        localField: "userID",
        foreignField: "_id",
        as: "user"
      }
    }
    const JoinWithProfileStage = {
      $lookup : {
        from: "userprofiles",
        localField: "userID",
        foreignField: "userID",
        as: "profile"
      }
    }


    const UnwindUserStage = {
      $unwind : "$user"
    }
    const UnwindProfileStage = {
      $unwind : {path : "$profile", preserveNullAndEmptyArrays: true}
    }

    const projectionStage = {
      $project: {
        "user._id":0,
        "user.username":0,
        "user.email":0,
        "user.gender":0,
        "user.phone":0,
        "user.password":0,
        "user.createdAt":0,
        "user.updatedAt":0,
        "profile.updatedAt":0,
        "profile.userID":0,
        "profile._id":0,
        "profile.address":0,
        "profile.bio":0,
        "profile.coverPicture":0,
        "profile.createdAt":0,
        "profile.profession":0,
        "profile.location":0,
      }
    }

    const data = await StoryModel.aggregate([
      MatchStage,
      JoinWithUserStage,
      JoinWithProfileStage,


      UnwindUserStage,
      UnwindProfileStage,
      projectionStage,
    ])

    return {
      status : "success",
      message: "read successfully",
      data: data
    }
  }
  catch (err){
    return{
      status: "success",
      message: "failed to read story",
      error: err.toString()
    }
  }
}


