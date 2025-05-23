import {ReactModel} from "../models/ReactModel.js";
import mongoose from "mongoose";


export const CreateLikeService = async (req) => {
    try {
        const userID = req.headers.user_id; // Get user ID (consider using token for better security)
        const { blogID } = req.body;

        // Validate input
        if (!userID || !blogID) {
            return { status: "error", message: "User ID and Blog ID are required." };
        }

        // Find or create a React document for the blog
        let react = await ReactModel.findOne({ blogID });
        if (!react) {
            react = new ReactModel({ blogID, like: 0, dislike: 0, likeByUserID: [] });
        }

        // Check if the user has already liked the blog
        const userLiked = react.likeByUserID.some((entry) => entry.userID.toString() === userID);

        if (userLiked) {
            // If already liked, "unlike" the blog
            react.likeByUserID = react.likeByUserID.filter((entry) => entry.userID.toString() !== userID);
            react.like = Math.max(0, react.like - 1); // Decrease like count, ensuring it doesn't go below 0
            await react.save(); // Save the updated react document
            return { status: "unlike", message: "Blog unliked successfully!" };
        } else {
            // If not liked, "like" the blog
            react.likeByUserID.push({ userID });
            react.like += 1; // Increase like count
            await react.save(); // Save the updated react document
            return { status: "success", message: "Blog liked successfully!" };
        }
    } catch (err) {
        return { status: "error", message: err.message };
    }
};


export const ReactionReadService = async (req) => {
    try {
        const  blogID  =new  mongoose.Types.ObjectId(req.params.id)

        const MatchStage = {
            $match : {
                blogID : blogID,
            }
        }
        const UnwindLikeByUserStage = {
            $unwind: "$likeByUserID",
        };

        let JoinWithUserStage = {
            $lookup : {
                from : "users",
                localField: "likeByUserID.userID",
                foreignField: "_id",
                as : "user"
            }
        }
        let unwindUserStage = {$unwind: "$user"}

        let JoinWithProfileStage = {
            $lookup: {
                from : "userprofiles",
                localField: "likeByUserID.userID",
                foreignField: "userID",
                as : "profile"
            }
        }

        let projectionStage = {
            $project: {
                "createdAt" : 0,
                "updatedAt" : 0,
                "user.password": 0,
                "user.email": 0,
                "user.gender": 0,
                "user.createdAt": 0,
                "user.updatedAt": 0,
                "profile.createdAt": 0,
                "profile.updatedAt": 0,
                "profile.location": 0,
                "profile.bio": 0,
            }
        }

        const reaction = await ReactModel.aggregate([
            MatchStage,
            UnwindLikeByUserStage,
            JoinWithUserStage,
            unwindUserStage,
            JoinWithProfileStage,
            projectionStage
        ])

        if (!reaction) {
            return { status: "fail", message: "No reactions found for this blog." };
        }

        return {
            status: "success",
            data: reaction
        };
    } catch (err) {
        return { status: "error", message: err.message };
    }
};