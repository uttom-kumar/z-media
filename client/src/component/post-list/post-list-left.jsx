import React, {useEffect, useRef, useState} from 'react';
import BlogPostStore from "../../store/post-list-store.js";
import { format } from 'date-fns';
import { profileUrl } from "../../utility/utility.js";
import { Link } from "react-router-dom";
import {AiFillLike, AiOutlineLike} from "react-icons/ai";
import { FaRegComment, FaShare} from "react-icons/fa";
import ReactionStore from "../../store/reaction-store.js";
import CreateBtnComponent from "./create-post/create-btn-component.jsx";
import UserStore from "../../store/user-store.js";
import toast from "react-hot-toast";
import {GoKebabHorizontal} from "react-icons/go";
import PostDropdownTopUp from "./post-dropdown-topup/post-dropdown-top-up.jsx";
import CreateCommentComponent from "./create-comment/create-comment-component.jsx";
import PostListSkeleton from "../../skeleton/post-list-skeleton.jsx";
import StoryComponent from "../Story/story-component.jsx";
import ModalComponent from "../modal/modal-component.jsx";
import PostModalComponent from "./post-modal/post-modal-component.jsx";
import LikeButton from "../common/likeButton.jsx";



const PostListLeft = () => {
  const { blogPostRead, blogPostReadRequest,  } = BlogPostStore()
  const { profileListRequest,profileList} = UserStore()
  const {CreateLikeRequest} =ReactionStore()
  const [showComment, setShowComment] = useState(false)
  const dropdownRef = useRef(null);

  const [showModalBtn, setShowModalBtn] = useState(false)
  const [showModal, setShowModal] = useState(false)

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


  const openModal = (postID) => {
    setShowModal(postID);
  };


  useEffect(() => {
    if (blogPostRead === null || profileList === null) {
      (async () => {
        if (blogPostRead === null) {
          await blogPostReadRequest();
        }
        if (profileList === null) {
          await profileListRequest();
        }
      })();
    }
  }, [blogPostRead, blogPostReadRequest, profileList, profileListRequest]);


  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowModalBtn(null); // Close the dropdown
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);


  return (
    <>
      <div>
        <div className="w-full lg:w-[80%] xl:w-[70%] mx-auto">
          <div className="pb-2">
            <CreateBtnComponent/>
          </div>
          <div className="pt-2 pb-5">
            <StoryComponent />
          </div>
          {
            blogPostRead === null ? <div><PostListSkeleton /></div> :
              blogPostRead?.slice()?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.map((post, i) => {
                const formattedDate = format(new Date(post.createdAt), "dd MMM, yyyy 'at' h:mm a");
                /* ------------ is the current user already liking this post? ------------ */
                const alreadyLiked = !!post?.react?.likeByUserID?.find((like) => like.userID === post?.user._id)?.liked;
                return (
                  <div key={i} className={`bg-white mb-10 p-5 md:p-10 rounded-lg border border-gray-200  shadow animate-fade-in 
                  ${post}
                  `}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-2">
                        <Link
                          to={`${profileList?.[0]?._id === post?.userID ? "/profile" : `/profile/${post?.userID}`}`}>
                          <img className="w-[40px] h-[40px] rounded-full object-contain"
                               src={post?.profile?.[0]?.profilePicture || profileUrl}
                               alt="profile picture"/>
                        </Link>
                        <div>
                          <Link
                            to={`${profileList?.[0]?._id === post?.userID ? "/profile" : `/profile/${post?.userID}`}`}>
                            <div className={"flex items-center gap-1 cursor-pointer hover:underline"}>
                              {post?.user?.fullName}
                              <span>
                                {
                                  post?.role === "public" ? (<div>🌍</div>) : post?.role === "friends" ? (<div>👥</div>) :
                                    post?.role === "only me" && (<div>🔒</div>)
                                }
                              </span>
                            </div>
                          </Link>
                          <p className="text-[12px]">{formattedDate}</p>
                        </div>
                      </div>
                      <div>
                        <div className="relative" ref={dropdownRef}>
                          {/*show delete edit hide ,save and copy link this*/}
                          <button className="cursor-pointer" onClick={() => setShowModalBtn(post?._id)}>
                            <GoKebabHorizontal/>
                          </button>
                          {/* --------- show drop down menu ----------*/}
                          <div className="absolute top-[20px] right-0">
                            {showModalBtn === post?._id && (
                              <div ref={dropdownRef}
                                   className=" w-[220px] msm:w-[300px] py-3 px-1 bg-white rounded animate-fade-in"
                                   style={{boxShadow: "0 0 5px #ccc"}}>
                                <PostDropdownTopUp blogID={post?._id} userID={post?.userID}/>
                              </div>
                            )}

                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Post List Image Show */}
                    <div className="my-4 flex flex-col">
                      <p className={`mb-5 text-start ${!post?.image && "hidden"}`}>
                        {post?.title}
                      </p>
                      {post?.image ? (
                        <Link to={`/blogDetails/${post['_id']}`}>
                          <img
                            className="w-full h-[300px] object-contain overflow-hidden rounded-lg  sm:h-[400px] md:h-[500px]"
                            src={post.image}
                            alt="Post Image"
                          />
                        </Link>
                      ) : (
                        <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center text-center">
                          {post?.title}
                        </div>
                      )}
                    </div>
                    {/*----------add like section ------------*/}

                    <div className="mt-4">
                    <div className="flex justify-between items-center gap-2 ">
                        <div className="flex justify-between items-center gap-2 ">
                          <div className="flex items-center -space-x-4">
                            {/* Display profile image */}
                            {
                              post?.likeByProfile?.slice(0, 4)?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.map((profileImage, i) => {
                                return (
                                  <div key={i} className="my-3">
                                    <img
                                      className="w-[30px] h-[30px] rounded-full"
                                      src={profileImage?.profilePicture || profileUrl}
                                      alt="profile"
                                    />
                                  </div>
                                )
                              })
                            }

                            {/* Display the first user's name and "and others" */}
                            {
                              post?.likeByUser?.slice(0, 1)?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.map((user, i) => {
                                return (
                                  <div key={i}>
                                    <p className="flex items-center gap-1 ml-[20px]">
                                      {user?.fullName}
                                      {post?.likeByUser?.length > 1 && <span> and others</span>}
                                    </p>
                                  </div>
                                )
                              })
                            }
                          </div>

                        </div>
                        <div>
                          {/*----------------------------------------*/}
                          {/*<Link to={`/blogDetails/${post?._id}`}>*/}
                          <button
                            className="cursor-pointer hover:underline"
                            onClick={() => openModal(post?._id)}
                          >
                            <p className="text-gray-700 font-semibold">
                              {post?.comment?.length || 0} comments
                            </p>
                          </button>
                          {/*</Link>*/}
                        </div>
                      </div>

                    </div>
                    <div className="flex  border-t border-t-gray-400 py-2 px-3 justify-between items-center gap-3">
                      <LikeButton
                        postId={post?._id}
                        initialLiked={alreadyLiked}
                        initialCount={post?.react?.like ?? 0}
                      />
                      <button className="text-[24px] cursor-pointer"
                              onClick={() => setShowComment(post?._id)}
                      >
                        <FaRegComment/>
                      </button>
                      <button
                        onClick={() => handleShare(post?._id)}
                        className="text-[20px] cursor-pointer">
                        <FaShare/>
                      </button>
                    </div>
                    {
                      showComment === post?._id && (
                        <>
                          <CreateCommentComponent blogID={post?._id} userID={post?.userID}/>
                        </>
                      )
                    }
                    {/*  --------------------------*/}
                    <ModalComponent isVisible={showModal} onClose={() => setShowModal(false)}>
                      <PostModalComponent onClose={setShowModal} postID={showModal}/>
                    </ModalComponent>
                  </div>
                );
              })
          }
        </div>
      </div>
    </>
  );
};

export default PostListLeft;
