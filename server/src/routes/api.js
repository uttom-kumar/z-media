import express from 'express'
const router = express.Router()
import {
    DeleteProfile,
    Login,
    LogOutProfile, ProfileAllDetails,
    ReadProfile,
    Register,
    UpdateProfile,
} from "../controllers/UserController.js";
import {AuthMiddleware} from "../middlewares/AuthMiddleware.js";
import {
    CreateBlogPost,
    deleteBlogPost, ListByKeyword, PostListDetail,
    ReadBlogPost,
    SingleUserReadBlog, UpdateBlogPost,
    UserByBlogPostList
} from "../controllers/BlogPostController.js"
import {
    CreateComment,
    deleteComment,
    UpdateComment,
    DetailsComment, SingleComment
} from "../controllers/CommentController.js";
import {CreateDisLike, CreateLike, ReactionRead} from "../controllers/ReactController.js";
import {
    FriendDetail,
    FriendRequestAccept,
    FriendRequestSent, SearchFriendRequest,
    UnFriendRequest
} from "../controllers/FriendRequestController.js";



// file uploads services multiple collections




// user API
router.post('/Register',Register)
router.post('/Login',Login)
router.post('/UpdateProfile',AuthMiddleware,UpdateProfile)
router.get('/ReadProfile',AuthMiddleware,ReadProfile)
router.post('/LogOut',AuthMiddleware,LogOutProfile)
router.post('/DeleteProfile',AuthMiddleware,DeleteProfile)
router.get('/ProfileAllDetails',AuthMiddleware,ProfileAllDetails)

// Create Blog Post API
router.post('/CreateBlogPost', AuthMiddleware, CreateBlogPost)
router.get('/ReadBlogPost', ReadBlogPost)
router.get('/PostListDetail/:id', PostListDetail)
router.get('/SingleDataShow/:id', SingleUserReadBlog)
router.get('/UserByBlogPostList', AuthMiddleware, UserByBlogPostList )
router.get('/deleteBlogPost/:id', AuthMiddleware, deleteBlogPost )
router.post('/UpdateBlogPost/:id',AuthMiddleware, UpdateBlogPost )
router.get('/ListByKeyword', ListByKeyword )


//comment and replay
router.post('/CreateComment', AuthMiddleware, CreateComment)
router.post('/deleteComment', AuthMiddleware, deleteComment)
router.get('/SingleComment',AuthMiddleware, SingleComment)
router.get('/DetailsComment/:id', DetailsComment)
router.post('/UpdateComment', AuthMiddleware, UpdateComment)



// reaction router
router.post('/CreateLike', AuthMiddleware, CreateLike)
router.post('/CreateDisLike', AuthMiddleware, CreateDisLike)
router.get('/ReactionRead/:id', ReactionRead)


// friends request Apis
router.post('/SendRequest',AuthMiddleware, FriendRequestSent);
router.post('/AcceptRequest',AuthMiddleware, FriendRequestAccept);
router.delete('/unfriendRequest',AuthMiddleware, UnFriendRequest);
router.get('/FriendDetail',AuthMiddleware, FriendDetail);
router.get('/SearchFriendRequest',AuthMiddleware, SearchFriendRequest);








export default router;