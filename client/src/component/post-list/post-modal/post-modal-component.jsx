import React, {useEffect, useState} from 'react';
import PostListStore from "../../../store/post-list-store.js";
import {format} from "date-fns";
import {Link} from "react-router-dom";
import UserStore from "../../../store/user-store.js";
import CreateCommentComponent from "../create-comment-component.jsx";
import LikeShowUser from "../like_by_user/like-show-user.jsx";
import {FaComment, FaRegComment} from "react-icons/fa";
import CommentStore from "../../../store/comment-store.js";
import {AiOutlineLike} from "react-icons/ai";
import {IoMdShareAlt} from "react-icons/io";
import toast from "react-hot-toast";
import ReactionStore from "../../../store/reaction-store.js";
import CommentCreateModalComponent from "./comment-create-modal-component.jsx";
import {formatBlogPostDate, profileUrl} from "../../../utility/utility.js";

const PostModalComponent = ({onClose,postID}) => {
  const{PostListDetail, BlogListDetailRequest, blogPostReadRequest} = PostListStore()
  const {CreateLikeRequest, ReactionListRequest} = ReactionStore()
  const {CommentListDetail, deleteCommentRequest, commentListDetailsRequest,commentUpdateInput, commentUpdateOnchange, singleCommentRequest,
    updateCommentRequest,} = CommentStore()
  const{profileList}= UserStore()

  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);




  const likeHandler = async (id) => {
    let response = await CreateLikeRequest(id)
    if(response['status']==="success"){
      await blogPostReadRequest()
      await ReactionListRequest(postID)
      toast.success('liked successfully')
    }
    if(response['status']==='unlike'){
      await blogPostReadRequest()
      await ReactionListRequest(postID)
      toast.success('unlike successfully')
    }
  }

  const handleEditClick = async (commentId) => {
    setIsEditing(commentId);
    await singleCommentRequest(postID,commentId)
  };


  const handleSaveClick = async (commentId) => {
    let res = await updateCommentRequest(postID,commentId,commentUpdateInput)
    if(res === true) {
      setIsEditing(null);
      await commentListDetailsRequest(postID)
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
      await commentListDetailsRequest(postID)
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
    (async () => {
      await BlogListDetailRequest(postID)
    })()
  }, [postID]);

  return (
    <div>
      <div className="max-sm:[500px] md:w-[500px] xl:w-[650px] h-[95vh] mx-auto rounded bg-white overflow-y-auto  scroll-hidden ">
        <div>
          {
            PostListDetail===null ? (<div>Loading....</div>) : PostListDetail?.map((item, i)=>{
              const formattedDate = format(new Date(item.createdAt), "dd MMM, yyyy 'at' h:mm a");
              return (
                <div key={i}>
                  <div className="py-2 border-b border-b-gray-500 sticky top-0 bg-white">
                    <p className="text-[20px] font-semibold text-center">{item?.user?.fullName} post</p>
                  </div>
                  <div className="px-3 py-3 flex gap-2">
                    <Link to={`${profileList?.[0]?._id === item?.userID ? "/profile" : `/profile/${item?.userID}`}`}>
                      <img className="w-[40px] h-[40px] rounded-full object-cover"
                           src={item?.profile[0]?.profilePicture || profileUrl} alt="profileImage"/>
                    </Link>
                    <div>
                      <div className="flex items-center gap-1">
                        <Link to={`${profileList?.[0]?._id === item?.userID ? "/profile" : `/profile/${item?.userID}`}`}>
                          <p className="font-semibold">{item?.user?.fullName}</p>
                        </Link>
                        <div>
                          {
                            item?.role==="public"?(<div>🌍</div>):item?.role==="friends"?(<div>👥</div>):
                              item?.role==="only me" && (<div>🔒</div>)
                          }
                        </div>
                      </div>
                      <p className="text-[12px] leading-none">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="">
                    {
                      !item?.image ?(
                        <div className="w-full h-[55vh] flex flex-col items-center justify-center rounded-lg">
                          <p className="px-3">{item?.title}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="px-3 mb-2">{item?.title}</p>
                        </div>
                      )
                    }
                    <Link to={`/blogDetails/${item._id}`}>
                      <img className={`w-full object-contain rounded-lg ${item?.image ? "h-[55vh]": "h-0"}`} src={item?.image} alt=""/>
                    </Link>
                  </div>
                  <div className="flex justify-between px-5 pt-2">
                    <LikeShowUser blogID={postID}/>
                    <p className="text-[22px] flex gap-1 items-center">{CommentListDetail?.length || 0}<FaComment/></p>
                  </div>
                  <div>
                    <div
                      className="border-t border-t-gray-400 py-2 px-5  flex justify-between items-center mx-2 ">
                      <button className="cursor-pointer" onClick={() => likeHandler(postID)}>
                        <AiOutlineLike className="text-[24px]"/>
                      </button>
                      <button className="">
                        <label htmlFor="comment">
                          <FaRegComment className="text-[24px] cursor-pointer"/>
                        </label>
                      </button>
                      <button
                        className="cursor-pointer"
                        onClick={()=>handleShare(postID)}
                      >
                        <IoMdShareAlt className="text-[24px]"/>
                      </button>
                    </div>
                  </div>
                  {/*----------comment section-----------*/}
                  <div className="my-3 px-5 py-2">
                    <p className="font-semibold mb-2">Most Recent comment&#39;s</p>
                    {
                      CommentListDetail === null ? <p>Loading...</p> : CommentListDetail?.slice()?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.map((comment, i) => {
                        const formattedDate = formatBlogPostDate(comment?.createdAt)
                        return (
                          <>
                            <div key={i} className="flex gap-1 items-start ">
                              <div className="flex gap-2 ">
                                <div className="">
                                  <Link to={`${profileList?.[0]?._id === comment?.userID ? "/profile" : `/profile/${comment?.userID}`}`} >
                                    <img className="w-[40px] h-[40px] rounded-full"
                                         src={comment?.profile[0]?.profilePicture || profileUrl}
                                         alt={`profile`}
                                    />
                                  </Link>
                                </div>
                                <div className="flex gap-2 flex-1 items-start show_div">
                                  <div className=" rounded">
                                    <div className="bg-gray-200 py-2  px-3 rounded">
                                      <div className="flex items-center gap-3">
                                        <Link to={`${profileList?.[0]?._id === comment?.userID ? "/profile" : `/profile/${comment?.userID}`}`} >
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
                                              className="text-blue-400 font-bold cursor-pointer"
                                            >
                                              {isExpanded ? "Show Less" : "Show More"}
                                            </button>
                                          )}
                                        </p>
                                      ) : (
                                        <div className="flex-1">
                                          <textarea
                                            className="w-full py-1 px-2 border border-gray-400 rounded-md resize-none overflow-hidden bg-transparent outline-none focus:border-blue-500"
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
                                    <div className="px-3">
                                      <div>
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
                                                        className="text-blue-600 font-semibold cursor-pointer hover:underline"
                                                      >
                                                        Edit
                                                      </button>
                                                    ) : (
                                                      <button
                                                        onClick={()=>handleSaveClick(comment?._id)}
                                                        className="text-green-600 font-semibold cursor-pointer hover:underline"
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
                            </div>
                          </>
                        )
                      })
                    }
                  </div>
                  {/* -------- Create comment ---------*/}
                  <div className="sticky bottom-0 w-full bg-white box-border border-t border-t-gray-400 shadow px-3 " id="commentDiv">
                    <CommentCreateModalComponent comment="comment" blogID={postID}/>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  );
};

export default PostModalComponent;