import {CommentModel} from "../models/CommentModel.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;


export const CreateCommentService = async (req, res) => {
    try {
        const user_id = req.headers.user_id;
        const reqBody = req.body;
        const { text , blogID } = reqBody

        // Validate input
        if (!user_id || !text || !blogID) {
            return {
                status: "failed",
                message: "User ID, blog ID, and text are required",
            }
        }

        const newComment = await CommentModel.create({
            userID: user_id,
            blogID: blogID,
            text: text,
        });

        // Success response
        return {
            status: "success",
            message: "Comment created successfully",
            comment: newComment,
        }
    } catch (err) {
        return {
            status: "failed",
            message: "Failed to create comment",
            error: err.message,
        }
    }
};

export const deleteCommentService = async (req) => {
    try{
        let user_id = req.headers.user_id;
        let {blogID , commentID} = req.body
        let queryMatch = {
            blogID: blogID,
            userID:user_id,
            _id:commentID
        }

        let data = await CommentModel.deleteOne(queryMatch)

        return {
            status : "success",
            message : "success to delete comment",
            data : data
        }
    }
    catch (err) {
        return{
            status: "failed",
            message: "Failed to delete comment",
            error: err.toString()
        }
    }
}

export const UpdateCommentService = async (req, res) => {
    try {
        const user_id = req.headers.user_id;
        const reqBody = req.body;
        const blogID = req.params.blogID;
        let { commentID } = req.query
        const { text} = reqBody

        if(!commentID){
            return {
                message: "commentID are required"
            }
        }

        // Validate input
        if (!user_id || !text || !blogID) {
            return {
                status: "failed",
                message: "User ID, blog ID, and text are required",
            }
        }

        const updatedComment = await CommentModel.findOneAndUpdate(
            { blogID: blogID, _id:commentID,userID: user_id },
            { $set: { text: text } },
            { upsert: true, new: true }
        );


        // Success response
        return {
            status: "success",
            message: "Comment created successfully",
            comment: updatedComment,
        }
    } catch (err) {
        return {
            status: "failed",
            message: "Failed to create comment",
            error: err.message,
        }
    }
};

export const SingleCommentService = async (req, res) => {
    try{
        let user_id = req.headers.user_id;
        let blogID = req.params.blogID
        let { commentID } = req.query

        if(!blogID){
            return {
                message:"blogID Required"
            }
        }
        if(!commentID){
            return {
                message:"blogID Required"
            }
        }

        let data = await CommentModel.findOne({
            userID:user_id,
            blogID:blogID,
            _id:commentID
        })
        return {
            status: "success",
            message : "Read successfully",
            data : data
        }
    }
    catch (err){
        return {
            status: "failed",
            message: "read comment failed",
            error: err.toString()
        }
    }
}

export const DetailsCommentService = async (req, res) => {
    try{
        let blogID = new ObjectId(req.params.id);
        let matchStage = {
            $match : {
                blogID : blogID
            }
        }
        let JoinWithUserStage = {
            $lookup : {
                from : "users",
                localField: "userID",
                foreignField: "_id",
                as : "user"
            }
        }
        let JoinWithProfileStage = {
            $lookup: {
                from : "userprofiles",
                localField: "userID",
                foreignField: "userID",
                as : "profile"
            }
        }
        let projectionStage = {
            $project : {
                "updatedAt": 0,
                "user.gender": 0,
                "user.email": 0,
                "user.password": 0,
                "user.createdAt": 0,
                "user.updatedAt": 0,
            }
        }
        let unwindUserStage = {$unwind : "$user"}
        let data = await CommentModel.aggregate([
            matchStage,
            JoinWithUserStage,
            unwindUserStage,
            // unwindUserStage,
            projectionStage,
            JoinWithProfileStage,
        ])
        return{
            status: "success",
            message: "Read successfully",
            data : data
        }
    }
    catch (err){
        return{
            status: "success",
            message: "Read successfully",
            error: err.toString()
        }
    }
}



// // Service to add a reply to a comment
// export const ReplayCommentService = async (req, res) => {
//     try {
//         const user_id = req.headers.user_id;
//         const commentID = req.params.id;
//         const { text } = req.body;
//
//         // Validate input
//         if (!user_id || !text) {
//             return res.status(400).json({ message: "User ID and reply text are required" });
//         }
//
//         // Find the comment by ID
//         const comment = await CommentModel.findById(commentID);
//
//         if (!comment) {
//             return { message: "Comment not found" }
//         }
//
//         // Add the reply to the comment
//         comment.replies.push({ userID: user_id, text });
//         // Save the updated comment
//         await comment.save();
//
//         // Success response
//         return{
//             status: "success",
//             message: "Reply added successfully",
//             comment,
//         }
//     } catch (err) {
//         return {
//             status: "failed",
//             message: "Failed to add reply",
//             error: err.message,
//         }
//     }
// };
//
// // export const ReadReplayCommentService = async (req, res) => {
// //     try{
// //
// //     }
// //     catch (err){
// //
// //     }
// // }