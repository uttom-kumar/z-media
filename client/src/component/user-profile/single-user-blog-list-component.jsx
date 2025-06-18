import BlogPostStore from "../../store/post-list-store.js";
import {Link} from "react-router-dom";
import {format} from "date-fns";
import {AiFillLike} from "react-icons/ai";
import {FaRegComment, FaShare} from "react-icons/fa";
import React, {useEffect, useRef, useState} from "react";
import {profileUrl} from "../../utility/utility.js";
import CreateCommentComponent from "../post-list/create-comment/create-comment-component.jsx";
import {GoKebabHorizontal} from "react-icons/go";
import PostDropdownTopUp from "../post-list/post-dropdown-topup/post-dropdown-top-up.jsx";
import toast from "react-hot-toast";
import ReactionStore from "../../store/reaction-store.js";
import PostListSkeleton from "../../skeleton/post-list-skeleton.jsx";
import PostModalComponent from "../post-list/post-modal/post-modal-component.jsx";
import ModalComponent from "../modal/modal-component.jsx";
import LikeButton from "../common/likeButton.jsx";
import UserStore from "../../store/user-store.js";

const SingleUserBlogListComponent = ({userID}) => {
  const dropdownRef = useRef(null);
  const [showModalBtn, setShowModalBtn] = useState(false)
  const { UserBySingleListDetails} = BlogPostStore();
  const {profileList} = UserStore()
  const [showComment, setShowComment] = useState(false);
  const [showModal, setShowModal] = useState(false)


  const handleShare = async (blogID) => {
    const url = location + "blogDetails/" + blogID
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
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowModalBtn(null); // Close the dropdown
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);


  return (
    <div>
      {UserBySingleListDetails === null ? (
        <div><PostListSkeleton /></div>
      ) : (
        <>
          {UserBySingleListDetails?.slice()?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.map((postlist, index) => {
            const currentUserID = profileList?.[0]?._id
            const alreadyLiked = !!postlist?.Reaction?.[0]?.likeByUserID?.find((like) => like.userID === currentUserID)?.liked;
            const formattedDate = format(new Date(postlist.createdAt), "dd MMM, yyyy 'at' h:mm a");
            return (
              <div key={index} className="p-5 bg-white border border-gray-400 rounded mb-10">
                {/*profile section*/}
                <div className="flex mb-3 items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <img className="w-[40px] h-[40px] rounded-full"
                         src={postlist?.profile[0]?.profilePicture || profileUrl} alt="profile image"/>
                    <div>
                      <div className="flex items-center gap-1">
                        <p>{postlist?.user?.fullName}</p>
                        <div>
                          {
                            postlist?.role === "public" ? (<div>🌍</div>) : postlist?.role === "friends" ? (<div>👥</div>) :
                              postlist?.role === "only me" && (<div>🔒</div>)
                          }
                        </div>
                      </div>
                      <p className="text-[14px]">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button onClick={() => setShowModalBtn(postlist?._id)}>
                      <GoKebabHorizontal/>
                    </button>
                    <div className="absolute top-[20px] right-0">
                      {showModalBtn === postlist?._id && (
                        <div ref={dropdownRef} className=" w-[220px] msm:w-[300px] py-3 px-1 bg-white rounded animate-fade-in" style={{boxShadow: "0 0 5px #ccc"}}>
                          <PostDropdownTopUp blogID={postlist?._id} userID={postlist?.userID} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <p className={`mb-3 ${!postlist?.image && "hidden"}`}>{postlist?.title}</p>
                </div>
                <div>
                  <Link to={`/blogDetails/${postlist?._id}`}>
                  {postlist?.image ? (
                      <img
                        className={`w-full h-[300px] md:h-[500px] object-contain`}
                        src={postlist?.image}
                        alt="Post"
                      />
                    ):(
                      <div className="w-full h-[300px] md:h-[400px] flex flex-col justify-center items-center overflow-y-auto scrollbar-thin">
                        {postlist?.title}
                      </div>
                  )}
                  </Link>
                </div>
                {/*like section*/}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div></div>
                    <div className="">
                      <button
                        onClick={() => openModal(postlist?._id)}
                      >
                        <span className="text-gray-700 font-bold cursor-pointer">{postlist?.comment?.length || 0} comments</span>
                      </button>
                    </div>
                  </div>
                  <div className="">
                  <div
                      className="flex items-center gap-3 px-5 py-2 border-t border-t-gray-600  justify-between">
                    <LikeButton
                        postId={postlist?._id}
                        initialLiked={alreadyLiked}
                        initialCount={postlist?.Reaction?.[0]?.like ?? 0}
                    />
                      <button
                        onClick={()=>setShowComment(postlist?._id)}
                        className="text-[24px] cursor-pointer">
                        <FaRegComment/>
                      </button>
                      <button
                        onClick={()=>handleShare(postlist?._id)}
                        className="text-[20px] cursor-pointer">
                        <FaShare/>
                      </button>
                    </div>
                  </div>
                  {
                    showComment === postlist?._id &&(
                      <>
                        <CreateCommentComponent blogID={postlist?._id} userID={postlist?.userID} />
                      </>
                    )
                  }
                </div>
                <ModalComponent isVisible={showModal} onClose={() => setShowModal(false)}>
                  <PostModalComponent onClose={setShowModal} postID={showModal}/>
                </ModalComponent>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default SingleUserBlogListComponent;
