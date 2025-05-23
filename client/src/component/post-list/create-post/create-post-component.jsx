import { useEffect, useRef, useState } from "react";
import UserStore from "../../../store/user-store.js";
import { profileUrl } from "../../../utility/utility.js";
import gallaryIcon from "../../../../public/icons/Ivw7nhRtXyo.png";
import { BsEmojiGrin } from "react-icons/bs";
import BlogPostStore from "../../../store/post-list-store.js";
import toast from "react-hot-toast";
import LoadingSkeleton from "../../../skeleton/loading-skeleton.jsx";
import EmojiPicker from "emoji-picker-react";
import {RiCloseLargeFill} from "react-icons/ri";

const CreatePostComponent = ({ onClose }) => {
  const { profileList } = UserStore();
  const {
    blogInput,
    blogOnchange,
    CreateBlogPostRequest,
    blogPostReadRequest,
    UserByBlogPostListRequest,
  } = BlogPostStore();

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState("hidden");
  const [emoji, setEmoji] = useState(false);
  const emojiRef = useRef(null);
  const [inputKey, setInputKey] = useState(Date.now());
  const [error, setError] = useState("");


  const CreatePostHandler = async () => {
    setLoading("block");

    // Validate role
    if (!blogInput.role) {
      setLoading("hidden");
      return setError("Role is required");
    }

    // Validate that at least one of title or imageFile is provided
    if (!blogInput.title && !imageFile) {
      setLoading("hidden");
      return setError("Either title or image is required");
    }

    // Clear error if all validations pass
    setError("");

    const formData = new FormData();
    formData.append("title", blogInput.title);
    formData.append("role", blogInput.role);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await CreateBlogPostRequest(formData);

      if (res === true) {
        await blogPostReadRequest();
        await UserByBlogPostListRequest();
        onClose(false);
        blogOnchange("title", "");
        blogOnchange("image", "");
        setImagePreview(null);
        toast.success("Post created successfully");
      } else {
        setLoading("hidden");
        toast.error("Failed to create post!");
      }
    } catch (err) {
      setLoading("hidden");
      toast.error("Failed to create post!");
    }
  };


  const OnchangeHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImagePreview(URL.createObjectURL(selectedFile));
      setImageFile(selectedFile);
    }
  };

  const cancelImageHandler = () => {
    setImagePreview(null);
    setImageFile(null);

    // Forcefully re-render the file input by updating the key
    setInputKey(Date.now());
  };

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setError("");
    }, 2000);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className="z-50">
      <div className={loading}>
        <LoadingSkeleton />
      </div>

      {/* User Info Section */}
      {profileList?.map((profile, i) => (
        <div key={i} className="flex items-center space-x-4 mb-4">
          <img
            src={profile?.profile[0]?.profilePicture || profileUrl}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="text-sm font-semibold">{profile?.user?.fullName}</h3>
            <select
              value={blogInput.role}
              onChange={(e)=> blogOnchange("role", e.target.value)}
              className="py-1 rounded-lg border border-gray-300 outline-0 px-5">
              <option value="">⚙️Select audience</option>
              <option value="public">🌍 Public</option>
              <option value="friends">👥 Friends</option>
              <option value="only me">🔒 Only me</option>
            </select>
          </div>
        </div>
      ))}

      {/* Input Section */}
      <div className="mb-4">
        <textarea
          placeholder="What's on your mind?"
          className="w-full px-4 py-2 rounded-lg border focus:outline-none resize-none overflow-y-auto"
          rows="3"
          value={blogInput.title}
          onChange={(e) => blogOnchange("title", e.target.value)}
          style={{ maxHeight: "200px" }}
          onInput={(e) => {
            const maxHeight = 200;
            e.target.style.height = "auto";
            if (e.target.scrollHeight > maxHeight) {
              e.target.style.height = `${maxHeight}px`;
              e.target.style.overflowY = "scroll";
            } else {
              e.target.style.height = `${e.target.scrollHeight}px`;
              e.target.style.overflowY = "hidden";
            }
          }}
        />
      </div>

      {/* Image Preview Section */}
      {imagePreview && (
        <div className="mb-4 relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full mx-auto object-contain h-[250px]"
          />
          <div className="absolute top-0 right-[20px]">
            <button
              onClick={cancelImageHandler}
              className="text-[20px] text-black p-2 bg-gray-300 rounded-full hover:bg-gray-400 duration-500">
              <RiCloseLargeFill />
            </button>
          </div>
        </div>
      )}

      {/* Post Options */}
      <div className="border border-gray-300 py-2 px-3 rounded-md">
        <div className="flex items-center justify-between">
          <p className="text-gray-400">Add to your post</p>
          <div className="flex space-x-4">
            {/* Image Upload */}
            <div className="relative w-[30px] h-[30px] cursor-pointer">
              <input
                id={"btn_image"}
                key={inputKey}
                onChange={OnchangeHandler}
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full rounded-full bg-black hidden  z-50 cursor-pointer"
              />
              <label htmlFor={"btn_image"} className="absolute inset-0 flex items-center justify-center cursor-pointer">
                <img className="w-[30px] h-[30px]" src={gallaryIcon} alt="Gallery Icon" />
              </label>
            </div>

            {/* Emoji Picker */}
            <div className="relative cursor-pointer" ref={emojiRef}>
              <button
                onClick={EmojiHandler}
                className="flex items-center justify-center text-[24px] text-yellow-500 cursor-pointer"
              >
                <BsEmojiGrin />
              </button>
              {emoji && (
                <div className="absolute -bottom-[30px] right-[25px] md:right-[40px] z-20">
                  <EmojiPicker
                    onEmojiClick={(emojiObject) =>
                      blogOnchange("title", blogInput.title + emojiObject.emoji)
                    }
                    width={250}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <p className="text-red-600 mt-2">{error}</p>

      {/* Submit Button */}
      <div className="mt-5">
        <button
          onClick={CreatePostHandler}
          type="button"
          className="w-full cursor-pointer bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CreatePostComponent;
