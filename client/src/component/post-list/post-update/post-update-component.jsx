import React, {useEffect, useRef, useState} from "react";
import BlogPostStore from "../../../store/post-list-store.js";
import toast from "react-hot-toast";
import { profileUrl } from "../../../utility/utility.js";
import gallaryIcon from "../../../../public/icons/Ivw7nhRtXyo.png";
import { BsEmojiGrin } from "react-icons/bs";
import UserStore from "../../../store/user-store.js";
import LoadingSkeleton from "../../../skeleton/loading-skeleton.jsx";
import EmojiPicker from "emoji-picker-react";

const PostUpdateComponent = ({ blogID, userID, onClose }) => {
  const {
    updateBLogInput,
    updateBlogOnchange,
    UpdatePostListRequest,
    singlePostListRequest,
    blogPostReadRequest,
    UserByBlogPostListRequest,
    UserBySingleListDetailsRequest,
  } = BlogPostStore();
  const { profileList } = UserStore();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState('hidden');
  const [emoji, setEmoji] = useState(false);
  const emojiRef = useRef(null);

  const updateHandler = async () => {
    const formData = new FormData();
    formData.append("title", updateBLogInput.title);
    if (imageFile) formData.append("image", imageFile);

    try {
      setLoading("block");
      const res = await UpdatePostListRequest(blogID, formData);
      if (res === true) {
        await blogPostReadRequest();
        await UserByBlogPostListRequest();
        await UserBySingleListDetailsRequest(userID);
        updateBlogOnchange("title", "");
        updateBlogOnchange("image", "");
        setImagePreview(null);
        setImageFile(null);
        onClose(false);
        toast.success("Post updated successfully!");
      } else {
        toast.error("Failed to update post!");
      }
    } catch (error) {
      toast.error("An error occurred during the update.");
      console.error("Update Error:", error);
    } finally {
      setLoading("hidden");
    }
  };

  const OnchangeHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImagePreview(URL.createObjectURL(selectedFile));
      setImageFile(selectedFile);
    }
  };

  useEffect(() => {
    (async () => {
      await singlePostListRequest(blogID);
    })();
  }, [blogID]);


  const EmojiHandler = () => setEmoji((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  return (
    <>
      <div className={loading}>
        <LoadingSkeleton />
      </div>
      <div className="bg-white p-4 rounded-lg z-50">
        {/* User Info Section */}
        {profileList?.map((profile, i) => (
          <div key={i} className="flex items-center space-x-4 mb-4">
            <img
              src={profile?.profile[0]?.profilePicture || profileUrl}
              alt="Profile"
              className="w-10 h-10 rounded-full object-contain"
            />
            <div>
              <h3 className="text-sm font-semibold">{profile?.user?.fullName}</h3>
              <select className="px-2 py-1 rounded-lg flex items-center border border-gray-500 space-x-1">
                <option value="public">Public</option>
                <option value="Friends">Friends</option>
                <option value="Only me">Only me</option>
              </select>
            </div>
          </div>
        ))}

        {/* Input Section */}
        <div className="mb-4">
          <textarea
            placeholder="What's on your mind?"
            className="w-full px-4 py-2 focus:outline-none border border-gray-200 rounded shadow resize-none overflow-hidden"
            rows="2"
            value={updateBLogInput.title}
            onChange={(e) => updateBlogOnchange("title", e.target.value)}
            onInput={(e) => {
              const maxHeight = 200; // Maximum height in pixels
              e.target.style.height = "auto"; // Reset height to calculate based on content
              if (e.target.scrollHeight > maxHeight) {
                e.target.style.height = `${maxHeight}px`; // Fix height to maxHeight
                e.target.style.overflowY = "scroll"; // Enable scrolling
              } else {
                e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height to content
                e.target.style.overflowY = "hidden"; // Disable scrolling when content fits
              }
            }}
            style={{
              maxHeight: "200px", // Prevent height from exceeding 200px
            }}
          />
        </div>

        {/* Image Preview */}
        <div>
          {imagePreview ? (
            <img
              className="w-full object-contain h-[250px] mx-auto"
              src={imagePreview}
              alt="Preview"
            />
          ) : updateBLogInput.image ? (
            <img
              className="w-full object-contain h-[250px] mx-auto"
              src={updateBLogInput.image}
              alt="Existing"
            />
          ) : null}
        </div>

        {/* Post Options */}
        <div className="border border-gray-400 py-2 px-3 rounded-md">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Add to your post</p>
            <div className="flex space-x-4">
              <div className="relative w-[30px] h-[30px] cursor-pointer">
                <input
                  id={"btn_image"}
                  onChange={OnchangeHandler}
                  type="file"
                  className="absolute top-0 left-0 w-full h-full rounded-full bg-black hidden z-50 cursor-pointer"
                />
                <label htmlFor={"btn_image"} className="absolute top-0 left-0 w-full h-full flex items-center cursor-pointer justify-center">
                  <img className="w-[30px] h-[30px]" src={gallaryIcon} alt="Gallery Icon"/>
                </label>
              </div>

              {/*-------EmojiPicker ----------*/}
              <div className="relative cursor-pointer" ref={emojiRef}>
                <button
                  onClick={EmojiHandler}
                  className="flex items-center justify-center text-[24px] text-yellow-500 cursor-pointer"
                >
                  <BsEmojiGrin/>
                </button>
                {emoji && (
                  <div className="absolute bottom-0 right-[40px] z-20">
                    <EmojiPicker
                      onEmojiClick={(emojiObject) =>
                        updateBlogOnchange("title", updateBLogInput.title + emojiObject.emoji)
                      }
                      width={500}
                      height={400}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Update Button */}
        <div className="mt-5">
          <button
            onClick={updateHandler}
            type="button"
            className="w-full bg-blue-400 py-2 text-white rounded-lg cursor-pointer"
          >
            Update Post
          </button>
        </div>
      </div>
    </>
  );
};

export default PostUpdateComponent;