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
        <div className="right-sidebar border-l-2 border-slate-200 dark:border-slate-900 hidden lg:block lg:w-[300px] select-none pr-4">
            <div>
                {(!isAuthenticated && (
                    <NavLink
                        to="/login"
                        className="gap-4 items-center text-customBase hidden lg:flex max-w-24 m-4 py-1 rounded-lg justify-center bg-blue-500 hover:bg-blue-600 text-white"
                        // onClick={() => handleNavClick("/login")}
                    >
                        <span className="hidden lg:block">Login</span>
                    </NavLink>
                )) || (
                    <div className="ml-4 mt-4 flex gap-4 items-center">
                        <img
                            src={user?.profilePicture}
                            className="w-12 h-12 rounded-full aspect-square"
                            alt="profileImage"
                        />
                        <span>@{user?.username}</span>

                        <button
                            className="bg-black dark:bg-white dark:text-black px-4 py-1 rounded-md text-white"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
