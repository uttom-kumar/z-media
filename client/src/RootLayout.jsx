import React from 'react';
import AppNavbar from "./component/header/app-navbar.jsx";
import AppMenubar from "./component/header/app-menubar.jsx";

const RootLayout = ({ children }) => {
    return (
        <>
            <div className="fixed top-0 left-0 right-0 block lg:hidden z-50">
                <AppMenubar />
            </div>
            <div className="flex flex-col gap-5 my-10 lg:my-0  lg:flex-row h-screen">
                {/* Left Side (Navbar) */}
                <div
                    className="z-50 fixed bg-white lg:relative right-0 -bottom-1 lg:bottom-auto lg:h-screen w-full lg:w-[20%] py-2 px-5 shadow-lg"
                    style={{ boxShadow: '0 -2px 2px rgba(0, 0, 0, 0.3)' }}
                >
                    <AppNavbar/>
                </div>


                {/* Right Side (Main Content) */}
                <div className="flex-1 overflow-y-auto scrollbar-thin ">
                    {children}
                </div>
            </div>
        </>
    );
};

export default RootLayout;
