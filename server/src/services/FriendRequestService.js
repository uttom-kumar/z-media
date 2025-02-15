import {FriendRequestModel} from "../models/FriendRequestModel.js";
import mongoose from "mongoose";
import {UserModel} from "../models/UserModel.js";
const ObjectId = mongoose.Types.ObjectId;


export const FollowerService = async (req) => {
    try {
        const userId = req.headers.user_id
        const {targetUserId} = req.body

        if(!userId){
            return {
                status: "error",
                message: "user Id ID are required."
            };
        }
        if(!targetUserId){
            return {
                status: "error",
                message: "targetUserId ID are required."
            };
        }

        if (userId === targetUserId) {
            return {
                status : "failed",
                message: "You cannot follow yourself."
            }
        }

        // Check if the user has already followed the target user
        const alreadyFollowing = await FriendRequestModel.findOne({
            userID: userId,
            "following.userID": targetUserId,
        });

        if (alreadyFollowing) {
            return {
                status: "failed",
                message: "You have already followed this user."
            }
        }

        // Check if the user has already followed the target user
        const alreadyFollowed = await FriendRequestModel.findOne({
            userID: userId,
            "followed.userID": targetUserId,
        });
        if(alreadyFollowed){
            return {
                status: "failed",
                message: "You have already followed this user."
            }
        }


        // Add to target user's followers
        await FriendRequestModel.findOneAndUpdate(
          { userID: targetUserId },
          { $addToSet: { follower: { userID: userId } } },
          { upsert: true, new: true }
        );

        // Add to the user's following list
        await FriendRequestModel.findOneAndUpdate(
          { userID: userId },
          { $addToSet: { following: { userID: targetUserId } } },
          { upsert: true, new: true }
        );

        return {
            status: "success",
            message: "friend request successfully."
        };
    } catch (error) {
        return {
            status : "failed",
            message : "friend request failed"
        }
    }
}

export const acceptFollowService = async (req) => {
    try {
        let userId = req.headers.user_id;
        let { targetUserId } = req.body;

        if (userId === targetUserId) {
            return {
                status: "failed",
                message: "You cannot accept your own follow request."
            };
        }

        // Check if the follow request already accepted
        const alreadyFollowed = await FriendRequestModel.findOne({
            userID: userId,
            "followed.userID": targetUserId
        });

        if (alreadyFollowed) {
            return {
                status: "failed",
                message: "You have already accepted this user's Friend request."
            };
        }

        // Check if the follower request already
        const alreadyFollower = await FriendRequestModel.findOne({
            userID: userId,
            "follower.userID": targetUserId
        });

        if(!alreadyFollower){
            return {
                status: "failed",
                message : "user not found"
            }
        }


        // Update User A (Current User accepting request)
        await FriendRequestModel.findOneAndUpdate(
          { userID: userId },
          {
              $pull: { follower: { userID: { $eq: targetUserId } } },
              $addToSet: { followed: { userID: targetUserId } }  // Add to followed
          },
          { upsert: true, new: true }
        );

        // Update User B (Target User whose request is accepted)
        await FriendRequestModel.findOneAndUpdate(
          { userID: targetUserId },
          {
              $pull: { following: { userID: { $eq: userId } } },
              $addToSet: { followed: { userID: userId } }  // Add to followed
          },
          { upsert: true, new: true }
        );

        return {
            status: "success",
            message: "Friend request accepted successfully."
        };
    } catch (err) {
        return {
            status: "failed",
            message: "Accept request failed.",
            error: err.toString()
        };
    }
};

export const UnfollowService = async (req) => {
    try {
        const userId = req.headers.user_id;
        const { targetUserId } = req.body;

        if (userId === targetUserId) {
            return {
                status: "failed",
                message: "You cannot unfollow yourself.",
            };
        }

        // Remove the user from the target user's follower & followed lists
        const updatedTargetUser = await FriendRequestModel.findOneAndUpdate(
          { userID: targetUserId },
          {
              $pull: {
                  following:{userID : userId},
                  follower: { userID: userId },
                  followed: { userID: userId } // 🛠 Fix: remove user from `followed`
              }
          },
          { new: true }
        );

        // Remove the target user from the current user's following & followed lists
        const updatedCurrentUser = await FriendRequestModel.findOneAndUpdate(
          { userID: userId },
          {
              $pull: {
                  following: { userID: targetUserId },
                  follower: { userID: targetUserId },
                  followed: { userID: targetUserId }
              }
          },
          { new: true }
        );

        if (!updatedTargetUser || !updatedCurrentUser) {
            return {
                status: "failed",
                message: "User not found.",
            };
        }

        return {
            status: "success",
            message: "unfriend the user Successfully.",
        };
    } catch (error) {
        return {
            status: "failed",
            message: "Unfriend failed",
            error: error.toString(),
        };
    }
};



