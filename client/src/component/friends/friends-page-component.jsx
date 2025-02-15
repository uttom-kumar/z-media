import React, { useState } from "react";
import GetMutualFriendComponent from "./get-mutual-friends/get-mutual-friend-component.jsx";
import AcceptFriendRequestComponent from "./accept-friend-request/accept-friend-request-component.jsx";
import GetAllSuggestedUser from "./suggested-user/get-all-suggested-user.jsx";
import GetFollowingComponent from "./getFollowing/get-following-component.jsx";

const FriendsPageComponent = () => {
  const [activeTab, setActiveTab] = useState("1");

  const tabs = [
    { id: "1", label: "All Friends" },
    { id: "2", label: "Following" },
    { id: "3", label: "Friend's Request" },
    { id: "4", label: "Suggested" }, // Fixed duplicate ID
  ];

  return (
    <div className="w-[90%] mx-auto">
      {/* Scrollable Tabs */}
      <div className="w-full flex border-b overflow-x-auto mt-5 bg-white ">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 min-w-[120px] text-center py-2 border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "border-black font-medium text-black"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "1" && <GetMutualFriendComponent />}
        {activeTab === "2" && <GetFollowingComponent />}
        {activeTab === "3" && <AcceptFriendRequestComponent />}
        {activeTab === "4" && <GetAllSuggestedUser />}
      </div>
    </div>
  );
};

export default FriendsPageComponent;
