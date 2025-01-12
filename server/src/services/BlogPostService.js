import {BlogPostModel} from "../models/BlogPostModel.js";
import mongoose from "mongoose";
let ObjectId = mongoose.Types.ObjectId;

export const CreateBlogPostService = async (req, res) => {
    try{
        let user_id = req.headers.user_id;
        let reqBody = req.body
        reqBody.userID = user_id

        let data = await BlogPostModel.create(reqBody)

        return{
            status: "success",
            msg : "Upload Successfully",
            data : data
        }
    }
    catch (err) {
        return {
            status : "failed",
            message : "upload failed",
            error : err.toString()
        }
    }
}

export const ReadBlogPostService = async (req, res) => {
    try{
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
                as: "reaction"
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
        let unwindProfileStage = {$unwind: "$profile"}
        let unwindUserStage = {$unwind: "$user"}

        let projectionStage = {
            $project: {
                'user.password': 0,
                'user.email': 0,
                'user.gender': 0,
            }
        }

        let data = await BlogPostModel.aggregate([
            JoinWithUserStage,
            unwindUserStage,
            JoinWithProfileStage,
            unwindProfileStage,
            projectionStage,
            JoinWithReactionStage,
            JoinWithCommentStage
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
        let unwindUserStage = {$unwind: "$user"}

        let data = await BlogPostModel.aggregate([
            MatchStage,
            JoinWithUserStage,
            unwindUserStage
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

        let data= await BlogPostModel.deleteOne({_id: id})

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
        let reqBody = req.body

        let data = await BlogPostModel.updateOne({_id: id , userID:user_id},{$set: reqBody})


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

export const PostListDetailService = async (req) => {
    try{
        let blogId = new ObjectId(req.params.id)
        let MatchStage = {
            $match : {_id : blogId}
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
        let unwindUserStage = {$unwind: "$user"}
        let unwindProfileStage = {$unwind: "$profile"}
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
            unwindUserStage,
            projectionStage,
            JoinWithProfileStage,
            unwindProfileStage
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
