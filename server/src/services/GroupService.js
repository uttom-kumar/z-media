import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import {GroupModel} from "../models/GroupModel.js";
import {GroupPostModel} from "../models/GroupPostModel.js";
import {GroupReactionModel} from "../models/GroupReactionModel.js";
import {GroupCommentModel} from "../models/GroupCommentModel.js";
dotenv.config();
const ObjectId = mongoose.Types.ObjectId;



// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// create group
export const CreateGroupService = async (req) => {
  try {
    const userId = req.headers.user_id;
    const reqBody = req.body;
    const { GroupName, bio } = reqBody;

    const existingGroup = await GroupModel.findOne({userID: userId, GroupName: GroupName});
    if (existingGroup) {
      return {
        status: "failed",
        message: "Group Name already exists"
      }
    }

    const GroupPhoto = req.files?.groupPhoto;
    let imageUrl = "";

    // If an image file is provided, upload it to Cloudinary
    if (GroupPhoto) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "group_photo" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(GroupPhoto?.data);
      });
      imageUrl = uploadResult.secure_url;
    }


    const GroupResult = await GroupModel.create({
      userID: userId,
      GroupName: GroupName,
      bio: bio,
      GroupPhoto: imageUrl,
    });

    return {
      status: "success",
      message: "Group created successfully",
      GroupResult,
    };
  } catch (err) {
    return {
      status: "failed",
      message: "Failed to create group",
      error: err.toString(),
    };
  }
}

// update group name and image
export const UpdateGroupService = async (req) => {
  try {
    const userId = req.headers.user_id;
    const reqBody = req.body;
    const { GroupName,bio} = reqBody;
    reqBody.userID = userId;

    const GroupPhoto = req.files?.groupPhoto;

    // Fields to be updated and created in the `GroupModel`
    const GroupFields = {
      ...(GroupName && { GroupName: GroupName }),
      ...(bio && { bio: bio }),
    };

    // If an image file is provided, upload it to Cloudinary
    if (GroupPhoto) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "group_photo" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(GroupPhoto?.data);
      });
      GroupFields.GroupPhoto = uploadResult.secure_url;
    }

    // Find the existing group data
    let groupPhoto = await GroupModel.findOne({ userID: userId });

    // Check if `groupPhoto` exists before accessing its properties
    if (groupPhoto && groupPhoto.GroupPhoto) {
      const publicId = groupPhoto.GroupPhoto.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`group_photo/${publicId}`);
    }

    // Update or insert the group data
    const GroupResult = await GroupModel.updateOne(
      { userID: userId },
      { $set: GroupFields },
      { upsert: true } // Create a new group if it doesn't exist
    );

    if (GroupResult.modifiedCount === 0 && GroupResult.upsertedCount === 0) {
      return {
        status: "failed",
        message: "No changes were made to the group.",
      };
    }

    return {
      status: "success",
      message: "Group created successfully",
      GroupResult,
    };
  } catch (err) {
    return {
      status: "failed",
      message: "Failed to create group",
      error: err.toString(),
    };
  }
};


