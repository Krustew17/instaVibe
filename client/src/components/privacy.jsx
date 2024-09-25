import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import makeRequest from "../utils/makeRequest";
import { updateUser } from "../redux/auth/authSlice";
const Privacy = () => {
    const loggedUser = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const [showPosts, setShowPosts] = useState(loggedUser.showLikedPosts);

    const handleChange = async () => {
        setShowPosts(!showPosts);

        const host = import.meta.env.VITE_SERVER_HOST;
        const fetchUrl = `${host}/users/change-privacy`;
        const body = JSON.stringify({
            showLikedPosts: !showPosts,
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
        console.log(data);

        if (loggedUser) {
            dispatch(updateUser({ updatedUser: data.updatedUser }));
        }
    };

    return (
        <div className="flex flex-col mt-4 ml-2">
            <form className="flex gap-2">
                <label htmlFor="showPosts">Show liked posts to everyone</label>
                <input
                    type="checkbox"
                    value=""
                    className="sr-only"
                    name="showPosts"
                    id="showPosts"
                    checked={showPosts}
                    onChange={handleChange}
                />
                <div
                    className={`relative w-11 h-6 rounded-full cursor-pointer transition-all ${
                        showPosts ? "bg-blue-600" : "bg-gray-200"
                    }`}
                    checked={showPosts}
                    onClick={handleChange}
                >
                    <div
                        className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform ${
                            showPosts ? "transform translate-x-5" : ""
                        }`}
                    ></div>
                </div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 ">
                    {showPosts ? "Public" : "Private"}
                </span>
            </form>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Turning this on will show your liked posts to everyone.
                <br /> Keep it disabled if you would like to hide them.
            </p>
        </div>
    );
};
export default Privacy;
