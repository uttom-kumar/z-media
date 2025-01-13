import { useState} from 'react';
import loginImage from '../../../public/images/register.jpg';
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import {Link, useNavigate} from "react-router-dom";
import UserStore from "../../store/user-store.js";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const RegisterComponent = () => {
    const [showPass, setShowPass] = useState(false);
    const [showCPass, setShowCPass] = useState(false);
    const [confirmInput, setConfirmOnchange] = useState("");
    const {registerInput, registerOnchange, RegisterRequest } = UserStore()
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

        // if(!registerInput.fullName || !registerInput.email  || !registerInput.username || !registerInput.password || !confirmInput ){
        //     return  setError("all fields is required");
        // }
        if (!registerInput.fullName) return setError("Full Name is required");
        if (!registerInput.email) return setError("Email is required");
        if (!registerInput.username) return setError("Username is required");
        if (!registerInput.password) return setError("Password is required");
        if (!confirmInput) return setError("Confirm Password is required");
        if (registerInput.password !== confirmInput) return setError("Passwords do not match");
        try {
            const res = await RegisterRequest(registerInput);
            if (res.status === "success") {
                Cookies.set("Token", res.token)
                navigate("/");
                registerOnchange("email", "");
                registerOnchange("password", "");
            } else {

                setError(res.message);
            }
        } catch (err) {
            toast.error("Something went wrong!");
        }
    };




    return (
        <div>
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
                                                setConfirmOnchange( e.target.value)
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
                                <p className="text-red-600 mb-3">{error}</p>
                                <div>
                                    <button type="submit" className="w-full bg-blue-400 py-2 rounded text-white">
                                        Register
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="my-5 p-5 rounded border border-gray-500 ">
                            <p>I Have already account?
                                <Link className="text-blue-400 font-bold" to={'/login'}> Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterComponent;
