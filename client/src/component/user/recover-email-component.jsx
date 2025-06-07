import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import userStore from "../../store/user-store.js";
import CustomLoadingButton from "../LoadingButton/CustomLoadingButton.jsx";
const BaseURL = import.meta.env.VITE_BASE_URI;

const RecoverEmailComponent = () => {
  const {isLoading, setLoading} = userStore()
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  }

  const SearchHandler = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    try {
      setLoading(true);
      let res = await axios.get(`${BaseURL}/RecoverEmailVerify/${email}`)
      if (res.data.status === "success") {
        setLoading(false);
        sessionStorage.setItem("email", email);
        navigate("/sent-otp");
        toast.success("Check your email for the verification code.");
      } else {
        setLoading(false);
        setError(res?.data?.message || "User not found");
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-2 text-center">Recover Your Email</h2>
        <p className="text-gray-600 mb-4 text-center">
          Enter your email address to receive a verification code.
        </p>
        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
        <input
          type="email"
          onChange={onEmailChange}
          placeholder="Enter your email address"
          className="w-full p-2 border border-gray-300 rounded mb-4 outline-none focus:border-blue-400"
        />
        <CustomLoadingButton
            text={'Send Verification Code'}
            onClick={SearchHandler}
            isLoading={isLoading}
            type={'button'}
        />
      </div>
    </div>
  );
};

export default RecoverEmailComponent;
