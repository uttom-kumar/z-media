import {BlogPostModel} from "../models/BlogPostModel.js";
import mongoose from "mongoose";
let ObjectId = mongoose.Types.ObjectId;
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const CreateBlogPostService = async (req) => {
    try {
        const user_id = req.headers.user_id;
        const { title , role} = req.body;
        const file = req.files?.image; // ফাইল থাকলে অ্যাক্সেস করবে, না থাকলে undefined হবে

        let imageUrl = null; // ডিফল্টভাবে null রাখছি

        // যদি ছবি থাকে, তাহলে Cloudinary-তে আপলোড করবো
        if (file) {
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                  {folder: "blog_photo"},
                  (error, result) => {
                      if (error) reject(error);
                      else resolve(result);
                  }).end(file.data)
            })
            imageUrl = uploadResult.secure_url; // Add image URL to the profile fields
        }

        // ব্লগ পোস্ট তৈরি
        const blogPost = await BlogPostModel.create({
            userID: user_id,
            role: role,
            title: title,
            image: imageUrl, // যদি ছবি থাকে, তাহলে URL; না থাকলে null
        });

        return {
            status: "success",
            msg: "Blog post created successfully",
            data: blogPost,
        };
    } catch (err) {
        return {
            status: "failed",
            message: "An error occurred while creating the blog post",
            error: err.toString(),
        };
    }
};

export const ReadBlogPostService = async (req, res) => {
    try{
        let userID = new ObjectId(req.headers.user_id)

        let JoinWithUserStage = {
            $lookup: {
                from: "users",
                localField: "userID",
                foreignField: "_id",
                as: "user"
            }
        }
        let JoinWithProfileStage = {
            $lookup: {
                from: "userprofiles",
                localField: "userID",
                foreignField: "userID",
                as: "profile"
            }
        }
        let JoinWithReactionStage = {
            $lookup : {
                from: "reacts",
                localField: "_id",
                foreignField: "blogID",
                as: "react"
            }
        }
        let JoinWithCommentStage = {
            $lookup : {
                from: "comments",
                localField: "_id",
                foreignField: "blogID",
                as: "comment"
            }
        }
        // Stage to process "likeByUserID" field in "reacts"
        let JoinWithLikeByUserStage = [
            { $unwind: { path: "$react", preserveNullAndEmptyArrays: true } }, // Unwind the "react" array
            {
                $lookup: {
                    from: "users", // Join with "users" collection
                    localField: "react.likeByUserID.userID", // Field in "react" to match
                    foreignField: "_id", // Match with "_id" in "users"
                    as: "likeByUser" // Output matched users here
                }
            },
        ];

        let JoinWithLikeByProfileStage = [
            { $unwind: { path: "$react", preserveNullAndEmptyArrays: true } }, // Unwind the "react" array
            {
                $lookup: {
                    from: "userprofiles", // Join with "users" collection
                    localField: "react.likeByUserID.userID", // Field in "react" to match
                    foreignField: "userID", // Match with "_id" in "users"
                    as: "likeByProfile" // Output matched users here
                }
            },

        ];

        let filterFriendshipStage = {
            $lookup: {
                from: "friends",
                localField: "userID",
                foreignField: "userID",
                as: "friendData"
            }
        };

        let filterRoleStage = {
            $match: {
                $or: [
                    // If the role is "public", allow anyone to view
                    { role: "public" },

                    // If the role is "friends", only allow followers, following, or mutual friends to view
                    { role: "friends", "friendData.follower.userID": userID },
                    { role: "friends", "friendData.following.userID": userID },
                    { role: "friends", "friendData.followed.userID": userID },
                    { role: "friends", userID: userID },

                    // If the role is "only me", only allow the user who created the post to view it
                    { role: "only me", userID: userID }
                ]
            }
        };

        let unwindUserStage = {$unwind: "$user"}

        let projectionStage = {
            $project: {
                'user.password': 0,
                'user.email': 0,
                'user.gender': 0,
                'likeByUser.password':0,
                'likeByUser.email':0,
                'likeByUser.gender':0,
                'likeByUser.username':0,
                'likeByUser.createdAt':0,
                'likeByUser.updatedAt':0,
                'likeByProfile.updatedAt':0,
                'likeByProfile.location':0,
                'likeByProfile.createdAt':0,
                'likeByProfile.coverPicture':0,
                'likeByProfile.bio':0,
            }
        }

        let data = await BlogPostModel.aggregate([
            JoinWithUserStage,
            unwindUserStage,
            JoinWithProfileStage,
            JoinWithReactionStage,
            JoinWithCommentStage,
            ...JoinWithLikeByUserStage,
            ...JoinWithLikeByProfileStage,
            filterFriendshipStage,
            filterRoleStage,
            projectionStage,
        ])
        return {
            status : "success",
            message : "Read successfully",
            data : data
        }
    }
    catch (err){
        return {
            status : "failed",
            message : "read failed",
            error : err.toString()
        }
    }
}


