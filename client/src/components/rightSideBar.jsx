import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/auth/authSlice.js";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

export default function RightSideBar() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="right-sidebar border-l-2 border-slate-200 dark:border-slate-900 hidden md:block md:w-[200px] lg:w-[300px]">
            {(!isAuthenticated && (
                <NavLink
                    to="/login"
                    className="flex gap-4 items-center text-customBase "
                    onClick={() => handleNavClick("/login")}
                >
                    <span className="hidden lg:block">Login</span>
                </NavLink>
            )) || (
                <div className="ml-4 mt-4 flex gap-4 items-center">
                    <img
                        src={user?.profilePicture}
                        className="w-12 h-12 rounded-full"
                        alt="profileImage"
                    />
                    <span>@{user?.username}</span>

                    <button
                        className="bg-blue-500 px-4 py-2 rounded-md text-white"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
