import React, { useState } from "react";
import "../../../assets/css/index.css";
import StoryStore from "../../../store/story-store.js";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

const backgrounds = [
  "linear-gradient(45deg, #ff9a9e, #fad0c4)",
  "linear-gradient(45deg, #a18cd1, #fbc2eb)",
  "linear-gradient(45deg, #fad0c4, #ffd1ff)",
  "linear-gradient(45deg, #ff9a9e, #fecfef)",
  "linear-gradient(45deg, #a1c4fd, #c2e9fb)"
];

const StoryEditor = () => {
  const {storyInput, storyOnchange, createStoryRequest}= StoryStore()
  const [fontStyle, setFontStyle] = useState("normal");
  const [bg, setBg] = useState(backgrounds[0]);
  const navigate = useNavigate()

  const onChangeHandler = (e) => {
    setBg(e);
    storyOnchange("background", e);
  }

  const CreateStoryHandler = async () => {
    if (!storyInput.text){
      return toast.error("Please enter your story!");
    }
    let res = await createStoryRequest(storyInput)
    if(res===true){
      storyOnchange("text", "")
      navigate("/")
      toast.success('Story successfully Created')
    }
    else {
      toast.error("Friend request failed")
    }
  }

  return (
    <div className="w-[300px] md:w-[400px] mx-auto my-5">
      <div className="flex flex-col h-screen space-y-3 justify-center items-center overflow-y-auto">
        <div className="">
          <textarea
            id="textBtn"
            className="border border-gray-300 w-[300px] md:w-[400px] p-3"
            placeholder="Type your story..."
            rows={4}
            value={storyInput.text}
            maxLength={500}
            onChange={(e) => storyOnchange("text",e.target.value)}
          />
          <p className="text-end">Story text length {storyInput.text?.length}/500</p>
          <div className="my-3">
            <select
              className="w-full py-2 px-5 border border-gray-300 rounded-md text-sm leading-tight "
              onChange={(e) => setFontStyle(e.target.value)}>
              <option value="">Choose text</option>
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="italic">Italic</option>
            </select>
          </div>
          <div className="flex gap-2">
            {backgrounds.map((b, index) => (
              <button
                className="w-[40px] h-[40px] rounded"
                key={index}
                style={{background: b}}
                onClick={() => onChangeHandler(b)}
              ></button>
            ))}
          </div>
        </div>
        <div className="w-full h-[400px] flex flex-col items-center justify-center overflow-hidden overflow-y-auto p-4" style={{background: bg}}>
          <label className="text-white" htmlFor="textBtn" style={{
            fontWeight: fontStyle === "bold" ? "bold" : "normal",
            fontStyle: fontStyle === "italic" ? "italic" : "normal"
          }}>
            {storyInput.text || "Start typing..."}
          </label>
        </div>
        <div>
          <button
            onClick={CreateStoryHandler}
            className="px-10 w-full py-2 bg-blue-600 text-white font-semibold rounded"
          >
            Create Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryEditor;