export const PostListDetailService = async (req) => {
    try{
        let blogID = new ObjectId(req.params.blogID)
        let MatchStage = {
            $match : {_id : blogID}
        }

        let JoinWithUserStage = {
            $lookup: {
                from : "users",
                localField: "userID",
                foreignField: "_id",
                as: "user"
            }
        }
        let JoinWithProfileStage = {
            $lookup : {
                from: "userprofiles",
                localField: "userID",
                foreignField: "userID",
                as: "profile"
            }
        }

        let JoinWithReactionStage = {
            $lookup: {
                from: "reacts",
                localField: "_id",
                foreignField: "blogID",
                as: "react"
            }
        }



        let unwindUserStage = {$unwind: "$user"}
        let unwindProfileStage = {$unwind: "$profile"}
        let unwindReactStage = {$unwind: "$react"}
        let projectionStage = {
            $project: {
                'user.password' : 0,
                'user.email' : 0,
                'user.gender' : 0,
            }
        }

        let data = await BlogPostModel.aggregate([
            MatchStage,
            JoinWithUserStage,
            JoinWithReactionStage,
            JoinWithProfileStage,
            unwindUserStage,
            // unwindProfileStage,
            // unwindReactStage,
            projectionStage,
        ])

        return{
            status: "success",
            message: "blog details successfully",
            data : data
        }
    }
    catch (err){
        return{
            status: "error",
            "message" : "details read failed",
            error: err.toString()
        }
    }
}

export const SingleUserReadBlogService = async (req, res) => {
    try{
        let id = req.params.id
        let data = await BlogPostModel.findOne({_id: id})
        if(!data) {
            return {
                status: "failed",
                message: "Blog Post not found"
            }
        }

        return {
            status : "success",
            message : "Read successfully",
            data : data
        }
    }
    catch (err){
        return {
            status : "failed",
            message : "read failed",
            error : err.toString()
        }
    }
}

// specific user show data in my dashboard
export const UserByBlogPostListService = async (req) => {
    try{
        let user_id = new ObjectId(req.headers.user_id)

        let MatchStage = {$match: {userID : user_id}}

        let JoinWithUserStage = {
            $lookup: {
                from: "users",
                localField: "userID",
                foreignField: "_id",
                as: "user"
            }
        }
        let JoinWithProfileStage ={
            $lookup:{
                from: "userprofiles",
                localField: "userID",
                foreignField: "userID",
                as: "profile"
            }
        }
        let JoinWithReactionStage = {
            $lookup: {
                from: "reacts",
                localField: "_id",
                foreignField: "blogID",
                as: "Reaction"
            }
        }
        let JoinWithCommentStage = {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "blogID",
                as: "comment"
            }
        }

        let unwindUserStage = {$unwind: "$user"}


        let projectionStage = {
            $project: {
                'user.password' : 0,
                'user.gender':0,
                'user.email' : 0,
                'user.createdAt' : 0,
                'user.updatedAt' : 0,
            }
        }

        let data = await BlogPostModel.aggregate([
            MatchStage,
            JoinWithUserStage,
            unwindUserStage,
            JoinWithCommentStage,
            projectionStage,
            JoinWithReactionStage,
            JoinWithProfileStage,
        ])
        return {
            status : "success",
            message : "Read successfully",
            data : data
        }
    }
    catch (err) {
        return{
            status: "failed",
            message: "User Filter Failed",
            error : err.toString()
        }
    }
}

export const deleteBlogPostService = async (req, res) => {
    try{
        let user_id = req.headers.user_id
        let id = req.params.id

        // ব্লগ পোস্ট খোঁজা যাতে তার ইমেজ URL পাওয়া যায়
        let blogPost = await BlogPostModel.findOne({ userID: user_id, _id: id });

        if (!blogPost) {
            return {
                status: "failed",
                message: "Blog post not found",
            };
        }

        // যদি ব্লগ পোস্টে ছবি থাকে, তাহলে Cloudinary থেকে মুছতে হবে
        if (blogPost["image"]) {
            // Cloudinary-র public_id বের করা (image URL থেকে)
            const publicId = blogPost["image"].split('/').pop().split('.')[0];

            // Cloudinary থেকে ছবি ডিলিট করা
            await cloudinary.uploader.destroy(`blog_photo/${publicId}`);
        }

        let data= await BlogPostModel.deleteOne({userID:user_id, _id: id})

        return {
            status: "success",
            message: "Blog list read Successfully",
            data : data
        }
    }
    catch (e){
        return{
            status: "failed",
            message: "Blog Post remove Failed",
            error : e.toString()
        }
    }
}

