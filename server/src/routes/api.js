import express from 'express'
const router = express.Router()
import {
    DeleteProfile,
    Login,
    LogOutProfile,
    ReadProfile, RecoverEmailVerify, RecoverVerifyOtp,
    Register, ResetPassword, seeAllUser, SingleProfileDetails, singleProfileRead,
    UpdateProfile,
} from "../controllers/UserController.js";
import {AuthMiddleware} from "../middlewares/AuthMiddleware.js";
import {
    CreateBlogPost,
    deleteBlogPost, ListByKeyword, PostListDetail,
    ReadBlogPost,
    SingleUserReadBlog, UpdateBlogPost,
    UserByBlogPostList, UserBySingleListDetails
} from "../controllers/BlogPostController.js"
import {
    CreateComment,
    deleteComment,
    UpdateComment,
    DetailsComment, SingleComment,
} from "../controllers/CommentController.js";
import {CreateLike, ReactionRead} from "../controllers/ReactController.js";
import {
    AcceptFollow,
    Follower, GetFollower, GetFollowing, GetMutualFollow, SearchFriend,
    UnFollow
} from "../controllers/FriendRequestController.js";
import {
    CreateStory,
    DeleteStory,
    ReadSingleStory,
    ReadStory
} from "../controllers/StoryController.js";





// user API
router.post('/Register',Register)
router.post('/Login',Login)
router.post('/UpdateProfile',AuthMiddleware,UpdateProfile)
router.get('/ReadProfile',AuthMiddleware,ReadProfile)
router.post('/LogOut',AuthMiddleware,LogOutProfile)
router.post('/DeleteProfile',AuthMiddleware,DeleteProfile)
router.get('/SingleProfileDetails',AuthMiddleware, SingleProfileDetails)
router.get('/singleProfileRead/:user_id',AuthMiddleware, singleProfileRead)

router.get('/RecoverEmailVerify/:email', RecoverEmailVerify)
router.post('/RecoverVerifyOtp', RecoverVerifyOtp)
router.post('/ResetPassword', ResetPassword)

// sell all users
router.get('/seeAllUser',AuthMiddleware, seeAllUser)

// Create Blog Post API
router.post('/CreateBlogPost', AuthMiddleware, CreateBlogPost)
router.get('/ReadBlogPost',AuthMiddleware, ReadBlogPost)
router.get('/PostListDetail/:blogID', PostListDetail)
router.get('/SingleDataShow/:id', SingleUserReadBlog)
router.get('/UserByBlogPostList', AuthMiddleware, UserByBlogPostList )
router.get('/deleteBlogPost/:id', AuthMiddleware, deleteBlogPost )
router.post('/UpdateBlogPost/:id',AuthMiddleware, UpdateBlogPost )
router.get('/ListByKeyword', ListByKeyword )
router.get('/UserBySingleListDetails/:userID',AuthMiddleware, UserBySingleListDetails )


//comment and replay
router.post('/CreateComment', AuthMiddleware, CreateComment)
router.post('/deleteComment', AuthMiddleware, deleteComment)
router.get('/SingleComment/:blogID',AuthMiddleware, SingleComment)
router.get('/DetailsComment/:id', DetailsComment)
router.post('/UpdateComment/:blogID', AuthMiddleware, UpdateComment)



// reaction router
router.post('/CreateLike', AuthMiddleware, CreateLike)
router.get('/ReactionRead/:id', ReactionRead)


// friends request Apis
router.post('/Follower',AuthMiddleware, Follower);
router.post('/AcceptFollow',AuthMiddleware, AcceptFollow);
router.post('/UnFollow',AuthMiddleware, UnFollow);
router.get('/SearchFriend',AuthMiddleware, SearchFriend);
router.get('/GetFollower/:id',AuthMiddleware, GetFollower);
router.get('/GetFollowing/:id',AuthMiddleware, GetFollowing);
router.get('/GetMutualFollow/:id',AuthMiddleware, GetMutualFollow);

router.post('/CreateStory',AuthMiddleware, CreateStory)
router.get('/ReadStory',AuthMiddleware, ReadStory)
router.get('/DeleteStory',AuthMiddleware, DeleteStory)

router.get('/ReadSingleStory/:storyID',AuthMiddleware, ReadSingleStory)







export default router;