export const ReadGroupService = async (req) => {
  try {
    const user_id = new ObjectId(req.headers.user_id)
    const groupId = new ObjectId(req.params.groupId)

    const MatchStage = {$match: {_id: groupId}};

    const JoinWithUserStage = {
      $lookup: {
        from: "users",
        localField: "userID",
        foreignField: "_id",
        as: "user",
      }
    }

    const JoinWithUserProfileStage = {
      $lookup: {
        from: "userprofiles",
        localField: "userID",
        foreignField: "userID",
        as: "userProfile",
      }
    }


    const JoinWithPostStage = {
      $lookup: {
        from: "groupposts",
        localField: "_id",
        foreignField: "groupID",
        as: "GroupPost",
      }
    }

    const JoinWithGroupPostUserStage = {
      $lookup: {
        from: "users",
        localField: "GroupPost.userID",
        foreignField: "_id",
        as: "GroupPostByUser",
      }
    }

    const JoinWithGroupPostByUserProfileStage = {
      $lookup: {
        from: "userprofiles",
        localField: "GroupPost.userID",
        foreignField: "userID",
        as: "GroupPostByUserProfile",
      }
    }

    const JoinWithGroupReactionStage = {
      $lookup: {
        from: "groupreactions",
        localField: "GroupPost._id",
        foreignField: "postID",
        as: "GroupPostReaction",
      }
    }

    const JoinWithReactionUserStage = {
      $lookup: {
        from: "users",
        localField: "GroupPostReaction.likeList.userID",
        foreignField: "_id",
        as: "PostReactionUser",
      }
    }


    const JoinWithCommentStage = {
      $lookup: {
        from: "groupcomments",
        localField: "GroupPost._id",
        foreignField: "postID",
        as: "comment",
      }
    }

    const JoinWithCommentUserStage = {
      $lookup: {
        from: "users",
        localField: "comment.userID",
        foreignField: "_id",
        as: "commentUser",
      }
    }

    const JoinWithCommentUserProfileStage = {
      $lookup: {
        from: "userprofiles",
        localField: "comment.userID",
        foreignField: "userID",
        as: "commentUserProfile",
      }
    }

    const JoinWithCommentReplyUserStage = {
      $lookup: {
        from: "users",
        localField: "comment.replies.userID",
        foreignField: "_id",
        as: "commentReplyUser",
      }
    }

    const JoinWithCommentReplyUserProfileStage = {
      $lookup: {
        from: "userprofiles",
        localField: "comment.replies.userID",
        foreignField: "userID",
        as: "commentReplyUserProfile",
      }
    }



    const UnwindUserStage = {$unwind: "$user"}
    const UnwindUserProfileStage = {$unwind: {path: "$userProfile", preserveNullAndEmptyArrays: true}}
    const UnwindCommentUserStage = {$unwind: {path: "$commentUser", preserveNullAndEmptyArrays: true}}
    const UnwindCommentUserProfileStage = {$unwind: {path: "$commentUserProfile", preserveNullAndEmptyArrays: true}}
    const UnwindCommentReplyUserStage = {$unwind: {path: "$commentReplyUser", preserveNullAndEmptyArrays: true}}
    const UnwindCommentReplyUserProfileStage = {$unwind: {path: "$commentReplyUserProfile", preserveNullAndEmptyArrays: true}}

    const projectionStage = {
      $project:{
        "user.username": 0,
        "user.phone": 0,
        "user.email": 0,
        "user.gender": 0,
        "user.password": 0,
        "user.otp": 0,
        "user.createdAt": 0,
        "user.updatedAt": 0,

        "userProfile._id": 0,
        "userProfile.userID": 0,
        "userProfile.address": 0,
        "userProfile.bio": 0,
        "userProfile.coverPicture": 0,
        "userProfile.location": 0,
        "userProfile.profession": 0,
        "userProfile.createdAt": 0,
        "userProfile.updatedAt": 0,


        "GroupPostByUser.username": 0,
        "GroupPostByUser.phone": 0,
        "GroupPostByUser.email": 0,
        "GroupPostByUser.gender": 0,
        "GroupPostByUser.password": 0,
        "GroupPostByUser.otp": 0,
        "GroupPostByUser.createdAt": 0,
        "GroupPostByUser.updatedAt": 0,

        "GroupPostByUserProfile._id": 0,
        "GroupPostByUserProfile.userID": 0,
        "GroupPostByUserProfile.address": 0,
        "GroupPostByUserProfile.bio": 0,
        "GroupPostByUserProfile.coverPicture": 0,
        "GroupPostByUserProfile.location": 0,
        "GroupPostByUserProfile.profession": 0,
        "GroupPostByUserProfile.createdAt": 0,
        "GroupPostByUserProfile.updatedAt": 0,

        "PostReactionUser._id": 0,
        "PostReactionUser.username": 0,
        "PostReactionUser.phone": 0,
        "PostReactionUser.email": 0,
        "PostReactionUser.gender": 0,
        "PostReactionUser.password": 0,
        "PostReactionUser.otp": 0,
        "PostReactionUser.createdAt": 0,
        "PostReactionUser.updatedAt": 0,
      }
    }

    const CommentProjectionStage = {
      $project:{
        "commentUser._id": 0,
        "commentUser.username": 0,
        "commentUser.phone": 0,
        "commentUser.email": 0,
        "commentUser.gender": 0,
        "commentUser.password": 0,
        "commentUser.otp": 0,
        "commentUser.createdAt": 0,
        "commentUser.updatedAt": 0,


        "commentUserProfile._id": 0,
        "commentUserProfile.userID": 0,
        "commentUserProfile.address": 0,
        "commentUserProfile.bio": 0,
        "commentUserProfile.coverPicture": 0,
        "commentUserProfile.location": 0,
        "commentUserProfile.profession": 0,
        "commentUserProfile.createdAt": 0,
        "commentUserProfile.updatedAt": 0,
      }
    }

    const CommentReplyProjectionStage = {
      $project:{
        "commentReplyUser._id": 0,
        "commentReplyUser.username": 0,
        "commentReplyUser.phone": 0,
        "commentReplyUser.email": 0,
        "commentReplyUser.gender": 0,
        "commentReplyUser.password": 0,
        "commentReplyUser.otp": 0,
        "commentReplyUser.createdAt": 0,
        "commentReplyUser.updatedAt": 0,


        "commentReplyUserProfile._id": 0,
        "commentReplyUserProfile.userID": 0,
        "commentReplyUserProfile.address": 0,
        "commentReplyUserProfile.bio": 0,
        "commentReplyUserProfile.coverPicture": 0,
        "commentReplyUserProfile.location": 0,
        "commentReplyUserProfile.profession": 0,
        "commentReplyUserProfile.createdAt": 0,
        "commentReplyUserProfile.updatedAt": 0,
      }
    }

    const data = await GroupModel.aggregate([
      MatchStage,
      JoinWithUserStage,
      JoinWithUserProfileStage,
      JoinWithPostStage,
      JoinWithGroupPostUserStage,
      JoinWithGroupPostByUserProfileStage,
      JoinWithGroupReactionStage,
      JoinWithReactionUserStage,
      //
      JoinWithCommentStage,
      JoinWithCommentUserStage,
      JoinWithCommentUserProfileStage,
      UnwindCommentUserStage,
      UnwindCommentUserProfileStage,

      JoinWithCommentReplyUserStage,
      JoinWithCommentReplyUserProfileStage,
      UnwindCommentReplyUserStage,
      UnwindCommentReplyUserProfileStage,

      //
      UnwindUserStage,
      UnwindUserProfileStage,
      projectionStage,
      CommentProjectionStage,
      CommentReplyProjectionStage,
    ])

    return {
      status: "success",
      message: "Group reading successfully",
      data: data
    }
  }
  catch (err) {
    return {
      status: "failed",
      message: "Failed to read group",
      error: err.toString(),
    }
  }
}


