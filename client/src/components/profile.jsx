import React, { useState } from "react";
import { IoHeartSharp } from "react-icons/io5";
import { FaTableCells } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaComment } from "react-icons/fa";
import { BsGearWide } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/auth/authSlice";
import makeRequest from "../utils/makeRequest";

export default function Profile({ user, posts, likedPosts }) {
    const loggedUser = useSelector((state) => state.auth.user);
    const [activeTab, setActiveTab] = useState("posts");
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    console.log(user?.followers?.includes(loggedUser?._id));

    const [isFollowing, setIsFollowing] = useState(
        !!user?.followers.includes(loggedUser?._id)
    );

    console.log(isFollowing);
    const handleFollow = async () => {
        const host = import.meta.env.VITE_SERVER_HOST;
        const fetchUrl = `${host}/users/${user._id}/follow`;

        try {
            const { status, data } = await makeRequest(fetchUrl, "POST");
            if (status !== 200) {
                return;
            }
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mt-6 md:ml-20 md:mt-10 md:pr-6 px-2">
            <div className="flex gap-6 md:gap-20 border-b pb-12 border-slate-200 dark:border-slate-800 md:flex-row">
                <button onClick={handleLogout}>logout</button>
                <img
                    src={`${user?.profilePicture}`}
                    alt="profileImage"
                    className="md:w-40 md:h-40 h-16 w-16 rounded-full select-none"
                />
                <div className="flex flex-col gap-7">
                    <div className="flex items-center justify-between text-xl">
                        <div className="flex flex-col md:flex-row gap-4">
                            <h1>{user?.displayName}</h1>
                            <h1 className="dark:text-gray-600 text-gray-400">
                                @{user?.username}
                            </h1>
                        </div>
                        {(loggedUser?.username === user?.username && (
                            <Link to={`/profile/edit`}>
                                <BsGearWide />
                            </Link>
                        )) || (
                            <button
                                className="px-6  border-none rounded-sm bg-black dark:bg-white dark:text-black text-white"
                                onClick={handleFollow}
                                type="button"
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2 md:gap-14 md:text-lg">
                        <h2>
                            <strong>{posts?.length}</strong> posts
                        </h2>
                        <h2>
                            <strong>{user?.followersCount}</strong> followers
                        </h2>
                        <h2>
                            <strong>{user?.followingCount}</strong> following
                        </h2>
                    </div>
                    <div className="max-w-[500px]">{user?.description}</div>
                </div>
            </div>
            <div>
                <div className="flex justify-center gap-4">
                    <button
                        className={`py-2 text-lg flex items-center gap-2 select-none ${
                            activeTab === "posts"
                                ? "border-t-2 dark:border-white border-black"
                                : "text-gray-400 dark:text-gray-600"
                        }`}
                        onClick={() => setActiveTab("posts")}
                    >
                        <FaTableCells /> Posts
                    </button>
                    <button
                        className={`py-2 text-lg flex items-center gap-2 select-none ${
                            activeTab === "liked"
                                ? "border-t-2 dark:border-white border-black"
                                : "text-gray-400 dark:text-gray-600"
                        }`}
                        onClick={() => setActiveTab("liked")}
                    >
                        <IoHeartSharp /> Liked Posts
                    </button>
                </div>
            </div>
            <div className="mt-4">
                {activeTab === "posts" ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                        {posts?.map((post) => (
                            <Link
                                to={`/${post.createdBy.username}/post/${post._id}`}
                                key={post._id}
                                className="relative w-full h-40 overflow-hidden border border-slate-200 dark:border-slate-800 rounded-sm shadow-md group"
                            >
                                <img
                                    src={post.picturePath}
                                    alt={post.description}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex sm:flex-row sm:gap-4 flex-col justify-center items-center bg-opacity-50 bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="flex items-center gap-2 text-lg font-bold">
                                        <IoHeartSharp />
                                        {post?.likesCount || 0}
                                    </span>
                                    <span className="flex items-center gap-2 text-lg font-bold">
                                        <FaComment />
                                        {post?.comments?.length || 0}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                        {likedPosts?.map((post) => (
                            <Link
                                to={`/${post.createdBy.username}/post/${post._id}`}
                                key={post._id}
                                className="relative w-full h-40 overflow-hidden border border-slate-200 dark:border-slate-800 rounded-sm shadow-md group"
                            >
                                <img
                                    src={post.picturePath}
                                    alt={post.description}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex sm:flex-row sm:gap-4  flex-col justify-center items-center bg-opacity-50 bg-black text-white   opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="flex items-center gap-2 text-lg font-bold">
                                        <IoHeartSharp />
                                        {post?.likesCount || 0}
                                    </span>
                                    <span className="flex items-center gap-2 text-lg font-bold">
                                        <FaComment />
                                        {post?.comments?.length || 0}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
