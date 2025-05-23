import React, {useEffect, useState} from 'react';
import loginImage from '../../../public/images/register.jpg';
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import {Link, useNavigate} from "react-router-dom";
import UserStore from "../../store/user-store.js";
import toast from "react-hot-toast";
import {AiFillQuestionCircle} from "react-icons/ai";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import CustomLoadingButton from "../LoadingButton/CustomLoadingButton.jsx";





const RegisterComponent = () => {
    const [showPass, setShowPass] = useState(false);
    const [showCPass, setShowCPass] = useState(false);
    const [confirmInput, setConfirmOnchange] = useState("");
    const {registerInput, registerOnchange, RegisterRequest , isLoading, setLoading} = UserStore()
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate()




    const togglePasswordVisibility = () => {
        setShowPass(!showPass);
    };
    const togglePassword = () => {
        setShowCPass(!showCPass);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{1,14}[a-zA-Z0-9]$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;

        if (!registerInput.fullName) return setError("Full Name is required");
        if (!registerInput.phone) return setError("Phone is required");
        if (!phoneRegex.test(registerInput.phone)) return setError("Please enter a valid phone number");
        if (!registerInput.email) return setError("Email is required");
        if (!emailRegex.test(registerInput.email)) return setError("Please enter a valid email address");
        if (!registerInput.username) return setError("Username is required");
        if (!usernameRegex.test(registerInput.username)) return setError("Username must start with a letter, be 3-16 characters long, and only contain letters, numbers, underscores, or hyphens.");
        if (!registerInput.password) return setError("Password is required");
        if (!passwordRegex.test(registerInput.password)) return setError("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
        if (!registerInput.gender) return setError("Gender is required");
        if (!confirmInput) return setError("Confirm Password is required");
        if (registerInput.password !== confirmInput) return setError("Passwords do not match");



        try {
            setLoading(true)
            const res = await RegisterRequest(registerInput);
            if (res.status === "success") {
                setLoading(false)
                navigate("/login");
            } else {
                setLoading(false)
                setMsg(res.message);
            }
        } catch (err) {
            setLoading(false)
            toast.error("Something went wrong!");
        }
    };



    useEffect(() => {
        const timer = setTimeout(() => {
            setMsg(""); // Clear the message after 2 seconds
        }, 5000);

        return () => clearTimeout(timer);
    }, [msg, error]);


    return (
        <div className="bg-white">
            <div className="container mx-auto">
                <div className="lg:flex gap-5 h-screen justify-center items-center w-full md:w-[60%] lg:w-[70%] mx-auto">
                    <div className="w-full lg:w-[50%] mx-auto order-2 lg:order-1">
                        <img src={loginImage} alt="image" />
                    </div>
                    <div className="w-full lg:w-[50%] order-1 lg:order-2 p-5">
                        <div className="p-5 md:p-10 rounded border border-gray-500">
                            <h1 className="font-semibold text-center text-xl text-blue-400 mb-6">Register now</h1>
                            <form onSubmit={submitHandler}>
                                {/* Email Input */}
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                      type="text"
                                      id="email"
                                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                      placeholder=""
                                      value={registerInput.fullName}
                                      onChange={(e) => {
                                          registerOnchange("fullName", e.target.value)
                                      }}
                                    />
                                    <label
                                      htmlFor="email"
                                      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600"
                                    >
                                        Enter Full Name
                                    </label>
                                </div>
                                <div className="mb-5">
                                    <label
                                      htmlFor="phone"
                                      className="block mb-[5px] text-gray-700"
                                    >
                                        Phone Number
                                    </label>
                                    <PhoneInput
                                      enableAreaCodes={true}
                                      country={'bd'}
                                      value={registerInput.phone}
                                      onChange={(phone) => registerOnchange("phone", phone)}
                                      inputStyle={{width: '100%', padding: '20px 43px', fontSize: '14px'}}
                                    />
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                      type="text"
                                      id="email"
                                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                      placeholder=""
                                      value={registerInput.email}
                                      onChange={(e) => {
                                          registerOnchange("email", e.target.value)
                                      }}
                                    />
                                    <label
                                      htmlFor="email"
                                      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600"
                                    >
                                        Email Address
                                    </label>
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                      type="text"
                                      id="email"
                                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                      placeholder=""
                                      value={registerInput.username}
                                      onChange={(e) => {
                                          registerOnchange("username", e.target.value)
                                      }}
                                    />
                                    <label
                                      htmlFor="email"
                                      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600"
                                    >
                                        Enter Username
                                    </label>
                                </div>
                                <div className="mb-6">
                                    <p
                                      className="text-[12px] text-gray-400 flex items-center">gender<AiFillQuestionCircle/>
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <input type="radio" id={'male'} className="cursor-pointer"
                                                   name={'gender'}
                                                   value={"Male"}
                                                   onChange={(e) => {
                                                       registerOnchange("gender", e.target.value)
                                                   }}
                                            />
                                            <label htmlFor="male" className="cursor-pointer">Male</label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="radio" id={'Female'} className="cursor-pointer"
                                                   name={'gender'}
                                                   value={registerInput.gender}
                                                   onChange={(e) => {
                                                       registerOnchange("gender", e.target.value)
                                                   }}
                                            />
                                            <label htmlFor="Female" className="cursor-pointer">Female</label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="radio" id={'Custom'} className="cursor-pointer"
                                                   name={'gender'}
                                                   value={registerInput.gender}
                                                   onChange={(e) => {
                                                       registerOnchange("gender", e.target.value)
                                                   }}
                                            />
                                            <label htmlFor="Custom" className="cursor-pointer">Custom</label>
                                        </div>
                                    </div>
                                </div>
                                <div className=" mb-6 flex items-center border-b-2 border-gray-300">
                                    <div className="relative z-0 w-full group">
                                        <input
                                          type={showPass ? "text" : "password"}
                                          id="password"
                                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                          placeholder=""
                                          value={registerInput.password}
                                          onChange={(e) => {
                                              registerOnchange("password", e.target.value)
                                          }}
                                        />
                                        <label
                                          htmlFor="password"
                                          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600"
                                        >
                                            Password
                                        </label>
                                    </div>
                                    <div className="ml-3">
                                        <button
                                          type="button"
                                          onClick={togglePasswordVisibility}
                                          className="text-gray-600 hover:text-gray-900 focus:outline-none"
                                        >
                                            {showPass ? <BiSolidShow/> : <BiSolidHide/>}
                                        </button>
                                    </div>
                                </div>
                                <div className=" mb-6 flex items-center border-b-2 border-gray-300">
                                    <div className="relative z-0 w-full group">
                                        <input
                                          type={showCPass ? "text" : "password"}
                                          id="password"
                                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                          placeholder=""
                                          value={confirmInput}
                                          onChange={(e) => {
                                              setConfirmOnchange(e.target.value)
                                          }}
                                        />
                                        <label
                                          htmlFor="password"
                                          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600"
                                        >
                                            Confirm Password
                                        </label>
                                    </div>
                                    <div className="ml-3">
                                        <button
                                          type="button"
                                          onClick={togglePassword}
                                          className="text-gray-600 hover:text-gray-900 focus:outline-none"
                                        >
                                            {showCPass ? <BiSolidShow/> : <BiSolidHide/>}
                                        </button>
                                    </div>
                                </div>
                                <p className="text-red-600 text-[12px]">{msg}</p>
                                <p className="text-red-600 mb-3 text-[12px]">{error}</p>
                                <div>
                                    <CustomLoadingButton
                                        text='Create Account'
                                        onClick={submitHandler}
                                        disabled={isLoading}
                                        type={'submit'}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="my-5 p-5 rounded border border-gray-500 ">
                            <p>I Have already account?
                                <Link className="text-blue-400 font-bold" to={`/login`}> Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterComponent;