export const CreateGroupPostService = async (req) => {
  try{
    const userId = req.headers.user_id
    const groupID = req.params.groupID
    const reqBody = req.body


    const group = await GroupModel.findById({_id:groupID})
    if (!group) {
      return { status: "failed", message: "Group not found" };
    }

    // check admin or author(followers)
    let userRole = "Author"
    // Check if the user is the Admin (Group Creator)
    if (group.userID.toString() === userId) {
      userRole = "Admin";
    } else {
      // Check if the user is a follower with a valid role
      const follower = group.followers.find(
        (f) => f.userID.toString() === userId
      );

      if (!follower) {
        return {
          status: "failed",
          message: "You are not a member of this group",
        };
      }else{
        userRole = follower.role; // Set the role based on follower data
      }
    }

    // // If an image file is provided, upload it to Cloudinary
    const GroupPostPhoto = req.files?.image
    let imageUrl = "";
    if (GroupPostPhoto) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {folder: "group_photo"},
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }).end(GroupPostPhoto?.data)
      })
      imageUrl = uploadResult.secure_url;
    }

    const GroupPostResult = await GroupPostModel.create(
      {
        userID: userId ,
        groupID: groupID,
        role: userRole,
        title: reqBody.title,
        image: imageUrl
      },
    );

    return {
      status: 'success',
      message: 'Post Create successfully',
      GroupPostResult
    }
  }
  catch (err){
    return{
      status: "failed",
      message : "failed to group post",
      error: err.toString()
    }
  }
}


