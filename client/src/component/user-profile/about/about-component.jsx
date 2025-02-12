import React from 'react';
import userStore from "../../../store/user-store.js";

const AboutComponent = () => {
  const {profileList} = userStore()
  return (
    <div>
      {
        profileList?.map((profile, i) => {
          return (
            <div key={i}>
              <h1 className="text-[24px] text-gray-700 font-semibold">Personal Information</h1>
              <div className="my-5">
                <p className="flex gap-10 my-4">
                  <span className="font-semibold text-gray-700 w-[100px]">Full Name :</span>
                  <span className="text-gray-600 flex-1">{profile?.fullName}</span>
                </p>
                <p className="flex gap-10 my-4">
                  <span className="font-semibold text-gray-700 w-[100px]">Phone :</span>
                  <span className="text-gray-600 flex-1">{profile?.phone}</span>
                </p>
                <p className="flex gap-10 my-4">
                  <span className="font-semibold text-gray-700 w-[100px]">Profession :</span>
                  <span className="text-gray-600 flex-1">{profile?.profile[0]?.profession}</span>
                </p>
                <p className="flex gap-10 my-4">
                  <span className="font-semibold text-gray-700 w-[100px]">Bio :</span>
                  <span className="text-gray-600 flex-1">{profile?.profile[0]?.bio}</span>
                </p>
                <p className="flex gap-10 my-4">
                  <span className="font-semibold text-gray-700 w-[100px]">Location :</span>
                  <span className="text-gray-600 flex-1">{profile?.profile[0]?.location}</span>
                </p>
                <p className="flex gap-10 my-4">
                  <span className="font-semibold text-gray-700 w-[100px]">Address :</span>
                  <span className="text-gray-600 flex-1">{profile?.profile[0]?.address}</span>
                </p>
              </div>
            </div>
          )
        })
      }
    </div>
  );
};

export default AboutComponent;