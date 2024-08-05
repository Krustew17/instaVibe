import { PiHouse, PiHouseFill } from "react-icons/pi";
import { FaMessage } from "react-icons/fa6";
import { FaCirclePlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { FaRegMessage } from "react-icons/fa6";
import { IoNotificationsOutline, IoNotificationsSharp } from "react-icons/io5";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { CiCirclePlus } from "react-icons/ci";
import { useSelector } from "react-redux";

import { NavLink, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function Nav() {
    const [activeTab, setActiveTab] = useState(".");
    const navigate = useNavigate();
    const [isDarkMode, setisDarkMode] = useState(true);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user);

    const handleNavClick = (path) => {
        setActiveTab(path);
    };

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle("dark");
        setisDarkMode(!isDarkMode);
    };

    useEffect(() => {
        setActiveTab(window.location.pathname);
    }, [window.location.pathname]);

    return (
        <div className="h-screen">
            <div
                className="bg-white dark:bg-black md:w-[70px] w-full justify-between px-5 cxs:px-16 lg:w-[250px] dark:text-white fixed md:h-screen border-t-2 h-[50px] bottom-0 z-50
            md:overflow-auto flex md:flex-col md:pl-6 md:pr-5 md:gap-8 text-3xl list-none md:border-r-[2px] border-slate-200 dark:border-slate-900 select-none"
            >
                <h1 className="text-2xl mt-6 font-Pacifico mb-10 absolute md:relative">
                    <span className="hidden lg:block">instaVibe</span>
                    <img
                        src="/instaVibe.png"
                        className="lg:hidden hidden md:block dark:text-white md:h-6 md:w-6 dark:invert"
                    />
                </h1>

                <NavLink
                    to="/"
                    className={`flex gap-4 items-center text-customBase
                    ${activeTab === "/" ? "font-semibold" : ""}`}
                    onClick={() => handleNavClick("/")}
                >
                    {activeTab === "/" ? (
                        <PiHouseFill className="text-2xl" />
                    ) : (
                        <PiHouse className="text-2xl" />
                    )}
                    <span className="hidden lg:block">Home</span>
                </NavLink>
                <NavLink
                    to="/search"
                    className={`hidden md:flex gap-4 items-center text-customBase
                    ${activeTab === "/search" ? "font-semibold" : ""}`}
                    onClick={() => handleNavClick("/search")}
                >
                    {activeTab === "/search" ? (
                        <FaSearch className="text-2xl" />
                    ) : (
                        <IoSearchOutline className="text-2xl" />
                    )}
                    <span className="hidden lg:block">Search</span>
                </NavLink>
                <NavLink
                    to="/chat"
                    className={`flex gap-4 items-center text-customBase list-none
                    ${activeTab === "/chat" ? "font-semibold" : ""}`}
                    onClick={() => handleNavClick("/chat")}
                >
                    {" "}
                    {activeTab === "/chat" ? (
                        <FaMessage className="text-xl" />
                    ) : (
                        <FaRegMessage className="text-xl" />
                    )}
                    <span className="hidden lg:block">Messages</span>
                </NavLink>
                <NavLink
                    to="/notifications"
                    className={`flex gap-4 items-center text-customBase 
                    ${activeTab === "/notifications" ? "font-semibold" : ""}`}
                    onClick={() => handleNavClick("/notifications")}
                >
                    {" "}
                    {activeTab === "/notifications" ? (
                        <IoNotificationsSharp
                            style={{ marginLeft: "-2px" }}
                            className="text-2xl"
                        />
                    ) : (
                        <IoNotificationsOutline
                            style={{ marginLeft: "-2px" }}
                            className="text-2xl"
                        />
                    )}
                    <span className="hidden lg:block">Notifications</span>
                </NavLink>
                <NavLink
                    to="/create"
                    className={`flex gap-4 items-center text-customBase ${
                        activeTab === "/create" ? "font-semibold" : ""
                    }`}
                    onClick={() => handleNavClick("/create")}
                >
                    {" "}
                    {activeTab === "/create" ? (
                        <FaCirclePlus
                            style={{ marginLeft: "-2px" }}
                            className="text-2xl"
                        />
                    ) : (
                        <CiCirclePlus
                            style={{ marginLeft: "-2px" }}
                            className="text-2xl"
                        />
                    )}
                    <span className="hidden lg:block">Create</span>
                </NavLink>
                {isAuthenticated && (
                    <NavLink
                        to={`/${user?.username}`}
                        className={`flex gap-4 items-center text-customBase ${
                            activeTab === `/${user?.username}`
                                ? "font-semibold"
                                : ""
                        }`}
                        onClick={() => handleNavClick(`/${user?.username}`)}
                    >
                        <img
                            src={user?.profilePicture}
                            className="w-6 h-6 rounded-full border-2 dark:border-white border-black"
                            alt="profile"
                            style={{ marginLeft: "-2px" }}
                        />
                        <span className="hidden lg:block">Profile</span>
                    </NavLink>
                )}
                <div className="mt-auto mb-6 hidden md:block">
                    <DarkModeSwitch
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                        size={30}
                        moonColor="#000000"
                        sunColor="#f5f5f5"
                        className="select-none"
                    />
                </div>
            </div>
        </div>
    );
}
