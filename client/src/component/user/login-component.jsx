import React, {useEffect, useState} from 'react';
import loginImage from '../../../public/images/login.jpg';
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import {Link, useNavigate} from "react-router-dom";
import {FcGoogle} from "react-icons/fc";
import {FaFacebook} from "react-icons/fa";
import UserStore from "../../store/user-store.js";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import CustomLoadingButton from "../LoadingButton/CustomLoadingButton.jsx";

const LoginComponent = () => {
    const [showPass, setShowPass] = useState(false);
    const {loginInput, loginOnchange, loginRequest, isLoading, setLoading} = UserStore()
    const [error, setError] = useState("");
    const navigate = useNavigate()
    const [rememberMe, setRememberMe] = useState(false);


    const togglePasswordVisibility = () => {
        setShowPass(!showPass);
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!loginInput.email || !loginInput.password) {
            if (!loginInput.email) return setError("Email is required");
            if (!loginInput.password) return setError("Password is required");
        }

        try {
            setLoading(true)
            const res = await loginRequest(loginInput);
            if (res.status === "success") {
                setLoading(false)
                localStorage.setItem("isUserLoggedIn", 'true')
                loginOnchange("email", "");
                loginOnchange("password", "");
                navigate('/')
                // Save login details if "Remember Me" is checked
                if (rememberMe) {
                    setLoading(false)
                    localStorage.setItem("email", loginInput.email);
                    localStorage.setItem("password", loginInput.password);
                    localStorage.setItem("rememberMe", "true");
                } else {
                    setLoading(false)
                    localStorage.removeItem("email");
                    localStorage.removeItem("password");
                    localStorage.removeItem("rememberMe");
                }
            }
            else {
                setLoading(false)
                setError(res.message);
            }
        } catch (err) {
            setLoading(false)
            toast.error("Something went wrong!");
        }
    };

    useEffect(() => {
        const savedEmail = localStorage.getItem("email");
        const savedPassword = localStorage.getItem("password");
        const savedRememberMe = localStorage.getItem("rememberMe") === "true";

        if (savedRememberMe && savedEmail && savedPassword) {
            loginOnchange("email", savedEmail);
            loginOnchange("password", savedPassword);
            setRememberMe(true);
        }
    }, []);


    useEffect(() => {
        const timer = setTimeout(() => {
            setError("");
        }, 2000);
        return () => clearTimeout(timer);
    }, [error]);

    return (
        <div className="bg-white">
            <div className="container mx-auto">
                <div className="lg:flex gap-5 h-screen justify-center items-center w-full md:w-[60%] lg:w-[70%] mx-auto">
                    <div className="w-full lg:w-[50%] mx-auto order-2 lg:order-1">
                        <img src={loginImage} alt="image" />
                    </div>
                    <div className="w-full lg:w-[50%] order-1 lg:order-2 p-5">
                        <div className="p-5 md:p-10 rounded border border-gray-500">
                            <form onSubmit={submitHandler}>
                                {/* Email Input */}
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        id="email"
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder=""
                                        value={loginInput.email}
                                        onChange={(e) => {loginOnchange("email", e.target.value)}}
                                    />
                                    <label
                                        htmlFor="email"
                                        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600"
                                    >
                                        Email or Username
                                    </label>
                                </div>

                                <div className=" mb-6 flex items-center border-b-2 border-gray-300">
                                    <div className="relative z-0 w-full group">
                                        <input
                                            type={showPass ? "text" : "password"}
                                            id="password"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=""
                                            value={loginInput.password}
                                            onChange={(e) => {loginOnchange("password", e.target.value)}}
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
                                            className="text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer"
                                        >
                                            {showPass ? <BiSolidHide /> : <BiSolidShow />}
                                        </button>
                                    </div>
                                </div>
                                {/* Remember Me Checkbox */}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <input
                                          className="cursor-pointer"
                                          type="checkbox"
                                          id="rememberMe"
                                          checked={rememberMe}
                                          onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <label
                                          className="cursor-pointer text-[14px]"
                                          htmlFor="rememberMe"
                                        >
                                            Remember Me
                                        </label>
                                    </div>
                                </div>
                                <p className="text-red-600 mb-3">{error}</p>
                                <div>
                                    <CustomLoadingButton
                                        text='login'
                                        onClick={submitHandler}
                                        disabled={isLoading}
                                        type={'submit'}
                                    />
                                </div>
                            </form>
                            <div className="text-center mt-5">
                                <Link className="text-blue-500 text-[14px] hover:underline" to={`/recover-email`}>forgotten password?</Link>
                            </div>
                        </div>
                        <div className="my-5 p-5 rounded border border-gray-500 ">
                            <p>Don&#39;t Have an account?
                                <Link className="text-blue-400 font-bold" to={`/register`}> Register</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;