export const GetFollowerService = async (req) => {
    try{
        const user_id = new ObjectId(req.params.id)
        const MatchStage =  {$match: {userID: user_id}}

        const JoinWithFollowerStage = {
            $lookup: {
                from: "users",
                localField: "follower.userID",
                foreignField: "_id",
                as: "user"
            }
        }
        const JoinWithProfileStage = {
            $lookup: {
                from: "userprofiles",
                localField: "user._id",
                foreignField: "userID",
                as: "profile"
            }
        }

        const UnwindFollowerStage={
            $unwind: "$user"
        }

        const UnwindProfileStage = {
            $unwind: {
                path: "$profile",
                preserveNullAndEmptyArrays: true
            }
        };


        const projectionStage = {
            $project: {
                "followed":0,
                "follower":0,
                "following":0,
                "createdAt":0,
                "updatedAt":0,
                "user.password": 0,
                "user.email":0,
                "user.gender":0,
                "user.createdAt":0,
                "user.updatedAt":0,

                "profile.bio":0,
                "profile.location":0,
                "profile.coverPicture":0,
                "profile.createdAt":0,
                "profile.updatedAt":0,
            }
        }

        const getFollower = await FriendRequestModel.aggregate([
            MatchStage,
            JoinWithFollowerStage,
            UnwindFollowerStage,
            JoinWithProfileStage,
            UnwindProfileStage,
            projectionStage,
        ])

        return{
            status: "success",
            message : "get follower successfully",
            data: getFollower
        }
    }
    catch (error) {
        return {
            status: "failed",
            message: "failed get followers ",
            error: error.toString()
        }
    }
}


export const GetFollowingService = async (req) => {
    try{
        const user_id = new ObjectId(req.params.id)

        const MatchStage =  {$match: {userID: user_id}}

        const JoinWithUserStage = {
            $lookup:{
                from: "users",
                localField: "following.userID",
                foreignField: "_id",
                as: "user"
            }
        }
        const UnwindUserStage = {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
            }
        };

        const JoinWithUserProfileStage = {
            $lookup:{
                from: "userprofiles",
                localField: "user._id",
                foreignField: "userID",
                as: "profile"
            }
        }
        const UnwindProfileStage = {
            $unwind: {
                path: "$profile",
                preserveNullAndEmptyArrays: true
            }
        };

        const projectionStage = {
            $project: {
                "follower":0,
                "followed":0,
                "following":0,
                "createdAt":0,
                "updatedAt":0,
                "user.password": 0,
                "user.email":0,
                "user.gender":0,
                "user.createdAt":0,
                "user.updatedAt":0,
                "profile.bio":0,
                "profile.location":0,
                "profile.coverPicture":0,
                "profile.createdAt":0,
                "profile.updatedAt":0,
            }
        }


        const getFollower = await FriendRequestModel.aggregate([
            MatchStage,
            JoinWithUserStage,
            UnwindUserStage,
            JoinWithUserProfileStage,
            UnwindProfileStage,
            projectionStage
        ])
        return{
            status: "success",
            message : "get follower successfully",
            data: getFollower
        }
    }
    catch (error) {
        return {
            status: "failed",
            message: "failed get followers ",
            error: error.toString()
        }
    }
}


export const GetMutualFollowService = async (req) => {
    try{
        const user_id = new ObjectId(req.params.id)

        const MatchStage =  {$match: {userID: user_id}}

        const JoinWithUserStage = {
            $lookup:{
                from: "users",
                localField: "followed.userID",
                foreignField: "_id",
                as: "user"
            }
        }
        const UnwindUserStage = {$unwind: "$user"}


        const JoinWithUserProfileStage = {
            $lookup:{
                from: "userprofiles",
                localField: "user._id",
                foreignField: "userID",
                as: "profile"
            }
        }

        const projectionStage = {
            $project: {
                "followed":0,
                "follower":0,
                "following":0,

                "createdAt":0,
                "updatedAt":0,
                "user.password": 0,
                "user.email":0,
                "user.gender":0,
                "user.createdAt":0,
                "user.updatedAt":0,

                "profile.bio":0,
                "profile.location":0,
                "profile.coverPicture":0,
                "profile.createdAt":0,
                "profile.updatedAt":0,
            }
        }


        const getFollower = await FriendRequestModel.aggregate([
            MatchStage,
            JoinWithUserStage,
            UnwindUserStage,
            JoinWithUserProfileStage,
            projectionStage
        ])
        return{
            status: "success",
            message : "get follower successfully",
            data: getFollower
        }
    }
    catch (error) {
        return {
            status: "failed",
            message: "failed get followers ",
            error: error.toString()
        }
    }
}

// AI-like search service
export const SearchFriendRequestService = async (req) => {
    try {
        const user_id = req.headers.user_id
        const { searchKeyword } = req.body;

        const searchUser = await UserModel.aggregate([
            {
                $match: {
                    $or: [
                        {username: {$regex: searchKeyword, $options: "i"}},
                        {fullName: {$regex: searchKeyword, $options: "i"}},
                    ]
                }
            },
            {
                $lookup: {
                    from: "friends",
                    localField: "_id",
                    foreignField: "userID",
                    as: "user"
                }
            },
            {$unwind: "$user"},
            {
                $project: {
                    "password":0,
                    "email" : 0,
                }
            }
        ])


        return {
            status: "success",
            message: "Search completed successfully",
            data: searchUser
        };
    } catch (error) {
        return {
            status: "failed",
            message: "Failed to search users",
            error: error.message
        };
    }
};






