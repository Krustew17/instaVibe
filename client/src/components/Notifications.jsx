import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import makeRequest from "../utils/makeRequest";
import Spinner from "./spinner.jsx";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        const host = import.meta.env.VITE_SERVER_HOST;
        const fetchUrl = `${host}/notifications/`;
        const { status, data } = await makeRequest(fetchUrl, "GET");

        if (status === 200) {
            console.log(data);
            setNotifications(data.notifications);
        }
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        fetchNotifications();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="md:ml-[70px] lg:ml-[250px]">
            {(notifications && notifications.length > 0 && isAuthenticated && (
                <div className="flex min-h-screen flex-col">
                    <h1 className="text-2xl text-semibold text-center mt-3 border-b dark:border-gray-800 border-gray-300 pb-4">
                        Notifications
                    </h1>
                    <div className="px-2 py-2">
                        {notifications.map((notification) => (
                            <div className="flex items-center gap-2 border-b border-gray-300 dark:border-gray-800 mb-2 pb-2">
                                <img
                                    src={`${notification.sender.profilePicture}`}
                                    alt="profilePic"
                                    className="max-w-12 rounded-full aspect-square"
                                />
                                <p>{notification.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )) || (
                <div className="flex justify-center self-center min-h-screen items-center">
                    <h1 className="font-semibold text-2xl">No notifications</h1>
                </div>
            )}
        </div>
    );
}
