import React from 'react';
import {Link} from "react-router-dom";
import {HiFlag, HiUserGroup} from "react-icons/hi2";

const MoreButtonComponent = () => {
  return (
    <div>
      <div className="w-[300px] md:w-[500px] bg-white shadow border border-gray-200 rounded">
        <div className="mt-10 mb-5">
          <ul className="">
            <li className=" hover:bg-gray-100 border-b border-b-gray-300">
              <Link
                className="w-full py-4 flex flex-col items-center "
                to={`/create-group`}
              >
                <div className="flex gap-1 items-center">
                  <HiUserGroup />
                  Group
                </div>
              </Link>
            </li>
            <li className=" hover:bg-gray-100 border-b border-b-gray-300">
              <Link
                className="w-full py-4 flex flex-col items-center "
                to={`/create-page`}
              >
                <div className="flex gap-1 items-center">
                  <HiFlag />
                  Page
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MoreButtonComponent;