import React from 'react';
import {FaRegCircleUser} from "react-icons/fa6";

const GroupCreate = () => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar */}
        <div className="w-full lg:w-1/3 p-6">
          <div className="flex items-center mb-4">
            <i className="fab fa-facebook text-3xl text-blue-500"></i>
            <h1 className="ml-2 text-2xl font-bold">Create group</h1>
          </div>
          <div className="flex items-center mb-4">
            <img
              alt="User profile picture"
              className="rounded-full"
              height={40}
              src="https://storage.googleapis.com/a1aa/image/dGJfX2NfDFmIzf1pku9nHlj78-JmEq6xCedHp54i7iw.jpg"
              width={40}
            />
            <div className="ml-2">
              <p className="font-bold">Uttom Kumar</p>
              <p className="text-gray-600">Admin</p>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600" htmlFor="group-name">
              Group name
            </label>
            <input
              className="w-full p-2 bg-white border border-gray-300 rounded"
              id="group-name"
              type="text"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600" htmlFor="bio">
              bio
            </label>
            <input
              className="w-full p-2 bg-white border border-gray-300 rounded"
              id="bio"
              type="text"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600" htmlFor="invite-friends">
              Group Banner
            </label>
            <input
              className="w-full p-2 bg-white border border-gray-300 rounded cursor-pointer"
              id="invite-friends"
              type="file"
            />
          </div>
          <button className="w-full mt-4 p-2 bg-gray-300 text-gray-600 rounded cursor-pointer">
            Create
          </button>
        </div>
        {/* Right Content */}
        <div className="w-full lg:w-2/3 p-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-gray-600 mb-2">Desktop preview</h2>
            <img alt="Group cove"
                 className="w-full h-auto rounded mb-4 object-contain"
                 src="https://placehold.co/1640x856"
                 width={600}
                 height={300}
            />
            <div className="p-4 bg-gray-100 rounded">
              <h3 className="text-xl font-bold">{"Group name"}</h3>
              <p className="text-gray-600">Group privacy · 1 member</p>
              <div className="border-b border-gray-300 my-4"></div>
              <div className="flex space-x-4 mb-4">
                <p className="text-gray-600">
                  About
                </p>
                <p className="text-gray-600">
                  Posts
                </p>
                <p className="text-gray-600">
                  Members
                </p>
                <p className="text-gray-600">
                  Events
                </p>
              </div>
              <div className="flex items-center mb-4">
                <FaRegCircleUser className="text-[28px] text-gray-600" />
                <p
                  className="w-full ml-2 p-2 bg-white border border-gray-300 rounded text-gray-600"
                >What&#39;s on your mind?</p>
              </div>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                <button className="flex items-center p-2 bg-white border border-gray-300 rounded text-gray-600">
                  <i className="fas fa-photo-video mr-2"></i>
                  Photo/video
                </button>
                <button className="flex items-center p-2 bg-white border border-gray-300 rounded text-gray-600">
                  <i className="fas fa-user-tag mr-2"></i>
                  Tag people
                </button>
                <button className="flex items-center p-2 bg-white border border-gray-300 rounded text-gray-600">
                  <i className="fas fa-smile mr-2"></i>
                  Feeling/activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCreate;