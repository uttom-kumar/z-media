import React, {useEffect, useRef} from 'react';
import {profileUrl} from "../../../utility/utility.js";
import {FaLocationArrow} from "react-icons/fa";
import UserStore from "../../../store/user-store.js";
import toast from "react-hot-toast";
import CommentStore from "../../../store/comment-store.js";
import BlogPostStore from "../../../store/post-list-store.js";



const CreateCommentComponent = ({blogID, userID}) => {
  const inputRef = useRef(null);
  const{profileList, profileListRequest} = UserStore()
  const{blogPostReadRequest, UserBySingleListDetailsRequest} = BlogPostStore()
  const{commentInput, commentOnchange, CreateCommentRequest , commentListDetailsRequest} =CommentStore()


  const CreateCommentHandler = async (blogID) => {
    let response = await CreateCommentRequest({...commentInput, blogID})
    if(response=== true){
      await profileListRequest()
      await blogPostReadRequest()
      await commentListDetailsRequest(blogID)
      await UserBySingleListDetailsRequest(userID)
      commentOnchange("text", "")
      toast.success("Comment added successfully")
    }
    else {
      toast.error("something went wrong")
    }
  }



  const handleOutsideClick = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      if (commentInput?.text?.trim() !== "" ) {
        return;
      }
      commentOnchange("text", "");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);


  useEffect(() => {
    (async ()=>{
      await profileListRequest()
    })()
  }, []);



  return (
    <div ref={inputRef}>
      <div className="mt-5">
        <div className="flex items-center gap-2 p-3 rounded-lg w-full animate-fade-in">
          {
            profileList?.map((profile, i) => {
              return (
                <div key={i}>
                  <img
                    alt="User profile"
                    className="rounded-full w-[40px] h-[40px]"
                    src={profile?.profile[0]?.profilePicture || profileUrl}
                  />
                </div>
              )
            })
          }
          <textarea
            ref={inputRef}
            className="flex-grow outline-none scroll-hidden placeholder-gray-400 px-2 py-2 resize-none  border-b-2 border-gray-400"
            placeholder={`Comment as ${profileList?.map((item) => item?.fullName)}`}
            rows={1}
            onInput={(e) => {
              // Maximum height in pixels
              const maxHeight = 200;
              // Reset height to calculate based on content --
              e.target.style.height = "auto";
              if (e.target.scrollHeight > maxHeight) {
                e.target.style.height = `${maxHeight}px`; // Fix height to maxHeight
                e.target.style.overflowY = "scroll"; // Enable scrolling
              } else {
                e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height to content
                e.target.style.overflowY = "hidden"; // Disable scrolling when content fits
              }
            }}
            style={{
              maxHeight: "200px", // Safety: Prevent height from exceeding 200px
            }}
            value={commentInput?.text}
            onChange={(e) => {
              commentOnchange("text", e.target.value)
            }}
          />

          <button
            className="text-gray-400 hover:text-gray-700"
            ref={inputRef}
            onClick={() => CreateCommentHandler(blogID)}>
            <FaLocationArrow className="rotate-45"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCommentComponent;