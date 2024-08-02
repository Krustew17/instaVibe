import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/auth/authSlice.js";

export default function RightSideBar() {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="right-sidebar border-l-2 border-slate-200 dark:border-slate-900 hidden md:block md:w-[200px] lg:w-[300px]">
            <div>test</div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
