import express from 'express'
const router = express.Router()
import {AuthMiddleware} from "../middlewares/AuthMiddleware.js";

import * as UserController from "../controllers/UserController.js"
import * as BlogPostController from "../controllers/BlogPostController.js"
import * as CommentController from "../controllers/CommentController.js";
import * as ReactController from "../controllers/ReactController.js";
import * as FriendRequestController from "../controllers/FriendRequestController.js";
import * as StoryController from "../controllers/StoryController.js";
import * as GroupController  from "../controllers/GroupController.js";





// user API
router.post('/Register',UserController.Register)
router.post('/Login',UserController.Login)
router.post('/UpdateProfile',AuthMiddleware,UserController.UpdateProfile)
router.get('/ReadProfile',AuthMiddleware,UserController.ReadProfile)
router.post('/LogOut',AuthMiddleware,UserController.LogOutProfile)
router.post('/DeleteProfile',AuthMiddleware,UserController.DeleteProfile)
router.get('/SingleProfileDetails',AuthMiddleware, UserController.SingleProfileDetails)
router.get('/singleProfileRead/:user_id',AuthMiddleware, UserController.singleProfileRead)

router.get('/RecoverEmailVerify/:email', UserController.RecoverEmailVerify)
router.post('/RecoverVerifyOtp', UserController.RecoverVerifyOtp)
router.post('/ResetPassword', UserController.ResetPassword)

// sell all users
router.get('/seeAllUser',AuthMiddleware, UserController.seeAllUser)

// Create Blog Post API
router.post('/CreateBlogPost', AuthMiddleware, BlogPostController.CreateBlogPost)
router.get('/ReadBlogPost',AuthMiddleware, BlogPostController.ReadBlogPost)
router.get('/PostListDetail/:blogID', BlogPostController.PostListDetail)
router.get('/SingleDataShow/:id', BlogPostController.SingleUserReadBlog)
router.get('/UserByBlogPostList', AuthMiddleware, BlogPostController.UserByBlogPostList )
router.get('/deleteBlogPost/:id', AuthMiddleware, BlogPostController.deleteBlogPost )
router.post('/UpdateBlogPost/:id',AuthMiddleware, BlogPostController.UpdateBlogPost )
router.get('/ListByKeyword', BlogPostController.ListByKeyword )
router.get('/UserBySingleListDetails/:userID',AuthMiddleware, BlogPostController.UserBySingleListDetails )


//comment and replay
router.post('/CreateComment', AuthMiddleware, CommentController.CreateComment)
router.post('/deleteComment', AuthMiddleware, CommentController.deleteComment)
router.get('/SingleComment/:blogID',AuthMiddleware, CommentController.SingleComment)
router.get('/DetailsComment/:id', CommentController.DetailsComment)
router.post('/UpdateComment/:blogID', AuthMiddleware, CommentController.UpdateComment)



// reaction router
router.post('/CreateLike', AuthMiddleware, ReactController.CreateLike)
router.get('/ReactionRead/:id', ReactController.ReactionRead)


// friends request Apis
router.post('/Follower',AuthMiddleware, FriendRequestController.Follower);
router.post('/AcceptFollow',AuthMiddleware, FriendRequestController.AcceptFollow);
router.post('/UnFollow',AuthMiddleware, FriendRequestController.UnFollow);
router.get('/SearchFriend',AuthMiddleware, FriendRequestController.SearchFriend);
router.get('/GetFollower/:id',AuthMiddleware, FriendRequestController.GetFollower);
router.get('/GetFollowing/:id',AuthMiddleware, FriendRequestController.GetFollowing);
router.get('/GetMutualFollow/:id',AuthMiddleware, FriendRequestController.GetMutualFollow);

router.post('/CreateStory',AuthMiddleware, StoryController.CreateStory)
router.get('/ReadStory',AuthMiddleware, StoryController.ReadStory)
router.get('/DeleteStory',AuthMiddleware, StoryController.DeleteStory)

router.get('/ReadSingleStory/:storyID',AuthMiddleware, StoryController.ReadSingleStory)



// group router
router.post('/CreateGroup', AuthMiddleware, GroupController.CreateGroup)
router.post('/UpdateGroup', AuthMiddleware, GroupController.UpdateGroup)
router.get('/ReadGroup/:groupId', AuthMiddleware, GroupController.ReadGroup)

router.post('/CreateGroupPost/:groupID', AuthMiddleware, GroupController.CreateGroupPost)
router.post('/UpdateGroupPost/:groupID/:postID', AuthMiddleware, GroupController.UpdateGroupPost)
router.post('/DeleteGroupPost/:groupID/:postID', AuthMiddleware, GroupController.DeleteGroupPost)
router.get('/UpdateBySinglePostList/:groupID/:postID', AuthMiddleware, GroupController.UpdateBySinglePostList)

router.post('/GroupPostAddLike/:groupID/:postID', AuthMiddleware, GroupController.GroupPostAddLike)
router.post('/GroupPostRemoveLike/:groupID/:postID/:reactId', AuthMiddleware, GroupController.GroupPostRemoveLike)

// group post comment create api
router.post('/GroupByCreateComment/:groupID/:postID', AuthMiddleware, GroupController.GroupCreateComment)
router.post('/GroupByUpdateComment/:groupID/:postID/:commentID', AuthMiddleware, GroupController.GroupUpdateComment)
router.get('/GroupBySingleReadComment/:groupID/:postID/:commentID', AuthMiddleware, GroupController.GroupSingleReadComment)
router.post('/GroupByDeleteComment/:groupID/:postID/:commentID', AuthMiddleware, GroupController.GroupByDeleteComment)

// add to comment reply
router.post('/AddCommentReply/:groupID/:postID/:commentID', AuthMiddleware, GroupController.AddCommentReply)
router.post('/UpdateCommentOrReply/:groupID/:postID/:commentID/:replyID', AuthMiddleware, GroupController.UpdateCommentOrReply)
router.post('/DeleteCommentReply/:groupID/:postID/:commentID/:replyID', AuthMiddleware, GroupController.DeleteCommentReply)
router.get('/SingleReadCommentReply/:groupID/:postID/:commentID/:replyID', AuthMiddleware, GroupController.SingleReadCommentReply)

//add follower in group
router.post('/addFollowerByGroup/:groupID', AuthMiddleware, GroupController.addFollowerByGroup)
router.post('/removeFollowerByGroup/:groupID', AuthMiddleware, GroupController.removeFollowerByGroup)


router.post('/UpdateUserRoleInGroup/:groupID/:userID', AuthMiddleware, GroupController.UpdateUserRoleInGroup)







export default router;