import {UserModel} from "../models/UserModel.js";
import {EncodedToken} from "../utility/TokenUtility.js";
import mongoose from "mongoose";
import {UserProfileModel} from "../models/UserProfileModel.js";
const ObjectId = mongoose.Types.ObjectId;
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import {FriendRequestModel} from "../models/FriendRequestModel.js";
dotenv.config();
import bcrypt from 'bcryptjs';
import {EmailSend} from "../utility/EmailUtility.js";

const {CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY,  CLOUDINARY_API_SECRET, JWT_EXPIRE_TIME} = process.env


// Configure Cloudinary
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});




export const RegisterService = async (req) => {
    try{
        let reqBody = req.body
        let user = await UserModel.findOne({email : reqBody.email})

        if(user){
            return {
                status : "failed",
                message : "Email already exists"
            }
        }

        if(reqBody.password.length < 8){
            return {
                status : "failed",
                message : "Password must be at least 8 characters"
            }
        }

        let existingUsername = await UserModel.findOne({ username: reqBody.username });
        if (existingUsername) {
            return {
                status: "failed",
                message: "Username already taken",
            };
        }

        // Hash the user's password
        const salt = await bcrypt.genSalt(10);  // Generate salt with a strength of 10
        const hashedPassword = await bcrypt.hash(reqBody.password, salt); // Hash the password

        // Update the password in reqBody with the hashed one
        reqBody.password = hashedPassword;
       
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
            message : "some thing went wrong" ,
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
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return {
                status: "failed",
                message: "Incorrect password",
            };
        }

        let token = EncodedToken( user['email'], user['_id'])

        let options = {
            maxAge: JWT_EXPIRE_TIME,
            httpOnly: false,
            sameSite: "None",
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

export const UpdateProfileService = async (req) => {
    try {
        let user_id = req.headers.user_id;
        let reqBody = req.body;
        reqBody.userID = user_id;

        const file = req.files?.image;

        // Fields to be updated in the `UserModel`
        const userFields = {
            ...(reqBody.fullName && { fullName: reqBody.fullName }),
            ...(reqBody.phone && { phone: reqBody.phone }),
            ...(reqBody.username && { username: reqBody.username }),
            ...(reqBody.gender && { gender: reqBody.gender }),
            ...(reqBody.password && { password: reqBody.password }),
        };

        // Fields to be updated in the `UserProfileModel`
        const profileFields = {
            ...(reqBody.profilePicture && { profilePicture: reqBody.profilePicture }),
            ...(reqBody.coverPicture && { coverPicture: reqBody.coverPicture }),
            ...(reqBody.bio && { bio: reqBody.bio }),
            ...(reqBody.address && { address: reqBody.address }),
            ...(reqBody.profession && { profession: reqBody.profession }),
            ...(reqBody.location && { location: reqBody.location }),
        };

        // আগের প্রোফাইল তথ্য খুঁজে বের করা
        let profileImage = await UserProfileModel.findOne({ userID: user_id });

        // যদি নতুন ছবি আসে, তাহলে আপলোড করো
        if (file) {
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                  { folder: "user_photo" },
                  (error, result) => {
                      if (error) reject(error);
                      else resolve(result);
                  }
                ).end(file.data);
            });

            profileFields.profilePicture = uploadResult.secure_url; // নতুন ছবি সেট করো

            // যদি আগের `profilePicture` থাকে, তাহলে সেটা Cloudinary থেকে ডিলিট করো
            if (profileImage && profileImage.profilePicture) {
                const publicId = profileImage.profilePicture.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`user_photo/${publicId}`);
            }
        }

        // ইউজার তথ্য আপডেট করা
        const userUpdateResult = await UserModel.updateOne(
          { _id: user_id },
          { $set: userFields }
        );

        // প্রোফাইল তথ্য আপডেট করা
        const profileUpdateResult = await UserProfileModel.updateOne(
          { userID: user_id },
          { $set: profileFields },
          { upsert: true } // প্রোফাইল না থাকলে নতুন প্রোফাইল তৈরি করবে
        );

        if (userUpdateResult.nModified === 0 && profileUpdateResult.nModified === 0) {
            return {
                status: "failed",
                message: "No changes were made to the profile.",
            };
        }

        return {
            status: "success",
            message: "Profile updated successfully.",
            userUpdateResult,
            profileUpdateResult,
        };
    } catch (err) {
        return {
            status: "failed",
            message: "Profile Update Failed",
            error: err.toString(),
        };
    }
};