export const UpdateGroupPostService = async (req) => {
  try{
    const userId = req.headers.user_id
    const groupID = req.params.groupID
    const postID = req.params.postID
    const reqBody = req.body


    let updateData = {
      ...(reqBody.title && { title: reqBody.title }),
      ...(reqBody.image && { image: reqBody.image }),
      ...(reqBody.role && { role: reqBody.role }),
    }

    const group = await GroupModel.findById({_id:groupID})
    if (!group) {
      return { status: "failed", message: "Group not found" };
    }


    // check admin or author(followers)
    let userRole = "Author"
    // Check if the user is the Admin (Group Creator)
    if (group.userID.toString() === userId) {
      userRole = "Admin";
    } else {
      // Check if the user is a follower with a valid role
      const follower = group.followers.find(
        (f) => f.userID.toString() === userId
      );

      if (!follower) {
        return {
          status: "failed",
          message: "You are not a member of this group",
        };
      }else{
        userRole = follower.role;
      }
    }

    // // If an image file is provided, upload it to Cloudinary
    const GroupPostPhoto = req.files?.image
    if (GroupPostPhoto) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {folder: "group_photo"},
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }).end(GroupPostPhoto?.data)
      })
      updateData.image = uploadResult.secure_url;
    }

    const GroupPostResult = await GroupPostModel.updateOne(
      {
        userID: userId ,
        groupID: groupID,
        _id : postID
      },
      {$set: updateData},
      {upsert: true}
    );

    return {
      status: 'success',
      message: 'Post update successfully',
      GroupPostResult
    }
  }
  catch (err){
    return{
      status: "failed",
      message : "failed to group post",
      error: err.toString()
    }
  }
}

export const UpdateBySinglePostListService = async (req) => {
  try{
    const user_id = req.headers.user_id
    const groupID = req.params.groupID
    const postID = req.params.postID
    const data = await GroupPostModel.findOne({userID:user_id, groupID:groupID, _id:postID})

    if(!data){
      return {
        status: "failed",
        message : "Post not found"
      }
    }

    return {
      status: "success",
      message: "Post Update successfully",
      data : data
    }
  }
  catch (err){
    return{
      status: "failed",
      message : "failed to read group posts",
      error: err.toString()
    }
  }
}


export const DeleteGroupPostService = async (req) => {
  try{
    const userId = req.headers.user_id
    const groupID = req.params.groupID
    const postID = req.params.postID

    const group = await GroupModel.findById({_id:groupID,userID:userId})
    if (!group) {
      return { status: "failed", message: "Group not found" };
    }

    const post = await GroupPostModel.findById({groupID:groupID, _id:postID, userID:userId})

    if (!post) {
      return { status: "failed", message: "Group Post not found" };
    }

    if (post["image"]) {
      const publicId = post["image"].split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`group_photo/${publicId}`);
    }

    // check this user role
    const userRole = group.followers.find(f => f.userID.toString() === userId)?.role;
    if (userRole === "Admin" || post.userID.toString() === userId) {
      let data = await GroupPostModel.deleteOne({ _id: postID });

      return { status: "success", message: "Post deleted successfully" ,data};
    }

    return {
      status: "failed",
      message: "You are not authorized to delete this post"
    };
  }
  catch(err){
    return{
      status: "failed",
      message : "failed to delete group post",
      error: err.toString()
    }
  }
}


export const GroupPostAddLikeService = async (req) => {
  try {
    const userId = req.headers.user_id;
    const {postID, groupID} = req.params
    const { type } = req.body;

    let Reaction = await GroupReactionModel.findOne({ groupID: groupID, postID: postID });
    let exitGroup = await GroupModel.findOne({ _id: groupID });
    let exitPost = await GroupPostModel.findOne({ _id: postID });

    if(!exitGroup){
      return {
        status: "failed",
        message : "Group not found"
      }
    }

    if(!exitPost){
      return {
        status: "failed",
        message : "Post not found"
      }
    }



    if (!Reaction) {
      Reaction = new GroupReactionModel({
        groupID: groupID,
        postID: postID,
        likeList: [{ userID: userId, type: type }],
      });

      await Reaction.save();
      return {
        status: "success",
        message: "Post liked successfully",
      };
    } else {
      // if user all ready liked this post so update reaction
      const existingReaction = Reaction.likeList.find((item) => item.userID.toString() === userId);

      if (existingReaction) {
        // update reaction
        existingReaction.type = type;
      } else {
        Reaction.likeList.push({ userID: userId, type: type });
      }

      await Reaction.save();
      return {
        status: "success",
        message: "Reaction updated successfully"
      };
    }
  } catch (err) {
    return {
      status: "failed",
      message: "Failed to add like to post",
      error: err.toString(),
    };
  }
}


