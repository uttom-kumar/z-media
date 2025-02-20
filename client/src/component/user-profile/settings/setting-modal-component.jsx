import {Link, useNavigate} from "react-router-dom";
import UserStore from "../../../store/user-store.js";
import toast from "react-hot-toast";

const SettingModalComponent = ({onClose}) => {
  const { LogoutRequest } = UserStore();
  const navigate = useNavigate();

  const logOutHandler = async () => {
     let res = await LogoutRequest()

    if(res['status'] === "success"){
      navigate('/Login')
      toast.success("Log Out successfully")
    }
  }

  return (
    <div className="z-[999999999999">
      <ul className="flex flex-col text-center">
        <li className="">
          <Link to={`/profile/qr-code`} target={"_blank"} className="block w-full py-5 hover:bg-gray-100 duration-500 border-b border-gray-300">
            OR code
          </Link>
        </li>
        <li className="">
          <Link to={'/'} className="block w-full py-5 hover:bg-gray-200 duration-500  border-b border-gray-300">
            Setting and privacy
          </Link>
        </li>
        <li className="">
          <Link onClick={()=>onClose(false)} to={`/profile/update`} className="block w-full py-5 hover:bg-gray-200 duration-500  border-b border-gray-300">
            Update Profile
          </Link>
        </li>
        <li className="">
          <Link to={'/'} className="block w-full py-5 hover:bg-gray-200 duration-500  border-b border-gray-300">
            Meta Verification
          </Link>
        </li>
        <li className="">
          <Link to={'/'} className="block w-full py-5 hover:bg-gray-200 duration-500  border-b border-gray-300">
            Login activity
          </Link>
        </li>
        <li className="">
          <Link to={'/'} className="block w-full py-5 hover:bg-gray-200 duration-500  border-b border-gray-300"
            onClick={logOutHandler}
          >
            Log Out
          </Link>
        </li>
        <li className="">
          <button
            onClick={()=>onClose(false)}
                  className="block w-full cursor-pointer py-5 hover:bg-gray-200 duration-500  border-b border-gray-300">
            cancel
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SettingModalComponent;