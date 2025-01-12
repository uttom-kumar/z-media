import {UserModel} from "../models/UserModel.js";
import {EncodedToken} from "../utility/TokenUtility.js";
import mongoose from "mongoose";
import {UserProfileModel} from "../models/UserProfileModel.js";
const ObjectId = mongoose.Types.ObjectId;


export const RegisterService = async (req, res) => {
    try{
        let reqBody = req.body
        let user = await UserModel.findOne({email : reqBody.email})

        if(user){
            return {
                status : "failed",
                message : "Email already exists"
            }
        }
       
        const data = await UserModel.create(reqBody)
        return {
            status : "success",
            message : "User registration successfully!",
            data: data
        }
      
    }
    catch (err) {
        return {
            status : "failed",
            message : "",
            error : err.toString()
        }
    }
}

export const LoginService = async (req,res) => {
    try{
        let {email,password} = req.body
        let user = await UserModel.findOne({
            $or : [{email : email}, {username: email}]
        })

        if (!user) {
            return{
                status: "failed",
                message: "User not found",
            }
        }
        if (user['password'] !== password) {
            return {
                status: "failed",
                message: "password does not match",
            };
        }

        let token = EncodedToken( user['email'], user['_id'])
        let options = {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "none",
            secure: true,
        };
        res.cookie("token", token, options)

        return{
            status : "success",
            message : "Login Successfully",
            token : token
        }

    }
    catch (err){
        return{
            status: "failed",
            message: "service login failed",
            error: err.toString()
        }
    }
}

export const UpdateProfileService = async (req, res) => {
    try{
        let user_id = req.headers.user_id
        let reqBody = req.body
        reqBody.userID = user_id

        const userFields = {
            fullName: reqBody.fullName,
            gender: reqBody.gender,
            password: reqBody.password
        };

        const profileFields = {
            profilePicture: reqBody.profilePicture,
            coverPicture: reqBody.coverPicture,
            bio: reqBody.bio,
            location: reqBody.location,
        };


        const userUpdateResult = await UserModel.updateOne(
            { _id: user_id },
            { $set: userFields }
        );

        let profileUpdateResult  = await UserProfileModel.updateOne(
            {userID: user_id},
            {$set:profileFields},
            {upsert:true}
        )
        return {
            status : "success",
            message : "Profile Updated Successfully",
            userUpdateResult,
            profileUpdateResult
        }
    }
    catch (err){
        return {
            status : "failed",
            message : "Profile Update Failed",
            error : err.toString()
        }
    }
}

export const ReadProfileService = async (req, res) => {
    try{
        let user_id = new ObjectId(req.headers.user_id)

        let MatchStage = {
            $match : {
                userID : user_id
            }
        }
        let joinWithUserStage = {
            $lookup : {
                from : "users",
                localField: "userID",
                foreignField: "_id",
                as : "user"
            }
        }
        let unwindUser = {$unwind : "$user"}

        let data = await UserProfileModel.aggregate([
            MatchStage,
            joinWithUserStage,
            unwindUser
        ])

        return{
            status : "success",
            message : "Profile Read Successfully",
            data : data
        }
    }
    catch (err){
        return {
            status : "failed",
            message : "Profile Update Failed",
            error : err.toString()
        }
    }
}

export const LogOutProfileService = async (req, res) => {
    try{
        res.clearCookie("token")
        return {
            status : "success",
            message : "Logged Out Successfully",
        }
    }
    catch (err){
        return {
            status : "failed",
            message : "Failed to Logout",
            error : err.toString()
        }
    }
}

export const DeleteProfileService = async (req, res) => {
    try{
        let userID = req.headers.user_id
        await UserModel.deleteOne({_id: userID})
        return {
            status : "success",
            message : "Profile Deleted Successfully"
        }
    }
    catch (err){
        return {
            status : "failed",
            message : "Profile Delete Failed",
            error : err.toString()
        }
    }
}


export const ProfileAllDetailsService = async (req) => {
    try{
        let user_id = new ObjectId(req.headers.user_id)

        let MatchStage = {
            $match : {
                _id : user_id
            }
        }
        let JoinWithProfileStage = {
            $lookup: {
                from: "userprofiles",
                localField: "_id",
                foreignField: "userID",
                as: "profile"
            }
        }
        let JoinWithBlogPostStage = {
            $lookup : {
                from : "blogposts",
                localField: "_id",
                foreignField: "userID",
                as: "blogpost"
            }
        }
        let JoinWithReactionStage = {
            $lookup: {
                from: "reacts",
                localField: "blogpost._id",
                foreignField: "blogID",
                as: "react"
            }
        };
        let JoinWithCommentStage = {
            $lookup : {
                from : "comments",
                localField: "blogpost._id",
                foreignField: "blogID",
                as: "comment"
            }
        }

        let unwindProfileStage = {$unwind: "$profile"}
        let unwindBlogPostStage = {$unwind: "$blogpost"}
        let unwindReactionStage = {$unwind: "$react"}
        let unwindCommentStage = {$unwind: "$comment"}

        let projectionStage = {
            $project: {
                "password" : 0,
                "email" : 0,
                "profile.createdAt":0,
                "profile.updatedAt":0,
            }
        }

        let data = await UserModel.aggregate([
            MatchStage,
            JoinWithProfileStage,
            unwindProfileStage,
            projectionStage,
            JoinWithBlogPostStage,
            unwindBlogPostStage,
            JoinWithReactionStage,
            unwindReactionStage,
            JoinWithCommentStage,
            unwindCommentStage
        ])

        return {
            status: "success",
            message : "Profile details successfully.",
            data : data
        }
    }
    catch (err){
        return{
            status : "failed",
            message : "failed details",
            error : err.toString()
        }
    }
}