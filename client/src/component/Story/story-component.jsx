import React, {useEffect} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import { GoPlus } from "react-icons/go";
import userStore from "../../store/user-store.js";
import { profileUrl } from "../../utility/utility.js";
import StoryStore from "../../store/story-store.js";
import {Link} from "react-router-dom";
import StoryProfileSkeleton from "../../skeleton/story-profile-skeleton.jsx";
import StoryTextSkeleton from "../../skeleton/story-text-skeleton.jsx";

const SweetSlider = () => {
  const {profileList} = userStore();
  const {storyList, storyListRequest} = StoryStore()


  useEffect(() => {
    (async () => {
      await storyListRequest()
    })()
  }, []);


  return (
    <div className="w-full px-2 lsm:px-0 h-[180px] mx-auto flex gap-2">
      {/* Profile List Section */}
      <div className="relative w-[120px] h-[180px] bg-gray-800 rounded overflow-hidden">
        <Link to={`/story`} >
          {
            profileList===null? (<div><StoryProfileSkeleton /></div>):
              profileList?.map((profile, i) => (
                <div key={i} className="relative  text-center">
                  <img
                    className="w-full h-[130px] object-cover rounded"
                    src={profile?.profile[0]?.profilePicture || profileUrl}
                    alt={`Profile ${i}`}
                  />
                  <div className="absolute -bottom-[40px] left-0 right-0 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <GoPlus className="text-[24px] font-bold text-white" />
                      </div>
                    </div>
                    <p className="text-white text-sm">Create story</p>
                  </div>
                </div>
              ))}
        </Link>
      </div>

      {/* Swiper Section */}
      <Swiper
        navigation={true}
        modules={[Navigation, Pagination]}
        pagination={{clickable: false}}
        className="mySwiper"
        spaceBetween={6}
        slidesPerView={4}
        allowTouchMove={false}
        breakpoints={{
          100: {
            slidesPerView: 3,
            spaceBetween: 6,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 6,
          },
          768: {
            slidesPerView: 3,  // Adjusted for 3 slides on medium screen
            spaceBetween: 10,   // Adjusted space between slides
          },
          1024: {
            slidesPerView: 4,  // Adjusted for 4 slides on large screen
            spaceBetween: 10,   // Adjusted space between slides
          },
          1280: {
            slidesPerView: 5,  // Adjusted for 5 slides on extra-large screen
            spaceBetween: 10,   // Adjusted space between slides
          },
        }}
      >
        {
          storyList===null? (<div className="flex-1">loading...</div>):
            storyList?.slice()?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.map((story, i) => {
              return (
                <SwiperSlide
                  key={i}
                  className="cursor-pointer rounded bg-gray-800 relative text-white"
                  style={story?.background ? { background: story.background } : {}}
                >
                  <Link to={`/story/${story?._id}`} className="block w-full h-full">
                    <div className="w-full h-full flex flex-col justify-center items-center">
                      {story?.imageUrl ? (
                        <div className="w-full h-[180px] shadow bg-gray-800 rounded overflow-hidden">
                          <img src={story?.imageUrl} alt="storyImage" className="w-full h-[180px] rounded"/>
                        </div>
                      ) : (
                        <div>
                          <p className="text-[10px] text-white select-none ">{story?.text}</p>
                        </div>
                      )}
                      <div className="w-[40px] h-[40px] rounded-full absolute top-[10px] left-[10px]">
                        <img className="w-[40px] h-[40px] object-cover rounded-full" src={story?.profile?.profilePicture || profileUrl} alt="profileUrl" />
                      </div>
                      <div className="absolute bottom-[10px] left-[10px]">
                        <p className="text-[10px] font-semibold">{story?.user?.fullName}</p>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })
        }
      </Swiper>
    </div>
  );
};

export default SweetSlider;
