import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoNotificationsOutline, IoNotificationsSharp } from "react-icons/io5";

function NotificationNavLink({ activeTab, handleNavClick }) {
    const unreadCount = useSelector((state) => state.notifications.unreadCount);

    return (
        <NavLink
            to="/notifications"
            className={`relative flex gap-4 items-center text-customBase lg:hover:bg-gray-200 rounded-lg lg:pl-4 lg:py-1 lg:dark:hover:bg-gray-800
            ${activeTab === "/notifications" ? "font-semibold" : ""}`}
            onClick={() => handleNavClick("/notifications")}
        >
            {/* Icon with Badge */}
            <div className="relative">
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

                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                        {unreadCount}
                    </span>
                )}
            </div>

            <span className="hidden lg:block">Notifications</span>
        </NavLink>
    );
}

export default NotificationNavLink;