export const GroupPostRemoveLikeService = async (req) => {
  try {
    const userId = req.headers.user_id;
    const { postID, groupID, reactId } = req.params

    if (!postID || !groupID || !reactId ) {
      return {
        status: "failed",
        message: "Invalid postID, groupID, or reactId",
      };
    }

    const reactionDoc = await GroupReactionModel.findOne({postID, groupID});

    if (!reactionDoc) {
      return {
        status: "failed",
        message: "No reactions found for this post",
      };
    }

    // Check if the reaction exists and belongs to the user
    const reactionExists = reactionDoc.likeList.find(
      (item) => item._id.toString() === reactId && item.userID.toString() === userId
    );

    if (!reactionExists) {
      return {
        status: "failed",
        message: "Reaction not found or does not belong to the user",
      };
    }

    // Remove the specific like reaction
    const updateResult = await GroupReactionModel.findOneAndUpdate(
      { groupID, postID },
      { $pull: { likeList: { _id: reactId, userID: userId } } },
      { new: true }
    );

    // Check if a reaction was actually removed
    if (!updateResult) {
      return {
        status: "failed",
        message: "Reaction not found or already removed",
      };
    }

    return {
      status: "success",
      message: "Post like removed successfully",
    };
  } catch (err) {
    return {
      status: "failed",
      message: "Failed to remove post like",
      error: err.toString(),
    };
  }
};


// group post all comment service

export const GroupCreateCommentService = async (req) => {
  try{
    const userId = req.headers.user_id
    const groupID = req.params.groupID
    const postID = req.params.postID
    let {comment} = req.body


    if(!comment){
      return {
        status: "failed",
        message : "Comment are required",
      }
    }

    const exitGroupPost = await GroupPostModel.findOne({groupID: groupID, _id: postID })
    if(!exitGroupPost) {
      return {
        status: "failed",
        message : "Group Post not found",
      }
    }


    await GroupCommentModel.create({
      groupID: groupID,
      postID: postID,
      userID: userId,
      comment,
    })

    return {
      status: "success",
      message: "Comment created successfully",
    }
  }
  catch(err){
    return {
      status: "failed",
      message: "Failed to add comment",
      error: err.toString(),
    }
  }
}


export const GroupUpdateCommentService = async (req) => {
  try{
    const userId = req.headers.user_id
    const {groupID, postID, commentID} = req.params
    let {comment} = req.body


    if(!comment){
      return {
        status: "failed",
        message : "Comment are required",
      }
    }

    const exitGroup = await GroupCommentModel.findOne({ _id: commentID, groupID: groupID })
    if(!exitGroup) {
      return {
        status: "failed",
        message : "Group not found",
      }
    }

    const exitGroupPost = await GroupCommentModel.findOne({ _id: commentID, postID: postID })
    if(!exitGroupPost) {
      return {
        status: "failed",
        message : "Group post not found",
      }
    }

    const exitComment = await GroupCommentModel.findOne({_id:commentID,groupID:groupID, postID:postID})

    if(!exitComment){
      return {
        status: "failed",
        message : "comment not found",
      }
    }



    const data = await GroupCommentModel.updateOne(
      {
        groupID: groupID,
        postID: postID,
        _id: commentID,
        userID: userId,
      },
      {$set : {comment}}
    )

    return {
      status: "success",
      message: "Comment created successfully",
      data : data
    }
  }
  catch(err){
    return {
      status: "failed",
      message: "Failed to add comment",
      error: err.toString(),
    }
  }
}


