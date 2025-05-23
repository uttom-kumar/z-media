import React, {useEffect, useState} from 'react';
import {Link, NavLink} from "react-router-dom";
import { IoHomeOutline, IoHomeSharp } from "react-icons/io5";
import {FaSearch, FaUserFriends} from "react-icons/fa";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { FiPlusSquare } from "react-icons/fi";
import { BsMessenger} from "react-icons/bs";
import { PiMessengerLogo } from "react-icons/pi";
import {IoIosSettings, IoMdNotifications, IoMdNotificationsOutline} from "react-icons/io";
import UserStore from "../../store/user-store.js";
import {profileUrl} from "../../utility/utility.js";
import CreatePostModal from "../modal/create-post-modal.jsx";
import CreatePostComponent from "../post-list/create-post/create-post-component.jsx";
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import SettingModalComponent from "../user-profile/settings/setting-modal-component.jsx";
import SettingModal from "../user-profile/settings/setting-modal.jsx";
import {GoSearch} from "react-icons/go";
import {RiGroup2Fill} from "react-icons/ri";

const AppNavbar = () => {
    const {profileList, profileListRequest} = UserStore()
    const [showModal, setShowModal] = useState(false)
    const [settingModal, setSettingModal] = useState(false)
    useEffect(() => {
        (async () => {
            await profileListRequest()
        })()
    }, []);
    return (
        <div>
            <div className="hidden lg:block px-1 mt-10 ">
                <Link to={'/'} className="text-2xl font-bold font-[cursive]">Z-Media</Link>
            </div>
            <ul className="flex justify-between items-center lg:block">
                {/* Home */}
                <li className="lg:my-5">
                    <NavLink
                        to="/"
                        className={({isActive}) =>
                            `text-[18px] flex items-center rounded gap-1 px-2 lg:py-3 hover:bg-gray-100 ${isActive ? "font-bold" : "font-normal"}`
                        }
                    >
                        {({isActive}) => (
                            <>
                                {isActive ? <IoHomeSharp/> : <IoHomeOutline/>}
                                <span className="hidden lg:block">Home</span>
                            </>
                        )}
                    </NavLink>
                </li>

                {/* Explore */}
                <li className="lg:my-5">
                    <NavLink
                        to="/search"
                        className={({isActive}) =>
                            `text-[18px] flex items-center rounded gap-1 px-2 lg:py-3 hover:bg-gray-100 ${isActive ? "font-bold" : "font-normal"}`
                        }
                    >
                        {({isActive}) => (
                            <>
                                {isActive ? <FaSearch /> : <GoSearch />}
                                <span className="hidden lg:block">Search</span>
                            </>
                        )}
                    </NavLink>
                </li>

                {/* Friends */}
                <li className="hidden lg:block lg:my-5">
                    {profileList?.map((user, i) => (
                        <NavLink key={i}
                                 to={`/friends/${user?._id}`}
                                 className={({isActive}) =>
                                     `text-[18px] flex items-center rounded gap-1 px-2 lg:py-3 hover:bg-gray-100 ${isActive ? "font-bold" : "font-normal"}`
                                 }
                        >
                            {({isActive}) => (
                                <>
                                    {isActive ? <FaUserFriends/> : <LiaUserFriendsSolid/>}
                                    <span className="hidden lg:block">Friends</span>
                                </>
                            )}
                        </NavLink>
                    ))}

                </li>

                {/* Create Button */}
                <li className="lg:my-5">
                    <button
                        onClick={() => setShowModal(true)}
                        type="button"
                        className="text-[18px] w-full flex items-center rounded gap-1 px-2 py-3 hover:bg-gray-100 cursor-pointer"
                    >
                        <FiPlusSquare/>
                        <span className="hidden lg:block">Create</span>
                    </button>
                </li>
                <li className="hidden lg:block lg:my-5">
                    {profileList?.map((user, i) => (
                        <NavLink key={i}
                                 to={`/groups`}
                                 className={({isActive}) =>
                                     `text-[18px] flex items-center rounded gap-1 px-2 lg:py-3 hover:bg-gray-100 ${isActive ? "font-bold" : "font-normal"}`
                                 }
                        >
                            {({isActive}) => (
                                <>
                                    {isActive ? <RiGroup2Fill/> : <RiGroup2Fill/>}
                                    <span className="hidden lg:block">Group</span>
                                </>
                            )}
                        </NavLink>
                    ))}

                </li>

                {/* Messages */}
                <li className="lg:my-5">
                    <NavLink
                        to="/message"
                        className={({isActive}) =>
                            `text-[18px] flex items-center rounded gap-1 px-2 lg:py-3 hover:bg-gray-100 ${isActive ? "font-bold" : "font-normal"}`
                        }
                    >
                        {({isActive}) => (
                            <>
                                {isActive ? <BsMessenger/> : <PiMessengerLogo/>}
                                <span className="hidden lg:block">Messages</span>
                            </>
                        )}
                    </NavLink>
                </li>

                {/* Notifications */}
                <li className="hidden lg:block lg:my-5">
                    <NavLink
                        to="/notifications"
                        className={({isActive}) =>
                            `text-[18px] flex items-center rounded gap-1 px-2  lg:py-3 hover:bg-gray-100 ${isActive ? "font-bold" : "font-normal"}`
                        }
                    >
                        {({isActive}) => (
                            <>
                                {isActive ? <IoMdNotifications/> : <IoMdNotificationsOutline/>}
                                <span className="hidden lg:block">Notifications</span>
                            </>
                        )}
                    </NavLink>
                </li>

                {/* Profile */}
                <li className="lg:my-5">
                    <NavLink
                        to="/profile"
                        className={({isActive}) =>
                            `text-[18px] flex items-center justify-start rounded gap-1 px-2 lg:py-3 hover:bg-gray-100 ${isActive ? "font-bold" : "font-normal"}`
                        }
                    >
                        {
                            profileList === null ? (
                                <div>
                                    <SkeletonTheme baseColor="#ccc" highlightColor="#F8FAFC">
                                        <Skeleton style={{width: "40px", height: "40px", borderRadius: "50%"}}/>
                                    </SkeletonTheme>
                                </div>
                            ) : profileList?.map((profile, i) => {
                                return (
                                    <div key={i}>
                                        <img
                                            className="w-[40px] h-[40px] object-contain rounded-full bg-white"
                                            src={profile?.profile[0]?.profilePicture || profileUrl}
                                            alt="profile"
                                        />
                                    </div>
                                );
                            })
                        }
                        <span className="hidden lg:block">Profile</span>
                    </NavLink>
                </li>
                <li className="hidden lg:block lg:my-5">
                    <button
                        onClick={() => setSettingModal(true)}
                        type="button"
                        className="text-[18px] w-full flex items-center rounded gap-1 px-2 py-3 hover:bg-gray-100 cursor-pointer"
                    >
                        <IoIosSettings className="text-[24px]" />
                        <span className="hidden lg:block">Setting</span>
                    </button>
                </li>
            </ul>


            <div>
                <CreatePostModal isVisible={showModal} onClose={() => setShowModal(false)}>
                    <CreatePostComponent onClose={setShowModal}/>
                </CreatePostModal>
            </div>
            <div>
                <SettingModal isVisible={settingModal} onClose={() => setSettingModal(false)}>
                    <SettingModalComponent onClose={setSettingModal}/>
                </SettingModal>
            </div>
        </div>
    );
};

export default AppNavbar;
