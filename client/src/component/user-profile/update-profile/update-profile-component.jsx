import React, {useEffect, useState} from 'react';
import {profileUrl} from "../../../utility/utility.js";
import UserStore from "../../../store/user-store.js";
import toast from "react-hot-toast";
import LoadingSkeleton from "../../../skeleton/loading-skeleton.jsx";
import CustomLoadingButton from "../../LoadingButton/CustomLoadingButton.jsx";

const UpdateProfileComponent = () => {
  const {profileList, profileListRequest, updateProfileInput,UpdateProfileOnchange,profileUpdateRequest,
    SingleProfileDetailsRequest, isLoading, setLoading} = UserStore()
  const [skeleton, setSkeleton] = useState("hidden");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const submitHandler = async () => {
    const formData = new FormData();
    formData.append("bio", updateProfileInput.bio);
    formData.append("username", updateProfileInput.username);
    formData.append("fullName", updateProfileInput.fullName);
    formData.append("phone", updateProfileInput.phone);
    formData.append("gender", updateProfileInput.gender);
    formData.append("profession", updateProfileInput.profession);
    formData.append("location", updateProfileInput.location);
    formData.append("address", updateProfileInput.address); 
    if (imageFile) formData.append("image", imageFile);

    setLoading(true);
    setSkeleton('block');
    let res = await profileUpdateRequest(formData)
    if(res===true){
      await profileListRequest()
      await SingleProfileDetailsRequest()
      setLoading(false);
      setSkeleton('hidden');
      toast.success("Profile Updated Successfully")
    }
    else {
      setLoading(false)
      setSkeleton('hidden');
      toast.error("failed to update profile")
    }
  }

  const OnchangeHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImagePreview(URL.createObjectURL(selectedFile));
      setImageFile(selectedFile);
    }
  };


  useEffect(() => {
    (async () => {
      await SingleProfileDetailsRequest()
    })()
  },[])


  return (
    <>
      <div className={skeleton}>
        <LoadingSkeleton />
      </div>
      <div className="w-[90%] md:w-[70%] lg:w-[70%] xl:w-[60%] mx-auto">
        <div className="my-10">
          <h1 className="text-[24px] font-bold">Edit profile</h1>
          {/*form section*/}
          <div>
            {
              profileList?.map((profile, i) => {
                return (
                  <div key={i}>
                    <div className="block md:flex items-center justify-between my-5 bg-white p-5 rounded shadow">
                      <div className="flex items-center gap-5">
                        <div className="w-[70px] h-[70px] rounded-full">
                          {
                            imagePreview ? (
                              <img
                                className="w-[70px] h-[70px] rounded-full"
                                src={imagePreview}
                                alt="Preview"
                              />
                            ) : (
                              <img className="w-[70px] h-[70px] rounded-full"
                                   src={profile?.profile[0]?.profilePicture || profileUrl}
                                   alt="profilePicture"
                              />
                            )
                          }
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{profile?.username}</p>
                          <p className="text-gray-700">{profile?.fullName}</p>
                        </div>
                      </div>
                      <div className="  mt-3 lsm:mt-0">
                        <label htmlFor="fileInput"
                               className="cursor-pointer px-5 text-white font-semibold py-2 bg-blue-400 rounded">
                          Choose File
                        </label>
                        <input
                          id="fileInput"
                          type="file"
                          accept="image/*"
                          onChange={OnchangeHandler}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                )
              })
            }
            {/*---- full name section ---- */}
            <div className={"mb-5"}>
              <label className="font-bold" htmlFor="fullname">Full Name</label>
              <div className="mt-[10px] w-full bg-white py-2 outline-none border border-gray-300 rounded">
                <input
                  className="w-full px-5 text-gray-700 outline-none bg-transparent resize-none"
                  type="text"
                  id={"fullname"}
                  value={updateProfileInput?.fullName}
                  onChange={(e) => UpdateProfileOnchange("fullName", e.target.value)}
                />
              </div>
            </div>
            {/*---- full name section ---- */}
            <div className={"mb-5"}>
              <label className="font-bold" htmlFor="phone">Phone Number</label>
              <div className="mt-[10px] w-full bg-white py-2 outline-none border border-gray-300 rounded">
                <input
                  className="w-full px-5 text-gray-700 outline-none bg-transparent resize-none"
                  type="text"
                  id={"phone"}
                  value={updateProfileInput?.phone}
                  onChange={(e) => UpdateProfileOnchange("phone", e.target.value)}
                />
              </div>
            </div>
            {/*---- user name ----*/}
            <div className={"mb-5"}>
              <label className="font-bold" htmlFor="username">User Name</label>
              <div className="mt-[10px] w-full bg-white py-2 outline-none border border-gray-300 rounded">
                <input
                  className="w-full px-5 text-gray-700 outline-none bg-transparent resize-none"
                  type="text"
                  id={"username"}
                  value={updateProfileInput?.username}
                  onChange={(e) => UpdateProfileOnchange("username", e.target.value)}
                />
              </div>
            </div>
            {/*-----bio section -----*/}
            <div>
              <label className="font-bold" htmlFor="bio">Bio</label>
              <div className="mt-[10px] w-full bg-white py-2 outline-none border border-gray-300 rounded">
                    <textarea
                      className="w-full px-5 text-gray-700 outline-none bg-transparent resize-none"
                      rows={4}
                      id={"bio"}
                      maxLength={250}
                      value={updateProfileInput?.bio}
                      onChange={(e) => UpdateProfileOnchange("bio", e.target.value)}
                    />
                <p className="text-gray-300 text-end px-5">{updateProfileInput?.bio?.length} / 250</p>
              </div>
            </div>
            {/*--------gender section--------------*/}
            <div className="my-5 p-5 bg-white rounded">
              <h1 className="font-bold">Gender</h1>
              <div className="flex items-center gap-5">
                <p className="flex gap-1 items-center">
                  <input
                    className="cursor-pointer" type="radio" id="male" name="gender"
                    value="Male"
                    // checked={profile?.gender === 'Male'}
                    onChange={(e) => UpdateProfileOnchange("gender", e.target.value)}
                  />
                  <label className="cursor-pointer" htmlFor="male">Male</label>
                </p>
                <p className="flex gap-1 items-center">
                  <input
                    className="cursor-pointer" type="radio" id="Female" name="gender"
                    value="Female"
                    // checked={profile?.gender === 'Female'}
                    onChange={(e) => UpdateProfileOnchange("gender", e.target.value)}
                  />
                  <label className="cursor-pointer" htmlFor="Female">Female</label>
                </p>
                <p className="flex gap-1 items-center">
                  <input
                    className="cursor-pointer" type="radio" id="custom" name="gender"
                    value="Custom"
                    // checked={profile?.gender === 'Custom'}
                    onChange={(e) => UpdateProfileOnchange("gender", e.target.value)}
                  />
                  <label className="cursor-pointer" htmlFor="custom">Custom</label>
                </p>
              </div>
            </div>
            {/*---- profession section ------*/}
            <div className={"mb-5"}>
              <label className="font-bold" htmlFor={"profession"}>Profession</label>
              <div className="mt-[10px] w-full bg-white py-2 outline-none border border-gray-300 rounded">
                <input
                  className="w-full px-5 text-gray-700 outline-none bg-transparent resize-none"
                  type="text"
                  id={"profession"}
                  value={updateProfileInput?.profession}
                  onChange={(e) => UpdateProfileOnchange("profession", e.target.value)}
                />
              </div>
            </div>
            {/*---- profession section ------*/}
            <div className={"mb-5"}>
              <label className="font-bold" htmlFor={"address"}>Address</label>
              <div className="mt-[10px] w-full bg-white py-2 outline-none border border-gray-300 rounded">
                <input
                  className="w-full px-5 text-gray-700 outline-none bg-transparent resize-none"
                  type="text"
                  id={"address"}
                  value={updateProfileInput?.address}
                  onChange={(e) => UpdateProfileOnchange("address", e.target.value)}
                />
              </div>
            </div>
            {/*---- profession section ------*/}
            <div className={"mb-5"}>
              <label className="font-bold" htmlFor={"Location"}>Location</label>
              <div className="mt-[10px] w-full bg-white py-2 outline-none border border-gray-300 rounded">
                <input
                  className="w-full px-5 text-gray-700 outline-none bg-transparent resize-none"
                  type="text"
                  id={"Location"}
                  value={updateProfileInput?.location}
                  onChange={(e) => UpdateProfileOnchange("location", e.target.value)}
                />
              </div>
            </div>

            {/*-- submit button --*/}
            <div className="text-end">
             <CustomLoadingButton
              text={'Update Profile'}
              onClick={submitHandler}
              isLoading={isLoading}
             />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateProfileComponent;