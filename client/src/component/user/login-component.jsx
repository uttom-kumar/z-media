import React, { useEffect, useState } from "react";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import UserStore from "../../store/user-store.js";
import toast from "react-hot-toast";
import CustomLoadingButton from "../LoadingButton/CustomLoadingButton.jsx";

const LoginComponent = () => {
    const [showPass, setShowPass] = useState(false);
    const { loginInput, loginOnchange, loginRequest, isLoading, setLoading } = UserStore();
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);

    const togglePasswordVisibility = () => setShowPass(!showPass);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!loginInput.email || !loginInput.password) {
            if (!loginInput.email) return setError("Email is required");
            if (!loginInput.password) return setError("Password is required");
        }

        try {
            setLoading(true);
            const res = await loginRequest(loginInput);
            if (res.status === "success") {
                setLoading(false);
                localStorage.setItem("isUserLoggedIn", "true");
                loginOnchange("email", "");
                loginOnchange("password", "");
                navigate("/");

                if (rememberMe) {
                    localStorage.setItem("email", loginInput.email);
                    localStorage.setItem("password", loginInput.password);
                    localStorage.setItem("rememberMe", "true");
                } else {
                    localStorage.removeItem("email");
                    localStorage.removeItem("password");
                    localStorage.removeItem("rememberMe");
                }
            } else {
                setLoading(false);
                setError(res.message);
            }
        } catch (err) {
            setLoading(false);
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
        const timer = setTimeout(() => setError(""), 2000);
        return () => clearTimeout(timer);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row  overflow-hidden ">

                {/* Left Section */}
                <div className="hidden md:flex flex-col justify-center items-start w-1/2  text-black p-10">
                    <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                    <p className="text-lg opacity-90">
                        Z-Media helps you connect and share with the people in your life.
                    </p>
                </div>

                {/* Right Section - Form */}
                <div className="w-full md:w-1/2 p-8 bg-white shadow-lg rounded-lg">
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login to Your Account</h2>

                    <form onSubmit={submitHandler} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Email or Username</label>
                            <input
                                type="text"
                                value={loginInput.email}
                                onChange={(e) => loginOnchange("email", e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                placeholder="Enter your email"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                            <div className="flex items-center border rounded-lg overflow-hidden">
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={loginInput.password}
                                    onChange={(e) => loginOnchange("password", e.target.value)}
                                    className="w-full px-4 py-2 outline-none"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="cursor-pointer px-3 text-gray-600 hover:text-gray-900"
                                >
                                    {showPass ? <BiSolidHide size={20} /> : <BiSolidShow size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="accent-blue-600"
                                />
                                Remember Me
                            </label>
                            <Link to="/recover-email" className="text-sm text-blue-600 hover:underline">
                                Forgotten password?
                            </Link>
                        </div>

                        {/* Error */}
                        {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}

                        {/* Login Button */}
                        <CustomLoadingButton
                            text="Login"
                            onClick={submitHandler}
                            isLoading={isLoading}
                            type="submit"
                        />

                        {/*/!* Social Login *!/*/}
                        {/*<div className="flex flex-col gap-3 mt-4">*/}
                        {/*    <button className="flex items-center justify-center gap-2 border rounded-lg py-2 hover:bg-gray-50">*/}
                        {/*        <FcGoogle size={20} /> Continue with Google*/}
                        {/*    </button>*/}
                        {/*    <button className="flex items-center justify-center gap-2 border rounded-lg py-2 text-blue-600 hover:bg-blue-50">*/}
                        {/*        <FaFacebook size={20} /> Continue with Facebook*/}
                        {/*    </button>*/}
                        {/*</div>*/}
                    </form>

                    {/* Register */}
                    <p className="text-center mt-6 text-sm">
                        Don’t have an account?{" "}
                        <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;
