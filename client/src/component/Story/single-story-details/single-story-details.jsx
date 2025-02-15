import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StoryStore from "../../../store/story-store.js";

const SingleStoryDetails = () => {
  const { storyID } = useParams();
  const navigate = useNavigate();
  const { singleStoryList, ReadSingleStoryRequest, nextStory, prevStory, getNextPreviousStoryRequest } = StoryStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    (async () => {
      await ReadSingleStoryRequest(storyID);
      await getNextPreviousStoryRequest(storyID);
    })();
  }, [storyID]);

  // Update index when storyList changes
  useEffect(() => {
    if (singleStoryList) {
      const newIndex = singleStoryList.findIndex((story) => story._id === storyID);
      if (newIndex !== -1) {
        setCurrentIndex(newIndex);
      }
    }
  }, [singleStoryList, storyID]);

  // Get current story based on index
  const currentStory = singleStoryList ? singleStoryList[currentIndex] : null;

  return (
    <div>
      {/*{singleStoryList === null ? (*/}
      {/*  <div>Loading...</div>*/}
      {/*) : (*/}
      {/*  <div className="w-[300px] lsm:w-[475px] h-[70vh] mx-auto relative" style={currentStory?.background ? { background: currentStory.background } : {}}>*/}
      {/*    <div className="w-full h-full flex flex-col justify-center items-center">*/}
      {/*      {currentStory?.imageUrl ? (*/}
      {/*        <div className="w-full h-screen shadow overflow-hidden">*/}
      {/*          <img className="w-full h-screen object-contain" src={currentStory?.imageUrl} alt="Story" />*/}
      {/*        </div>*/}
      {/*      ) : (*/}
      {/*        <div>*/}
      {/*          <p className="select-none">{currentStory?.text}</p>*/}
      {/*        </div>*/}
      {/*      )}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}
      <div>
        <div className="flex flex-col items-center justify-center h-screen">
          {/* Sad Face */}
          <div className="relative mb-6">
            <div className="text-[150px]">😢</div>
            <div className="absolute left-1/2 -translate-x-1/2 top-5">
              <div className="w-2 h-5 bg-blue-400 rounded-full animate-tear"></div>
            </div>
          </div>

          {/* Text Message */}
          <h1 className="text-4xl font-bold animate-bounce">Sorry Guys</h1>
          <h2 className="text-2xl mt-2 animate-bounce-slow">
            This page is not finished yet.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SingleStoryDetails;