export const UpdateBlogPostService = async (req,res) => {
    try{
        let user_id = req.headers.user_id
        let id = req.params.id
        const { title, role } = req.body;

        let updateData = { title, role }
        const file = req.files?.image;

        // Check if an image is provided
        if (file) {
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                  {folder: "blog_photo"},
                  (error, result) => {
                      if (error) reject(error);
                      else resolve(result);
                  }).end(file.data)
            })
            updateData.image = uploadResult.secure_url; // Add image URL to the profile fields
        }

        // ব্লগ পোস্ট খোঁজা যাতে তার ইমেজ URL পাওয়া যায়
        let BlogPost = await BlogPostModel.findOne({ userID: user_id, _id: id });

        if (!BlogPost) {
            return {
                status: "failed",
                message: "Blog post not found",
            };
        }

        // যদি ব্লগ পোস্টে ছবি থাকে, তাহলে Cloudinary থেকে মুছতে হবে
        if (BlogPost["image"]) {
            // Cloudinary-র public_id বের করা (image URL থেকে)
            const publicId = BlogPost["image"].split('/').pop().split('.')[0];

            // Cloudinary থেকে ছবি ডিলিট করা
            await cloudinary.uploader.destroy(`blog_photo/${publicId}`);
        }

        // Perform the update
        const data = await BlogPostModel.updateOne(
          { _id: id, userID: user_id },
          { $set: updateData }
        );

        return {
            status : "success",
            message : "Update Successfully",
            data : data
        }
    }
    catch (err){
        return{
            status: "failed",
            message: "Blog Post update Failed",
            error : err.toString()
        }
    }
}


//search by Blog title
export const ListByKeywordService = async (req) => {
    try{
        let {title} = req.body
        if (typeof title !== "string") {
            return {
                status : "failed",
                message: "Keyword must be a string"
            };
        }
        let searchRegex = {"$regex" : title, "$options" : "i"}
        let searchBody = [{title : searchRegex}];
        let searchQuery = {"$or" : searchBody}

        let MatchStage = {$match : searchQuery}

        let JoinUserStageStage = {
            $lookup : {
                from : "users",
                localField: "userID",
                foreignField: "_id",
                as : "user"
            }
        }

        let unwindStage = {
            $unwind: "$user"
        }

        let data = await BlogPostModel.aggregate([
            MatchStage,
            JoinUserStageStage,
            unwindStage
        ])

        return {
            status : "success",
            message : "Search successfully",
            data : data
        }
    }
    catch (err){
        return{
            status: "failed",
            error : err.toString()
        }
    }
}


export const UserBySingleListDetailService = async (req) => {
    try{
        let user_id = new ObjectId(req.params.userID)

        let loggedUserID = new ObjectId(req.headers.user_id)

        let MatchStage = {
            $match:{
                userID : user_id
            }
        }

        let JoinWithUserStage = {
            $lookup: {
                from: "users",
                localField: "userID",
                foreignField: "_id",
                as: "user"
            }
        }
        let JoinWithProfileStage ={
            $lookup:{
                from: "userprofiles",
                localField: "userID",
                foreignField: "userID",
                as: "profile"
            }
        }
        let JoinWithReactionStage = {
            $lookup: {
                from: "reacts",
                localField: "_id",
                foreignField: "blogID",
                as: "Reaction"
            }
        }
        let JoinWithCommentStage = {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "blogID",
                as: "comment"
            }
        }

        let filterFriendshipStage = {
            $lookup: {
                from: "friends",
                localField: "userID",
                foreignField: "userID",
                as: "friendData"
            }
        };

        let filterRoleStage = {
            $match: {
                $or: [
                    // If the role is "public", allow anyone to view
                    { role: "public" },

                    // If the role is "friends", only allow followers, following, or mutual friends to view
                    { role: "friends", "friendData.follower.userID": loggedUserID },
                    { role: "friends", "friendData.following.userID": loggedUserID },
                    { role: "friends", "friendData.followed.userID": loggedUserID },
                    { role: "friends", userID: loggedUserID },

                    // If the role is "only me", only allow the user who created the post to view it
                    { role: "only me", userID: loggedUserID }
                ]
            }
        };


        let unwindUserStage = {$unwind: "$user"}

        let projectionStage = {
            $project: {
                'user.password' : 0,
                'user.gender':0,
                'user.email' : 0,
                'user.createdAt' : 0,
                'user.updatedAt' : 0,
            }
        }

        let data = await BlogPostModel.aggregate([
            MatchStage,
            JoinWithUserStage,
            unwindUserStage,
            JoinWithCommentStage,
            projectionStage,
            JoinWithReactionStage,
            JoinWithProfileStage,
            filterFriendshipStage,
            filterRoleStage
        ])
        return {
            status : "success",
            message : "Read successfully",
            data : data
        }

    }
    catch (err){
        return{
            status: "failed",
            message: "Read details failed",
            error: err.toString()
        }
    }
}



