import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import StoryStore from "../../../store/story-store.js";
import toast from "react-hot-toast";
import {RiCloseLargeFill} from "react-icons/ri";
import placeholder from '../../../../public/images/Placeholder.svg'
import LoadingSkeleton from "../../../skeleton/loading-skeleton.jsx";

const StoryPhotoEditor = ({onClose}) => {
  const navigate = useNavigate()
  const {createStoryRequest}= StoryStore()
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [inputKey, setInputKey] = useState(Date.now());
  const [loading, setLoading] = useState("hidden");


  const CreateStoryHandler = async () => {
    if (!imageFile) {
      return toast.error("Please enter your image!");
    }

    try {
      setLoading("block"); // Show loading before making the request

      let formData = new FormData();
      formData.append("imageUrl", imageFile);

      const res = await createStoryRequest(formData);

      if (res === true) {
        toast.success("Story successfully created!");
        navigate("/");
        onClose(false);
      } else {
        toast.error("Failed to create story!");
      }
    } catch (error) {
      console.error("Error creating story:", error);
      toast.error("An error occurred while creating the story!");
    } finally {
      setLoading("hidden");
    }
  }



  const onchangeHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImagePreview(URL.createObjectURL(selectedFile));
      setImageFile(selectedFile);
    }
  }

  const cancelImageHandler = () => {
    setImagePreview(null);
    setImageFile(null);
    // Forcefully re-render the file input by updating the key
    setInputKey(Date.now());
  }

  return (
    <div>
      <div className={loading}>
        <LoadingSkeleton />
      </div>
      <div className="w-[300px] md:w-[500px] mx-auto flex flex-col space-y-3">
        <div className="mx-auto">
          <input
            className={"hidden"}
            id={"fileBtn"}
            key={inputKey}
            type="file"
            accept="image/*"
            onChange={onchangeHandler}
          />
          <label htmlFor="fileBtn" className="px-10 py-2 bg-green-600 text-white font-semibold rounded cursor-pointer">Choose file Upload</label>
        </div>
        <div>
          {imagePreview === null ? (
            <div>
              <img className="w-[300px] md:w-[500px] h-[350px] object-cover" src={placeholder} alt=""/>
            </div>
          ) : (
            <div className="mb-4 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full mx-auto object-contain h-[350px]"
              />
              <div className="absolute top-[10px] right-[10px]">
                <button
                  onClick={cancelImageHandler}
                  className="text-[20px] text-black p-2 bg-gray-300 rounded-full hover:bg-gray-400 duration-500">
                  <RiCloseLargeFill/>
                </button>
              </div>
            </div>
          )}
        </div>
        <button
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded"
          onClick={CreateStoryHandler}
        >
          Create Story
        </button>
      </div>
    </div>
  );
};

export default StoryPhotoEditor;