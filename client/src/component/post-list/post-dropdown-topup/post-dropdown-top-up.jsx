import React, {useState} from 'react';
import save_icon from "../../../../public/icons/save_icon.svg"
import {FaCheckCircle, FaLink} from "react-icons/fa";
import {MdDelete, MdModeEditOutline} from "react-icons/md";
import UserStore from "../../../store/user-store.js";
import PostUpdateModal from "../post-update/post-update-modal.jsx";
import PostUpdateComponent from "../post-update/post-update-component.jsx";
import PostListStore from "../../../store/post-list-store.js";
import toast from "react-hot-toast";

const PostDropdownTopUp = ({blogID,userID}) => {
  const [showModal, setShowModal] = useState(false)
  const {profileList} = UserStore()
  const{DeletePostListRequest , blogPostReadRequest, UserByBlogPostListRequest,UserBySingleListDetailsRequest,updateBLogInput,
    UpdatePostListRequest} = PostListStore()
  const [copy, setCopy] = useState(false)



  const postDeleteHandler = async () => {
    let res = await DeletePostListRequest(blogID)
    if(res===true){
      await blogPostReadRequest()
      await UserBySingleListDetailsRequest(userID)
      await UserByBlogPostListRequest()
      toast.success("delete success")
    }
    else {
      toast.error('delete failed')
    }
  }


  const copyLinkHandler = () => {
    const currentUrl = `${window.location.origin}/blogDetails/${blogID}`
    navigator.clipboard.writeText(currentUrl)
      .then(()=> {
        setCopy(true)
        toast.success('Link copied')
        setTimeout(() => setCopy(false), 2000);
      })
      .catch(() => toast.error('failed to copy Link'))
  }



  return (
    <div className="">
      <button className="w-full py-2 px-5 hover:bg-gray-100 -z-10 border-b border-gray-700 text-[16px]">
        <span className="flex items-center gap-2">
          <img className="w-[20px]" src={save_icon} alt=""/>Save Post
        </span>
      </button>
      <button
        onClick={()=>copyLinkHandler(blogID)}
        className="w-full py-2 px-5 hover:bg-gray-100  text-[16px] cursor-pointer">
              <span className="flex items-center gap-2">
                {copy ? (
                  <>
                    <FaCheckCircle className="text-green-400" /> Copied link
                  </>
                ) : (
                  <>
                    <FaLink /> Copy link
                  </>
                )}
              </span>
      </button>
      {
        userID === profileList[0]?._id && (
          <>
            <select
              value={updateBLogInput.role}
              onChange={async (e) => {
                await UpdatePostListRequest(blogID, {role: e.target.value})
                await aa()
              }}
              className="w-full py-2 px-5 ">
              <option value="">⚙️ Edit audience</option>
              <option value="public">🌍 Public</option>
              <option value="friends">👥 Friends</option>
              <option value="only me">🔒 Only Me</option>
            </select>

            <button
              onClick={() => setShowModal(true)}
              className="w-full py-2 px-5 hover:bg-gray-100 text-[16px] cursor-pointer ">
              <span className="flex items-center gap-2">
                <MdModeEditOutline/>Edit Post
              </span>
            </button>
            <button
              onClick={postDeleteHandler}
              className="w-full py-2 px-5 hover:bg-gray-100 text-[16px] cursor-pointer">
              <span className="flex items-center gap-2">
                <MdDelete/>Delete Post
              </span>
            </button>
          </>
        )
      }

      <div>
        <PostUpdateModal isVisible={showModal} onClose={() => setShowModal(false)}>
          <PostUpdateComponent blogID={blogID} userID={userID} onClose={setShowModal}/>
        </PostUpdateModal>
      </div>

    </div>
  );
};

export default PostDropdownTopUp;