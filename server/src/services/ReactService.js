import {ReactModel} from "../models/ReactModel.js";
import mongoose from "mongoose";



export const CreateLikeService = async (req) => {
    try {
        const userID = req.headers.user_id;
        const { blogID } = req.body;

        if (!userID || !blogID) {
            return { status: "failed", message: "User ID & Blog ID required" };
        }

        // ১) চেষ্টা করি আনলাইক করতে (যদি আগে লাইক করে থাকে) —— atomic pull
        const pullRes = await ReactModel.updateOne(
            { blogID, "likeByUserID.userID": userID },
            {
                $pull: { likeByUserID: { userID } },
                $inc: { like: -1 },
            }
        );

        if (pullRes.modifiedCount) {
            return { status: "unlike", message: "Blog unliked successfully!" };
        }

        // ২) এখানে আসা মানে আগে লাইক করা ছিল না → এখন লাইক করি
        await ReactModel.updateOne(
            { blogID },
            {
                $addToSet: { likeByUserID: { userID, liked: true } }, // ডুপ্লিকেট আটকাবে
                $inc: { like: 1 },
            },
            { upsert: true }
        );

        return { status: "success", message: "Blog liked successfully!" };
    } catch (err) {
        // unique index collision হলে err.code === 11000
        return { status: "failed", message: err.message };
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