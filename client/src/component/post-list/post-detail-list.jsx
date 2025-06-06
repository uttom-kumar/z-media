import React, {useEffect, useRef, useState} from "react";
import BlogPostStore from "../../store/post-list-store.js";
import {Link, useParams} from "react-router-dom";
import { CiZoomIn, CiZoomOut } from "react-icons/ci";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { TbZoomReset } from "react-icons/tb";
import UserStore from "../../store/user-store.js";
import CommentStore from "../../store/comment-store.js";
import {format} from "date-fns";
import {IoMdClose, IoMdShareAlt} from "react-icons/io";
import {formatBlogPostDate, profileUrl} from "../../utility/utility.js";
import CommentHeader from "../header/comment-header.jsx";
import CreateCommentComponent from "./create-comment-component.jsx";
import toast from "react-hot-toast";
import { AiOutlineLike} from "react-icons/ai";
import {FaComment, FaRegComment} from "react-icons/fa";
import ReactionStore from "../../store/reaction-store.js";
import LikeShowUser from "./like_by_user/like-show-user.jsx";
import {id} from "date-fns/locale";
import LikeButton from "../common/likeButton.jsx";

const PostDetailList = () => {
  const { PostListDetail, BlogListDetailRequest} = BlogPostStore();
  const {profileList, profileListRequest} = UserStore()
  const {CommentListDetail, commentListDetailsRequest, deleteCommentRequest, commentUpdateInput, commentUpdateOnchange, singleCommentRequest,
    updateCommentRequest, } = CommentStore()
  const { blogID } = useParams()
  const [isEditing, setIsEditing] = useState(false);


  const [isExpanded, setIsExpanded] = useState(false);

  const handleEditClick = async (commentId) => {
    setIsEditing(commentId);
    await singleCommentRequest(blogID,commentId)
  };

  const handleSaveClick = async (commentId) => {
    let res = await updateCommentRequest(blogID,commentId,commentUpdateInput)
    if(res === true) {
      setIsEditing(null);
      await commentListDetailsRequest(blogID)
      toast.success('comment update successfully')
    }
    else {
      toast.error("comment update failed")
    }
  };




  const showMoreHandleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const CommentDeleteHandler = async (blogId,commentID) => {
    let res = await deleteCommentRequest(blogId,commentID)
    if(res === true) {
      await commentListDetailsRequest(blogID)
      toast.success("Comment deleted")
    }
    else {
      toast.error("Comment delete failed")
    }
  }


  const handleShare = async (id) => {
    const url = location + "blogDetails/" + id
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'KAM_DEE',
          text: 'Mr.CEO_and_Founder_Of_UVIOM .',
          url: url,
        });

      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Sharing is not supported in this browser.');
    }
  };








  useEffect(() => {
    if(PostListDetail===null || profileList=== null || CommentListDetail === null)
    (async () => {
      if(PostListDetail === null ){
        await BlogListDetailRequest(blogID);
      }
      if(profileList === null ){
        await profileListRequest()
      }
      if(CommentListDetail === null){
        await commentListDetailsRequest(blogID)
      }
    })();
  }, [blogID, PostListDetail, profileList, CommentListDetail, BlogListDetailRequest, profileListRequest, commentListDetailsRequest]);



  return (
    <div>
      <div className="block lg:flex animate-fade-in">
        {/* Left sidebar */}
        <div className="w-full mt-[60px] lg:w-[60%] lg:mt-0 xl:w-[75%] lg:fixed top-0" id="divHide">
          {PostListDetail === null ? (
            <div>Loading...</div>
          ) : (
            PostListDetail.map((item, index) => {
              return(
                <div key={index} className="relative">
                  {item?.image ?(
                    <div
                      className="overflow-hidden h-[50vh] lg:h-[100vh] flex flex-col items-center justify-center sticky top-0 left-0 bg-black"
                      style={{maxHeight: "100vh"}}
                    >
                      <TransformWrapper
                        initialScale={1}
                        minScale={1}
                        maxScale={3}
                        centerOnInit={true}
                      >
                        {({zoomIn, zoomOut, resetTransform}) => (
                          <>
                            <TransformComponent>
                              <div className="flex justify-center items-center h-full w-full">
                                <img
                                  src={item?.image}
                                  alt={`Image`}
                                  className="w-full h-[50vh] lg:h-[100vh] object-contain"
                                />
                              </div>
                            </TransformComponent>
                            <div className="absolute top-4 right-4 z-10">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => zoomIn()}
                                  className="px-2 py-1 bg-blue-500 text-white text-[30px] rounded hover:bg-blue-700"
                                >
                                  <CiZoomIn/>
                                </button>
                                <button
                                  onClick={() => zoomOut()}
                                  className="px-2 py-1 bg-blue-500 text-white text-[30px] rounded hover:bg-blue-700"
                                >
                                  <CiZoomOut/>
                                </button>
                                <button
                                  onClick={() => resetTransform()}
                                  className="px-2 py-1 bg-red-500 text-white text-[30px] rounded hover:bg-red-700"
                                >
                                  <TbZoomReset/>
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </TransformWrapper>
                    </div>
                  ): (
                    <div className="overflow-y-auto h-[100%] lg:h-[100vh] bg-black sticky top-0 left-0">
                      <p className=" text-gray-200 lg:text-[24px] flex flex-coljustify-center items-center h-screen w-[80%] lg:w-[60%] mx-auto">{item?.title}</p>
                    </div>
                  )}
                  <div className="absolute left-[10px] top-[10px]">
                    <Link to={'/'} className="">
                      <p
                        className="w-[40px] h-[40px] flex flex-col items-center justify-center text-white text-[24px] bg-gray-700 hover:bg-gray-600 rounded-full">
                        <IoMdClose/></p>
                    </Link>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-full lg:w-[40%] xl:w-[25%] ml-0 lg:ml-[60%] xl:ml-[75%] animate-fade-in" id="rightDiv">
          <div className="fixed left-0 right-0 mb-10 lg:sticky top-0 z-50">
            <CommentHeader/>
          </div>
          {PostListDetail === null ? (
            <div>Loading...</div>
          ) : (
            PostListDetail.map((item, i) => {
              const alreadyLiked = !!item?.react[0]?.likeByUserID?.find((like) => like.userID === item?.user._id)?.liked;
              const formattedDate = format(new Date(item.createdAt), "dd MMM, yyyy 'at' h:mm a")

              return (
                <div key={i} className="p-5">
                  <div className="flex gap-1 items-start">
                    <Link to={`${profileList?.[0]?._id === item?.userID ? "/profile" : `/profile/${item?.userID}`}`} >
                      <img
                        className="w-[50px] h-[50px] rounded-full"
                        src={item?.profile[0]?.profilePicture || profileUrl}
                        alt={`${item?.user?.fullName}'s profile`}
                      />
                    </Link>
                    <div>
                      <Link to={`${profileList?.[0]?._id === item?.userID ? "/profile" : `/profile/${item?.userID}`}`}>
                        <p className="flex items-center gap-1">
                          {item?.user?.fullName}
                          <span>
                            {
                              item?.role==="public"?(<div>🌍</div>):item?.role==="friends"?(<div>👥</div>):
                                item?.role==="only me" && (<div>🔒</div>)
                            }
                          </span>
                        </p>
                      </Link>
                      <p className="text-[14px]">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="text-[16px] py-2 mb-5">
                    {isExpanded || item?.title?.length <= 100
                      ? item?.title
                      : `${item?.title?.slice(0, 100)}...`}
                    {item?.title?.length > 100 && (
                      <button onClick={showMoreHandleToggle} className="text-blue-400 font-bold">
                        {isExpanded ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>
                  {/*--------show all user ----------*/}
                  <div className="flex justify-between items-center">
                    <div>
                      <LikeShowUser blogID={blogID} />
                    </div>
                    <div>
                      <p className="text-[22px] flex gap-1 items-center">{CommentListDetail?.length || 0}<FaComment /></p>
                    </div>
                  </div>
                  {/*--------like comment button all ----------*/}
                  <div className="border-t border-t-gray-400 py-2 px-5  flex justify-between items-center">
                    <LikeButton
                        postId={item?._id}
                        initialLiked={alreadyLiked}
                        initialCount={item?.react[0]?.like ?? 0}
                    />
                    <button className="cursor-pointer">
                      <label htmlFor="comment">
                        <FaRegComment className="text-[24px] cursor-pointer" />
                      </label>
                    </button>
                    <button
                      className="cursor-pointer"
                      onClick={()=>handleShare(blogID)}
                    >
                      <IoMdShareAlt className="text-[24px]" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
          {/*----------comment section-----------*/}
          <div className="my-3 px-5 py-2">
            <div className="font-semibold mb-2">Most Recent comment&#39;s</div>
            {
              CommentListDetail === null ? <div>Loading...</div> : CommentListDetail?.slice()?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.map((comment, i) => {
                const formattedDate = formatBlogPostDate(comment?.createdAt)
                return (
                  <>
                    <div key={i} className="">
                      <div className="flex items-start gap-1 ">
                        <div>
                          <Link to={`${profileList?.[0]?._id === comment?.userID ? "/profile" : `/profile/${comment?.userID}`}`} >
                            <img className="w-[40px] h-[40px] rounded-full"
                                 src={comment?.profile[0]?.profilePicture || profileUrl}
                                 alt={`profile`}
                            />
                          </Link>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-100 py-2  px-3 rounded">
                            <div className="flex items-center gap-3">
                              <Link
                                to={`${profileList?.[0]?._id === comment?.userID ? "/profile" : `/profile/${comment?.userID}`}`}>
                                <p className="font-semibold hover:underline">{comment?.user.fullName}</p>
                              </Link>
                              <p className="text-[14px]">{formattedDate}</p>
                            </div>
                            {!isEditing || isEditing !== comment?._id ? (
                              <p className="text-[16px]">
                                {isExpanded || comment.text.length <= 100
                                  ? comment.text
                                  : `${comment.text.slice(0, 100)}...`}
                                {comment.text.length > 100 && (
                                  <button
                                    onClick={showMoreHandleToggle}
                                    className="text-blue-400 font-bold"
                                  >
                                    {isExpanded ? "Show Less" : "Show More"}
                                  </button>
                                )}
                              </p>
                            ) : (
                              <div className="flex-1">
                                  <textarea
                                    className="w-full py-1 px-2 border border-gray-700 rounded-md resize-none overflow-hidden bg-transparent outline-none focus:border-blue-500"
                                    value={commentUpdateInput?.text}
                                    onChange={(e) => commentUpdateOnchange("text",e.target.value)}
                                    ref={(el) => {
                                      if (el) {
                                        el.style.height = "auto";
                                        el.style.height = `${el.scrollHeight}px`;
                                      }
                                    }}
                                    style={{
                                      minHeight: "50px",
                                      maxHeight: "300px"
                                    }}
                                  />
                              </div>
                            )}
                          </div>
                          <div className="px-3 mb-5">
                            <div className="">
                              {
                                profileList?.map((profile, i) => {
                                  return (
                                    <div key={i} className="flex items-center gap-3 mt-1">
                                      {
                                        profile?._id === comment?.userID && (
                                          <button className="text-red-600 font-semibold hover:underline cursor-pointer"
                                                  onClick={() => CommentDeleteHandler(comment?.blogID, comment?._id)}
                                          >
                                            Delete
                                          </button>
                                        )
                                      }
                                      {profile?._id === comment?.userID && (
                                        <div>
                                          {!isEditing || isEditing !== comment?._id ? (
                                            <button
                                              onClick={() => handleEditClick(comment?._id)}
                                              className="text-blue-600 font-semibold hover:underline cursor-pointer"
                                            >
                                              Edit
                                            </button>
                                          ) : (
                                            <button
                                              onClick={()=>handleSaveClick(comment?._id)}
                                              className="text-green-600 font-semibold hover:underline cursor-pointer"
                                            >
                                              Save
                                            </button>
                                          )}
                                        </div>
                                      )}
                                      <button className="text-gray-700 font-semibold hover:underline cursor-pointer">Hide</button>
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )
              })
            }
          </div>
          {/* -------- Create comment ---------*/}
          <div className="sticky bottom-0 w-full  box-border px-3 " id="commentDiv">
            <CreateCommentComponent comment="comment"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailList;
