import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import makeRequest from "../utils/makeRequest";
import { updateUser } from "../redux/auth/authSlice";
const Privacy = () => {
    const loggedUser = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const [showPosts, setShowPosts] = useState(loggedUser.showPosts);
    console.log(showPosts);

    const handleChange = async () => {
        setShowPosts(!showPosts);

        const host = import.meta.env.VITE_SERVER_HOST;
        const fetchUrl = `${host}/users/change-privacy`;
        const body = JSON.stringify({
            showPosts: !showPosts,
        });
        const headers = {
            "Content-Type": "application/json",
        };
        const { status, data } = await makeRequest(
            fetchUrl,
            "PUT",
            headers,
            body
        );

        if (loggedUser) {
            dispatch(updateUser({ updatedUser: data.updatedUser }));
        }
    };

    return (
        <div className="flex mt-4 ml-2">
            <form>
                <label className="inline-flex items-center cursor-pointer">
                    Show liked posts to Everyone
                    <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        onChange={handleChange}
                        checked={showPosts}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 ">
                        {showPosts ? "Public" : "Private"}
                    </span>
                </label>
            </form>
        </div>
    );
};
export default Privacy;
