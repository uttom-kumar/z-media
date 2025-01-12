import {FriendRequestModel} from "../models/FriendRequestModel.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const FriendRequestSentService = async (req, res) =>{
    try {
        let { requesterId, recipientId } = req.body

        // Check if a request already exists
        let existingRequest = await FriendRequestModel.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId },
            ],
        });

        if (existingRequest) {
            return {
                status: "failed",
                message: 'Friend request already exists.'
            }
        }

        let newRequest = new FriendRequestModel({
            requester: requesterId,
            recipient: recipientId,
        });

        await newRequest.save();
        return {
            status: "success",
            message : "Friend request sent.",
            data : newRequest
        }
    }
    catch (error) {
        return{
            status: "failed",
            message : "Internal Server Error",
            error: error.toString()
        }
    }
}


export const FriendRequestAcceptService = async (req) => {
    try {
        const { requesterId, recipientId } = req.body;

        const request = await FriendRequestModel.findOne({
            requester: requesterId,
            recipient: recipientId,
            status: 'pending',
        });

        if (!request) {
            return {
                status: "failed",
                message: 'Friend request not found.'
            }
        }

        request.status = 'accepted';
        await request.save();

        return {
            status: "success",
            message: 'Friend request accepted.',
            data: request
        }
    } catch (error) {
        return {
            status: "failed",
            message: 'Internal server error.',
            error : error.toString()
        }
    }
}


export const UnFriendRequestService = async (req) => {
    try {
        const { requesterId, recipientId } = req.body;

        const friendship = await FriendRequestModel.findOneAndDelete({
            $or: [
                { requester: requesterId, recipient: recipientId, status: ['pending', 'accepted']},
                { requester: recipientId, recipient: requesterId, status: ['pending', 'accepted'] },
            ],
        });

        if (!friendship) {
            return { message: 'Friendship not found.' }
        }

        return {
            status: "success",
            message: 'Unfriended successfully.',
            data: friendship
        }
    } catch (error) {
        return {
            status: "failed",
            message: 'Internal server error.',
            error : error.toString()
        }
    }
}


export const FriendDetailService = async (req) => {
    try {
        let  userId  =new ObjectId(req.headers.user_id)

        let MatchStage = {
            $match : {
                $or: [
                    { requester: userId },
                    { recipient: userId }
                ]
            }
        }
        let JoinWithRequesterStage = {
            $lookup : {
                from : "users",
                localField: "requester",
                foreignField: "_id",
                as: "requesterDetails"
            }
        }
        let JoinWithRecipientStage = {
            $lookup : {
                from : "users",
                localField: "recipient",
                foreignField: "_id",
                as: "recipientDetails"
            }
        }
        let JoinWithRequesterProfileStage = {
            $lookup : {
                from : "userprofiles",
                localField: "requester",
                foreignField: "userID",
                as: "requesterProfile"
            }
        }
        let JoinWithRecipientProfileStage = {
            $lookup : {
                from : "userprofiles",
                localField: "recipient",
                foreignField: "userID",
                as: "recipientProfile"
            }
        }

        let unwindRequesterStage = {$unwind: "$requesterDetails"}
        let unwindRecipientStage = {$unwind: "$recipientDetails"}
        let unwindRequesterProfileStage = {$unwind: "$requesterProfile"}
        let unwindRecipientProfileStage = {$unwind: "$recipientProfile"}


        let projectionStage = {
            $project: {
                "requesterDetails.password" : 0,
                "requesterDetails.email" : 0,
                "requesterDetails.gender" : 0,
                "recipientDetails.password" : 0,
                "recipientDetails.email" : 0,
                "recipientDetails.gender" : 0,
                "requesterProfile.bio": 0,
                "requesterProfile.coverPicture": 0,
                "requesterProfile.location": 0,
                "requesterProfile.createdAt": 0,
                "requesterProfile.updatedAt": 0,

                "recipientProfile.bio": 0,
                "recipientProfile.coverPicture": 0,
                "recipientProfile.location": 0,
                "recipientProfile.createdAt": 0,
                "recipientProfile.updatedAt": 0,

            }
        }

        let data = await FriendRequestModel.aggregate([
            MatchStage,
            JoinWithRequesterStage,
            JoinWithRecipientStage,
            unwindRequesterStage,
            unwindRecipientStage,
            JoinWithRequesterProfileStage,
            JoinWithRecipientProfileStage,
            unwindRequesterProfileStage,
            unwindRecipientProfileStage,
            projectionStage,
        ])


        if(!data){
            return {
                status: "failed",
                message: 'No friendship found.'
            }
        }


        return {
            success: "success",
            message: "",
            data: data
        };

    } catch (error) {
        return {
            success: "failed",
            message: 'Error fetching friend details.',
            error: error.message };
    }
}


export const SearchFriendRequestService = async (req) => {
    try {
        const { searchFriend } = req.body;


        if (typeof searchFriend !== "string" || searchFriend.trim() === "") {
            return {
                status: "failed",
                message: "Keyword must be a non-empty string"
            };
        }


        const searchRegex = { "$regex": searchFriend, "$options": "i" };


        const MatchStage = {
            $match: {
                status: {$in : ['pending', 'accepted']}
            }
        };

        const LookupRequesterStage = {
            $lookup: {
                from: "users",
                localField: "requester",
                foreignField: "_id",
                as: "requesterDetails"
            }
        };

        const LookupRecipientStage = {
            $lookup: {
                from: "users",
                localField: "recipient",
                foreignField: "_id",
                as: "recipientDetails"
            }
        };

        const UnwindRequesterStage = {
            $unwind: "$requesterDetails"
        };

        const UnwindRecipientStage = {
            $unwind:  "$recipientDetails"
        };

        const SearchFilterStage = {
            $match: {
                $or: [
                    { "requesterDetails.fullName": searchRegex },
                    { "requesterDetails.username": searchRegex },
                    { "recipientDetails.fullName": searchRegex },
                    { "recipientDetails.username": searchRegex }
                ]
            }
        };

        const ProjectionStage = {
            $project: {
                _id: 1,
                status: 1,
                "requesterDetails.fullName": 1,
                "requesterDetails.username": 1,
                "recipientDetails.fullName": 1,
                "recipientDetails.username": 1
            }
        };

        // Execute aggregation pipeline
        const data = await FriendRequestModel.aggregate([
            MatchStage,
            LookupRequesterStage,
            LookupRecipientStage,
            UnwindRequesterStage,
            UnwindRecipientStage,
            SearchFilterStage,
            ProjectionStage
        ]);

        // Return success response
        return {
            status: "success",
            message: "Search completed successfully",
            data
        };
    } catch (error) {
        // Handle errors
        return {
            status: "failed",
            message: "Failed to search friend requests",
            error: error.toString()
        };
    }
};
