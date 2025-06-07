import React, {useEffect, useState} from 'react';
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import toast from "react-hot-toast";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import userStore from "../../store/user-store.js";
import CustomLoadingButton from "../LoadingButton/CustomLoadingButton.jsx";
const BaseURL = import.meta.env.VITE_BASE_URI;

const ResetPasswordComponent = () => {
  const {isLoading, setLoading} = userStore()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const email = sessionStorage.getItem("email");
  const otp = sessionStorage.getItem("otp");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  };


  const passwordChange = (e) => {
    setPassword(e.target.value)
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/

    if(!password){
      return setError("Password is required")
    }
    if (!passwordRegex.test(password)) {
      return setError("Password must be at least 8 characters long, contain at least one uppercase letter, " +
        "one lowercase letter, " +
        "one number, and one special character.")
    }

    if(!confirmPassword){
      return setError("confirm Password is required")
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match")
    }

    try{
      setLoading(true);
      let res = await axios.post(`${BaseURL}/ResetPassword`,{email, otp, password})
      if(res.data.status==="success"){
        setLoading(false);
        navigate("/login")
        sessionStorage.removeItem("email")
        sessionStorage.removeItem("otp")
        toast.success("Password reset successfully")
      }
    }
    catch(err){
      setLoading(false);
      toast.error("Something went wrong");
    }

  };


  useEffect(() => {
    const timer = setTimeout(() => {
      setError("");
    }, 2000);
    return () => clearTimeout(timer);
  }, [error]);


  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 rounded-lg shadow-md w-full max-w-sm">
        <h4 className="text-2xl font-semibold mb-5">Reset Password</h4>

        <div>
          <label className="text-gray-600" htmlFor="password">Password</label>
          <div className="flex items-center gap-2 border border-gray-300 rounded px-2">
            <input
              id="password"
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
              className='w-full p-2 outline-0'
              onChange={passwordChange}
            />
            <button type="button" onClick={togglePasswordVisibility} className="text-gray-600 cursor-pointer">
              {showPassword ? <BiSolidHide /> : <BiSolidShow />}
            </button>
          </div>
        </div>

        <div className="mt-3">
          <label className="text-gray-600" htmlFor="confirmPassword">Confirm Password</label>
          <div className="flex items-center gap-2 border border-gray-300 rounded px-2">
            <input
              id="confirmPassword"
              placeholder="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              className='w-full p-2 outline-0'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="button" onClick={toggleConfirmPasswordVisibility} className="text-gray-600 cursor-pointer">
              {showConfirmPassword ? <BiSolidHide /> : <BiSolidShow />}
            </button>
          </div>
        </div>

        <p className="text-red-500 text-sm mt-2">{error}</p>

        <div className="text-center">
          <CustomLoadingButton
              text={'Reset Password'}
              onClick={handleSubmit}
              isLoading={isLoading}
              type={'submit'}
          />
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordComponent;
