import React, {useEffect, useState} from 'react';
import ReactCodeInput from "react-code-input";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import CustomLoadingButton from "../LoadingButton/CustomLoadingButton.jsx";
import userStore from "../../store/user-store.js";
const BaseURL = import.meta.env.VITE_BASE_URI;

const OtpConfirmComponent = () => {
  const {isLoading, setLoading} = userStore()
  const navigate = useNavigate();
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("");

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const email = sessionStorage.getItem("email");

  const SubmitButton = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      return setError("Please enter a valid 6-digit OTP.");
    }
    try{
      setLoading(true)
      const res = await axios.post(`${BaseURL}/RecoverVerifyOtp`,{ email, otp });
      if(res.data.status === "success"){
        setLoading(false)
        sessionStorage.setItem("otp",otp)
        navigate("/reset-password")
        toast.success("Verification Successfully");
      }
    }
    catch(err){
      setLoading(false)
      toast.error("Otp could not be recovered");
    }
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div>
      <div className="bg-gray-100 flex flex-col h-screen justify-center items-center ">
        <form onSubmit={SubmitButton} className=" bg-white border border-gray-200 p-6 rounded-lg shadow-md w-full max-w-sm">
          <h4 className="text-2xl font-semibold mb-2">OTP Verification</h4>
          <p className="text-gray-600 mb-4">Check your email & sent to 6 digits code</p>
          <div className="text-center">
            <ReactCodeInput
              onChange={handleOtpChange}
              inputMode={"numeric"} name={"otp"} type='text' fields={6}/>
          </div>
          <p className="text-[14px] text-red-600">{error}</p>
          <div className="text-center">
            <CustomLoadingButton
              text={'Submit'}
              onClick={SubmitButton}
              isLoading={isLoading}
              type={'submit'}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpConfirmComponent;