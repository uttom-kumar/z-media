import React from 'react';

const MessengerComponent = () => {
  return (
    <div>
      <div className="flex h-screen">
        {/*-------------- Sidebar------------ */}
        <div className="w-[20%] md:w-[25%] bg-white p-4 border-r border-gray-200">
          <div className="flex items-center mb-4">
            <img
              alt="Profile picture of Erik Ten Hag"
              className="w-10 h-10 rounded-full mr-3"
              src="https://placehold.co/40x40"
            />
            <div className="hidden lg:block">
              <h2 className="font-bold">Erik Ten Hag</h2>
              <p className="text-sm text-gray-500">Info account</p>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <button className="flex-1 text-center py-2 border-b-2 border-blue-500">
              All Friends
            </button>
          </div>
          <div className="mb-4">
            <h3 className="text-gray-500 mb-2">All Message</h3>
            <div className="flex items-center p-2 bg-gray-100 rounded-lg mb-2">
              <img
                alt="Profile picture of Harry Maguire"
                className="w-10 h-10 rounded-full mr-3"
                src="https://placehold.co/40x40"
              />
              <div className="flex-1">
                <h4 className="font-bold">Harry Maguire</h4>
              </div>
            </div>
          </div>
        </div>
        {/*-------------- Chat Area ---------------*/}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
            <div className="flex items-center">
              <img
                alt="Group icon for United Family"
                className="w-10 h-10 rounded-full mr-3"
                src="https://placehold.co/40x40"
              />
              <div>
                <h2 className="font-bold">
                  United Family
                  <i className="fas fa-leaf text-green-500"></i>
                </h2>
                <p className="text-sm text-green-500">{"Rashford is typing..."}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
            <div className="text-center text-gray-500 mb-4">Today</div>
            <div className="flex items-start mb-4">
              <img
                alt="Profile picture of Harry Maguire"
                className="w-10 h-10 rounded-full mr-3"
                src="https://placehold.co/40x40"
              />
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="font-bold">
                  Uttom Kumar
                  <span className="text-xs text-gray-500"> 08:34 AM</span>
                </p>
                <p>
                  Hey lads, tough game yesterday. Let's talk about what went wrong and
                  how we can improve 😔.
                </p>
              </div>
            </div>
            <div className="flex items-start mb-4 gap-3 text-end justify-end">
              <div className="bg-green-200 p-3 rounded-lg shadow-sm">
                <p className="font-bold">
                  Jowel Rana
                  <span className="text-xs text-gray-500"> 08:34 AM</span>
                </p>
                <p>
                  Agreed, Harry 👍🏻. We had some good moments, but we need to be more
                  clinical in front of the goal 😔.
                </p>
              </div>
              <img
                alt="Profile picture of Bruno Fernandes"
                className="w-10 h-10 rounded-full mr-3"
                src="https://placehold.co/40x40"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessengerComponent;