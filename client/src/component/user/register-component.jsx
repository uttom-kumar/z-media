import React, { useEffect, useState } from "react";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import UserStore from "../../store/user-store.js";
import toast from "react-hot-toast";
import { AiFillQuestionCircle } from "react-icons/ai";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import CustomLoadingButton from "../LoadingButton/CustomLoadingButton.jsx";

const RegisterComponent = () => {
    const [showPass, setShowPass] = useState(false);
    const [showCPass, setShowCPass] = useState(false);
    const [confirmInput, setConfirmOnchange] = useState("");
    const { registerInput, registerOnchange, RegisterRequest, isLoading, setLoading } = UserStore();
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const togglePasswordVisibility = () => setShowPass(!showPass);
    const togglePassword = () => setShowCPass(!showCPass);

    const submitHandler = async (e) => {
        e.preventDefault();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const usernameRegex = /^[A-Za-z][A-Za-z0-9_.]*$/;

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;

        if (!registerInput.fullName) return setError("Full Name is required");
        if (!registerInput.phone) return setError("Phone is required");
        if (!phoneRegex.test(registerInput.phone)) return setError("Please enter a valid phone number");
        if (!registerInput.email) return setError("Email is required");
        if (!emailRegex.test(registerInput.email)) return setError("Please enter a valid email address");
        if (!registerInput.username) return setError("Username is required");
        if (!usernameRegex.test(registerInput.username))
            return setError(
                "Username must start with a letter, be 3-7 characters long, and only contain letters, numbers, underscores, or hyphens."
            );
        if (!registerInput.password) return setError("Password is required");
        if (!passwordRegex.test(registerInput.password))
            return setError(
                "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
            );
        if (!registerInput.gender) return setError("Gender is required");
        if (!confirmInput) return setError("Confirm Password is required");
        if (registerInput.password !== confirmInput) return setError("Passwords do not match");

        try {
            setLoading(true);
            const res = await RegisterRequest(registerInput);
            if (res.status === "success") {
                setLoading(false);
                navigate("/login");
            } else {
                setLoading(false);
                setMsg(res.message);
            }
        } catch (err) {
            setLoading(false);
            toast.error("Something went wrong!");
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setMsg("");
            setError("");
        }, 5000);
        return () => clearTimeout(timer);
    }, [msg, error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 via-blue-50 to-gray-100 px-4 py-5">
            <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-8 md:p-10">
                {/* Header */}
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
                    Create Your Account
                </h1>

                {/* Form */}
                <form onSubmit={submitHandler} className="space-y-5">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={registerInput.fullName}
                            onChange={(e) => registerOnchange("fullName", e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
                        <PhoneInput
                            country={"bd"}
                            value={registerInput.phone}
                            onChange={(phone) => registerOnchange("phone", phone)}
                            inputStyle={{
                                width: "100%",
                                padding: "12px 45px",
                                fontSize: "14px",
                                borderRadius: "8px",
                            }}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            value={registerInput.email}
                            onChange={(e) => registerOnchange("email", e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            value={registerInput.username}
                            onChange={(e) => registerOnchange("username", e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder="Choose a username"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                            Gender <AiFillQuestionCircle />
                        </p>
                        <div className="flex gap-6">
                            {["Male", "Female", "Custom"].map((gender) => (
                                <label
                                    key={gender}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={gender}
                                        onChange={(e) => registerOnchange("gender", e.target.value)}
                                        className="accent-blue-600"
                                    />
                                    {gender}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Password</label>
                        <div className="flex items-center border rounded-lg overflow-hidden">
                            <input
                                type={showPass ? "text" : "password"}
                                value={registerInput.password}
                                onChange={(e) => registerOnchange("password", e.target.value)}
                                className="w-full px-4 py-2 outline-none"
                                placeholder="Enter password"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="px-3 text-gray-600 hover:text-gray-900"
                            >
                                {showPass ? <BiSolidHide /> : <BiSolidShow />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
                        <div className="flex items-center border rounded-lg overflow-hidden">
                            <input
                                type={showCPass ? "text" : "password"}
                                value={confirmInput}
                                onChange={(e) => setConfirmOnchange(e.target.value)}
                                className="w-full px-4 py-2 outline-none"
                                placeholder="Confirm password"
                            />
                            <button
                                type="button"
                                onClick={togglePassword}
                                className="px-3 text-gray-600 hover:text-gray-900"
                            >
                                {showCPass ? <BiSolidHide /> : <BiSolidShow />}
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    {msg && (
                        <p className="text-sm text-green-600 bg-green-50 p-2 rounded">
                            {msg}
                        </p>
                    )}
                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            {error}
                        </p>
                    )}

                    {/* Submit */}
                    <CustomLoadingButton
                        text="Create Account"
                        onClick={submitHandler}
                        isLoading={isLoading}
                        type="submit"
                    />
                </form>

                {/* Footer */}
                <p className="text-center mt-6 text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterComponent;