export const GroupSingleReadCommentService = async (req) => {
  try{
    const userId = new ObjectId(req.headers.user_id)
    const groupID = new ObjectId(req.params.groupID)
    const  postID = new ObjectId(req.params.postID)
    const commentID = new ObjectId(req.params.commentID)


    let MatchStage = {
      $match: {
        groupID: groupID,
        postID: postID,
        _id: commentID,
        userID: userId,
      }
    }

    const projectionStage = {
      $project: {
        "updatedAt" : 0,
        "createdAt" : 0,
        "replies" : 0,
        "_id" : 0,
        "groupID" : 0,
        "postID" : 0,
        "userID" : 0,
      }
    }

    const data = await GroupCommentModel.aggregate([
      MatchStage,
      projectionStage
    ])

    return {
      status: "success",
      message: "Comment single Read successfully",
      data : data
    }
  }
  catch(err){
    return {
      status: "failed",
      message: "Failed to single Read comment",
      error: err.toString(),
    }
  }
}


export const GroupByDeleteCommentService = async (req) => {
  try{
    const userId = req.headers.user_id
    const {groupID, postID,commentID} = req.params

    const exitComment = await GroupCommentModel.findOne({ _id: commentID, groupID: groupID, postID: postID, userID: userId })
    if(!exitComment) {
      return {
        status: "failed",
        message : "Comment not found",
      }
    }

    const data = await GroupCommentModel.deleteOne({
      _id: commentID,
      userID: userId,
      groupID: groupID,
      postID: postID,
    })

    return {
      status: "success",
      message: "Comment deleted successfully",
      data : data
    }
  }
  catch(err){
    return {
      status: "failed",
      message : "Failed to delete a comment",
      error: err.toString(),
    }
  }
}


