import React, { useEffect, useState } from 'react';
import { profileUrl } from "../../../utility/utility.js";
import UserStore from "../../../store/user-store.js";
import toast from "react-hot-toast";
import LoadingSkeleton from "../../../skeleton/loading-skeleton.jsx";
import CustomLoadingButton from "../../LoadingButton/CustomLoadingButton.jsx";
import { Link, useLocation } from "react-router-dom";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { IsEmpty, passwordValidation } from "../../../utility/Form-Validation.js";

const UpdateProfileComponent = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);
  const [confirmInput, setConfirmOnchange] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  const {
    profileList,
    profileListRequest,
    updateProfileInput,
    UpdateProfileOnchange,
    profileUpdateRequest,
    SingleProfileDetailsRequest,
    isLoading,
    setLoading
  } = UserStore();

  const [skeleton, setSkeleton] = useState("hidden");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const togglePasswordVisibility = () => {
    setShowPass(!showPass);
  };

  const togglePassword = () => {
    setShowCPass(!showCPass);
  };

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
    setSkeleton("block");

    const res = await profileUpdateRequest(formData);
    if (res === true) {
      await profileListRequest();
      await SingleProfileDetailsRequest();
      toast.success("Profile Updated Successfully");
    } else {
      toast.error("Failed to update profile");
    }

    setLoading(false);
    setSkeleton("hidden");
  };

  const onChangeHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImagePreview(URL.createObjectURL(selectedFile));
      setImageFile(selectedFile);
    }
  };

  const passwordHandler = async (e) => {
    e.preventDefault();

    if (IsEmpty(password)) {
      return setError("Password required");
    } else if (passwordValidation(password)) {
      return setError(passwordValidation(password));
    } else if (updateProfileInput.password !== confirmInput) {
      return setError("Passwords do not match");
    } else {
      const formData = new FormData();
      formData.append("password", password);
      setLoading(true);
      const res = await profileUpdateRequest(formData);
      setLoading(false);
      setError("")
      if (res === true) {
        setLoading(false);
        setError("")
        UpdateProfileOnchange("password", "")
        setConfirmOnchange("");
        toast.success("Password Updated Successfully");
      }
    }
  };

  useEffect(() => {
    (async () => {
      await SingleProfileDetailsRequest();
    })();
  }, []);

  return (
      <>
        <div className={skeleton}>
          <LoadingSkeleton />
        </div>

        <div className="w-[90%] md:w-[70%] lg:w-[70%] xl:w-[60%] mx-auto">
          <div className="my-10">
            <h1 className="text-[24px] font-bold">Edit Profile</h1>

            <div className="flex items-center gap-5 py-5">
              <Link
                  to="/profile/update/info"
                  className={`px-4 py-2 rounded ${currentPath === "/profile/update/info" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
              >
                Profile
              </Link>
              <Link
                  to="/profile/update/password"
                  className={`px-4 py-2 rounded ${currentPath === "/profile/update/password" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
              >
                Password
              </Link>
            </div>

            {currentPath === "/profile/update/info" ? (
                <div>
                  {profileList?.map((profile, i) => (
                      <div key={i}>
                        <div className="block md:flex items-center justify-between my-5 bg-white p-5 rounded shadow">
                          <div className="flex items-center gap-5">
                            <div className="w-[70px] h-[70px] rounded-full">
                              {imagePreview ? (
                                  <img className="w-[70px] h-[70px] rounded-full" src={imagePreview} alt="Preview" />
                              ) : (
                                  <img className="w-[70px] h-[70px] rounded-full" src={profile?.profile?.[0]?.profilePicture || profileUrl} alt="Profile" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{profile?.username}</p>
                              <p className="text-gray-700">{profile?.fullName}</p>
                            </div>
                          </div>
                          <div className="mt-3 lsm:mt-0">
                            <label htmlFor="fileInput" className="cursor-pointer px-5 text-white font-semibold py-2 bg-blue-400 rounded">
                              Choose File
                            </label>
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                onChange={onChangeHandler}
                                className="hidden"
                            />
                          </div>
                        </div>
                      </div>
                  ))}

                  {["fullName", "phone", "username", "profession", "address", "location"].map((id) => (
                      <div className="mb-5" key={id}>
                        <label className="font-bold" htmlFor={id}>{id.replace(/([A-Z])/g, ' $1')}</label>
                        <div className="mt-[10px] w-full bg-white py-2 border border-gray-300 rounded">
                          <input
                              className="w-full px-5 text-gray-700 bg-transparent outline-none"
                              type="text"
                              id={id}
                              value={updateProfileInput?.[id] || ""}
                              onChange={(e) => UpdateProfileOnchange(id, e.target.value)}
                          />
                        </div>
                      </div>
                  ))}

                  <div className="mb-5">
                    <label className="font-bold" htmlFor="bio">Bio</label>
                    <div className="mt-[10px] w-full bg-white py-2 border border-gray-300 rounded">
                  <textarea
                      className="w-full px-5 text-gray-700 bg-transparent outline-none resize-none"
                      rows={4}
                      maxLength={250}
                      id="bio"
                      value={updateProfileInput?.bio || ""}
                      onChange={(e) => UpdateProfileOnchange("bio", e.target.value)}
                  />
                      <p className="text-gray-300 text-end px-5">
                        {(updateProfileInput?.bio?.length || 0)} / 250
                      </p>
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="font-bold block mb-2">Gender</label>
                    <div className="flex gap-6">
                      {["Male", "Female", "Other"].map((gender) => (
                          <label key={gender} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value={gender}
                                checked={updateProfileInput?.gender === gender}
                                onChange={(e) => UpdateProfileOnchange("gender", e.target.value)}
                                className="accent-blue-600"
                            />
                            <span>{gender}</span>
                          </label>
                      ))}
                    </div>
                  </div>

                  <div className="text-end">
                    <CustomLoadingButton
                        text="Update Profile"
                        onClick={submitHandler}
                        isLoading={isLoading}
                    />
                  </div>
                </div>
            ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 transition">
                      <input
                          type={showPass ? "text" : "password"}
                          id="password"
                          className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
                          placeholder="Enter new password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                      <button type="button" onClick={togglePasswordVisibility} className="text-gray-500 hover:text-gray-800 focus:outline-none cursor-pointer">
                        {showPass ? <BiSolidShow size={20} /> : <BiSolidHide size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 transition">
                      <input
                          type={showCPass ? "text" : "password"}
                          id="confirmPassword"
                          className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
                          placeholder="Confirm new password"
                          value={confirmInput}
                          onChange={(e) => setConfirmOnchange(e.target.value)}
                      />
                      <button type="button" onClick={togglePassword} className="text-gray-500 hover:text-gray-800 focus:outline-none cursor-pointer">
                        {showCPass ? <BiSolidShow size={20} /> : <BiSolidHide size={20} />}
                      </button>
                    </div>
                  </div>

                  {error && <p className="text-red-500 mt-2">{error}</p>}

                  <div className="mt-5">
                    <CustomLoadingButton
                        text="Update Password"
                        onClick={passwordHandler}
                        isLoading={isLoading}
                    />
                  </div>
                </div>
            )}
          </div>
        </div>
      </>
  );
};

export default UpdateProfileComponent;