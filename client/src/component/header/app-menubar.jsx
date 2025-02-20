import bell_icon from '../../../public/icons/bell_Icon.svg'
import user_icon from '../../../public/icons/user_icon.svg'
import {Link} from "react-router-dom";
import userStore from "../../store/user-store.js";
import SettingModal from "../user-profile/settings/setting-modal.jsx";
import SettingModalComponent from "../user-profile/settings/setting-modal-component.jsx";
import React, {useState} from "react";
import {IoIosSettings} from "react-icons/io";

const AppMenubar = () => {
    const {profileList} = userStore()
    const [settingModal, setSettingModal] = useState(false)

    return (
      <div>
          <nav className="flex justify-between items-center px-4 py-2 bg-white border border-gray-200 shadow z-50">
              {/* Left Section - Logo */}
              <div className="flex items-center">
                  <Link to="/" className="text-2xl font-bold font-[cursive]">Z-Media</Link>
              </div>

              {/* Right Section - Icons */}
              <div className="flex items-center space-x-4">
                  {/* Add Icon */}
                  <Link to='/notifications'>
                      <img className="w-[25px]" src={bell_icon} alt="bell icon"/>
                  </Link>
                  {/* Heart Icon */}
                  {
                      profileList?.map((user, i) => (
                        <Link key={i} to={`/friends/${user?._id}`}>
                            <img className="w-[25px]" src={user_icon} alt="bell icon"/>
                        </Link>
                      ))
                  }
                  <div>
                      <button
                        className="cursor-pointer"
                        onClick={() => setSettingModal(true)}
                        type="button"
                      >
                          <IoIosSettings className="text-[26px]"/>
                      </button>
                  </div>
              </div>
          </nav>
          <div>
              <SettingModal isVisible={settingModal} onClose={() => setSettingModal(false)}>
                  <SettingModalComponent onClose={setSettingModal}/>
              </SettingModal>
          </div>
      </div>
    );
};

export default AppMenubar;