export const AddCommentReplyService = async (req) => {
  try {
    const userId = req.headers.user_id;
    const { groupID, postID, commentID } = req.params;
    const { replyText } = req.body;

    if (!userId || !groupID || !postID || !commentID || !replyText) {
      return {
        status: "failed",
        message: "Missing required fields",
      };
    }

    const replyComment = await GroupCommentModel.findOneAndUpdate(
      { _id: commentID, groupID: groupID, postID: postID },
      {
        $push: {
          replies: {
            userID: userId,
            replyText: replyText,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!replyComment) {
      return {
        status: "failed",
        message: "Comment not found",
      };
    }

    return {
      status: "success",
      message: "Comment reply successfully added",
    };
  } catch (err) {
    return {
      status: "failed",
      message: "Failed to add comment reply",
      error: err.toString(),
    };
  }
};



export const UpdateCommentOrReplyService = async (req) => {
  try {
    const userID = req.headers.user_id;
    const { replyText } = req.body;
    const { groupID, postID, commentID, replyID } = req.params;

    // Validate required fields
    if (!commentID || !replyID || !userID || !replyText) {
      return {
        status: "failed",
        message: "Missing required fields",
      };
    }


    const comment = await GroupCommentModel.findOne({
      groupID,
      postID,
      _id: commentID,
      "replies._id": replyID,
      "replies.userID": userID,
    });

    if (!comment) {
      return {
        status: "failed",
        message: "Reply not found or unauthorized",
      };
    }

    // Find and update the specific reply
    const reply = comment.replies.id(replyID);
    reply.replyText = replyText;

    // Save the updated comment document
    await comment.save();

    return {
      status: "success",
      message: "Reply updated successfully",
    };
  } catch (err) {
    console.error("Update error:", err);
    return {
      status: "failed",
      message: "Failed to update reply",
      error: err.toString(),
    };
  }
};


export const DeleteCommentReplyService = async (req) => {
  try {
    const userID = req.headers.user_id;
    const { groupID, postID, commentID, replyID } = req.params;

    // Validate required fields
    if (!groupID || !postID || !commentID || !replyID || !userID) {
      return {
        status: "failed",
        message: "Missing required fields",
      };
    }

    const comment = await GroupCommentModel.findOne({groupID: groupID, postID: postID, _id:commentID});

    if (!comment) {
      return {
        status: "failed",
        message: "Comment not found",
      };
    }

    const replyExists = comment.replies.some(
      (reply) => reply._id.toString() === replyID && reply.userID.toString() === userID
    );



    if (!replyExists) {
      return {
        status: "failed",
        message: "Reply not found or unauthorized",
      };
    }

    // Use $pull to remove the specific reply from the replies array
    const updateResult = await GroupCommentModel.updateOne(
      {
        groupID,
        postID,
        _id: commentID,
      },
      {
        $pull: {
          replies: { _id: replyID, userID: userID }, // Ensures only the user's reply is deleted
        },
      }
    );

    // Check if a reply was deleted
    if (updateResult.modifiedCount === 0) {
      return {
        status: "failed",
        message: "Reply not found or unauthorized",
      };
    }

    return {
      status: "success",
      message: "Reply deleted successfully",
    };

  } catch (err) {
    return {
      status: "failed",
      message: "Failed to delete the reply",
      error: err.toString(),
    };
  }
};


export const SingleReadCommentReplyService = async (req) => {
  try{
    const userId = req.headers.user_id
    const { groupID, postID, commentID, replyID } = req.params

    const comment = await GroupCommentModel.findOne({
      groupID,
      postID,
      _id: commentID,
    })

    // Check if the comment exists
    if (!comment) {
      return {
        status: "failed",
        message: "Comment not found",
      }
    }

    const reply = comment.replies.find(
      (reply) => reply._id.toString() === replyID && reply.userID.toString() === userId
    )

    if (!reply) {
      return {
        status: "failed",
        message: "Reply not found or unauthorized",
      }
    }

    return {
      status: "success",
      message: "Single read successfully",
      data: reply,
    }
  }
  catch (err){
    return {
      status: "failed",
      message: "failed to single read reply",
      error: err.toString(),
    }
  }
}




// add follower , remove follower
export const addFollowerByGroupService = async (req) => {
  try {
    const userId = req.headers.user_id
    const groupID = req.params.groupID

    const group = await GroupModel.findById(groupID);
    if (!group) {
      return {
        status: "failed",
        message: "Group not found",
      }
    }

    if (group.userID.toString() === userId) {
      return {
        status: "failed",
        message: "You are the owner of this group",
      }
    }

    const existingUser = group.followers.find((f) => f.userID.toString() === userId);
    if (existingUser) {
      return {
        status: "failed",
        message: "You are already follower",
      };
    }

    group.followers.push({ userID: userId})
    await group.save()

    return {
      status: "success",
      message: "Successfully followed the group",
    }

  } catch (err) {
    return {
      status: "failed",
      message: "Failed to add follower",
      error: err.toString(),
    }
  }
}



export const removeFollowerByGroupService = async (req) => {
  try {
    const userId = req.headers.user_id
    const groupID = req.params.groupID


    const group = await GroupModel.findByIdAndUpdate(
      groupID,
      { $pull: { followers: { userID: userId } } },
      { new: true }
    );

    if (!group) {
      return {
        status: "failed",
        message: "Group not found",
      };
    }

    return {
      status: "success",
      message: "Successfully unfollowed the group",
    };

  } catch (err) {
    return {
      status: "failed",
      message: "Failed to remove follower",
      error: err.toString(),
    };
  }
}




// Update User Role In Group Service
export const UpdateUserRoleInGroupService = async (req) => {
  try {
    const userID = req.params.userID;
    const groupID = req.params.groupID;
    const {role} = req.body

    // check group
    const group = await GroupModel.findById(groupID)
    if (!group) {
      return {
        status: "failed",
        message: "Group not found"
      }
    }


    // check you are admin
    if (group.userID.toString() !== req.headers.user_id) {
      return {
        status: "failed",
        message: "You are not the group admin"
      }
    }

    // ফলোয়ারদের মধ্যে যাকে আপডেট করতে হবে তাকে খুঁজে বের করা
    const follower = group.followers.find(f => f.userID.toString() === userID)
    if (!follower) {
      return {
        status: "failed",
        message: "User is not a follower of this group"
      }
    }

    // রোল আপডেট করা
    follower.role = role;
    await group.save();

    return {
      status: "success",
      message: `User role updated to successfully`
    }
  } catch (error) {
    return {
      status: "failed",
      message: "Error updating role",
      error: error.toString()
    }
  }
}