export const ReadProfileService = async (req) => {
    try{
        let user_id = new ObjectId(req.headers.user_id)

        let MatchStage = {
            $match : {
                _id : user_id
            }
        }
        let joinWithProfileStage = {
            $lookup : {
                from : "userprofiles",
                localField: "_id",
                foreignField: "userID",
                as : "profile"
            }
        }
        let JoinWithFollowStage ={
              $lookup : {
                  from : "friends",
                  localField: "_id",
                  foreignField: "userID",
                  as: "follow"
              }
        }

        let projectionStage = {
            $project: {
                'password':0,
            }
        }
        let data = await UserModel.aggregate([
            MatchStage,
            joinWithProfileStage,
            JoinWithFollowStage,
            projectionStage,
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

export const DeleteProfileService = async (req) => {
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


export const SingleProfileDetailsService = async (req) => {
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
        const AddProfileFieldStage = {
            $addFields: {
                profile: { $arrayElemAt: ["$profile", 0] },
            },
        };

        // Merge the profile fields into the root document
        let ReplaceRootStage = {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: ["$profile", "$$ROOT"]
                }
            }
        };


        let projectionStage = {
            $project: {
                "password" : 0,
                "profile.updatedAt": 0,
                "profile.createdAt": 0,
                "profile.userID": 0,
                "profile._id": 0,
            }
        }

        let data = await UserModel.aggregate([
            MatchStage,
            JoinWithProfileStage,
            AddProfileFieldStage,
            projectionStage,
            ReplaceRootStage
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



export const singleProfileReadService = async (req) => {
    try{
        let user_id = new ObjectId(req.params.user_id)

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
        const JoinWithFriendsStage = {
            $lookup: {
                from: "friends",
                localField: "_id",
                foreignField: "userID",
                as: "friend"
            }
        }

        const UnwindFriendsStage = {
            $unwind: {
                path: "$friend",
                preserveNullAndEmptyArrays: true
            }
        };


        let projectionStage = {
            $project: {
                "password" : 0,
                "profile.createdAt":0,
                "profile.updatedAt":0,
            }
        }

        let data = await UserModel.aggregate([
            MatchStage,
            JoinWithProfileStage,
            JoinWithFriendsStage,
            UnwindFriendsStage,
            projectionStage,
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


export const seeAllUserService = async (req) => {
    try {
        let user_id = new mongoose.Types.ObjectId(req.headers.user_id);

        // Step 1: Find the logged-in user's friend relationships
        const friendData = await FriendRequestModel.findOne({ userID: user_id });

        let excludedUserIds = new Set();
        excludedUserIds.add(user_id.toString()); // Exclude the logged-in user

        if (friendData) {
            // Collect all user IDs from follower, following, and followed lists
            for (let f of friendData.follower) excludedUserIds.add(f.userID.toString());
            for (let f of friendData.following) excludedUserIds.add(f.userID.toString());
            for (let f of friendData.followed) excludedUserIds.add(f.userID.toString());
        }

        // Convert Set to an array
        const excludedUserIdsArray = Array.from(excludedUserIds).map(id => new mongoose.Types.ObjectId(id));

        // Step 2: Exclude users who are in follower, following, or followed lists
        const filterOutUsersStage = {
            $match: { _id: { $nin: excludedUserIdsArray } }
        };

        // Step 3: Join user data with user profiles
        const JoinWithUserStage = {
            $lookup: {
                from: "userprofiles",
                localField: "_id",
                foreignField: "userID",
                as: "profile"
            }
        };
        const UnwindProfileStage = {
            $unwind: {
                path: "$profile",
                preserveNullAndEmptyArrays: true
            }
        };

        // Step 4: Exclude sensitive fields
        const projectionStage = {
            $project: {
                "gender": 0,
                "email": 0,
                "createdAt": 0,
                "updatedAt": 0,
                "password": 0,
                "profile.bio":0,
                "profile.coverPicture":0,
                "profile.location":0,
                "profile.createdAt":0,
                "profile.updatedAt":0,
            }
        };

        // Step 5: Execute Aggregation Pipeline
        let data = await UserModel.aggregate([
            filterOutUsersStage,
            JoinWithUserStage,
            UnwindProfileStage,
            projectionStage
        ]);

        return {
            status: "success",
            message: "Filtered users fetched successfully",
            data: data
        };
    }
    catch (err) {
        return {
            status: "failed",
            message: "Error fetching users",
            error: err.toString()
        };
    }
}


export const RecoverEmailVerifyService = async (req) => {
    try{
        let email = req.params.email;
        let user = await UserModel.aggregate([
            {$match :  {email : email}},
            {$count : "total"}
        ])


        let code = Math.floor(100000+Math.random()*900000)
        let EmailTo = email
        let EmailText = `${code}`
        let EmailSubject = "Email Verification Code"


        if(user[0]?.total === 1) {
            await EmailSend (EmailTo, EmailText, EmailSubject)
            await UserModel.updateOne({email:email},{$set:{otp: code}},{upsert:true})
            return {
                status : "success",
                message : "6 digits Code Send Successfully"
            }
        }
        else{
            return {
                status : "failed",
                message : "User Not Found",
            }
        }
    }
    catch(err) {
        return {
            status : "failed",
            message : "Email Verification Code Failed",
            error : err.toString()
        }
    }
}

export const RecoverVerifyOtpService = async (req) => {
    try{
        let {email, otp} = req.body
        otp = parseInt(otp)

        let OtpCount = await UserModel.aggregate([
            {$match :  {email : email}},
            {$count : "total"}
        ])

        if(OtpCount[0].total === 1) {
            let OtpUpdate = await UserModel.updateOne(
              {
                  email : email,
                  otp : otp,
              },
              {
                  otp : otp,
              }
            )
            return {
                status : "success",
                message : "OTP verification Code Successfully",
                data : OtpUpdate
            }
        }
        else {
            return {
                status: false,
                message: "Invalid OTP Code"
            };
        }
    }

    catch (err){
        return{
            status : "failed",
            message : "Invalid OTP Code. Please Try again",
            error : err.toString()
        }
    }
}

export const ResetPasswordService = async (req) => {
    try{
        let reqBody = req.body
        let {email ,otp} = reqBody


        let OtpUsedCount = await UserModel.aggregate([
            {$match :  {email, otp}},
            {$count : "total"}
        ])

        // Hash the user's password
        const salt = await bcrypt.genSalt(10);  // Generate salt with a strength of 10
        const hashedPassword = await bcrypt.hash(reqBody.password, salt); // Hash the password

        if(OtpUsedCount[0]?.total === 1){
            //update password
            let passUpdate = await UserModel.updateOne(
              {
                  email : email,
                  otp : otp
              },
              {
                  otp : null,
                  password: hashedPassword
              }
            )
            return {
                status : "success",
                message : "Password changed Successfully",
                data : passUpdate
            }
        }
        else {
            return {
                status : "failed",
                message : "password does not change!"
            }
        }
    }
    catch (err){
        return {
            status : "failed",
            message : "Something went wrong",
            error : err.toString()
        }
    }
}



