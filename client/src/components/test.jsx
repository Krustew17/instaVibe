import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { GoPerson, GoPersonFill } from "react-icons/go";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { HiLockClosed } from "react-icons/hi";

const Test = () => {
    const [activeTab, setActiveTab] = useState("/");

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="md:border-r border-gray-200 dark:border-slate-800 md:pr-10 h-screen pl-6 lg:pr-10 md:pl-0 min-w-full md:min-w-0">
            <div className="lg:ml-[250px] md:ml-[70px]">
                <div className="flex flex-col gap-10 md:pl-6 lg:pl-10 mt-10 lg:text-xl">
                    <NavLink
                        to="profile/edit"
                        className="flex items-center gap-2 text-xl "
                        onClick={(e) => handleTabClick("/profile/edit")}
                    >
                        {activeTab === "/profile/edit" ? (
                            <GoPersonFill />
                        ) : (
                            <GoPerson />
                        )}
                        <span>Edit Profile</span>
                    </NavLink>
                    <NavLink
                        to="change-password"
                        className="flex items-center gap-2 text-xl "
                        onClick={(e) => handleTabClick("/change-password")}
                    >
                        {activeTab === "/change-password" ? (
                            <HiLockClosed />
                        ) : (
                            <HiOutlineLockClosed />
                        )}
                        <span>Change Password</span>
                    </NavLink>
                    <NavLink
                        to="settings"
                        className="flex items-center gap-2 text-xl "
                    >
                        Privacy
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default Test;
