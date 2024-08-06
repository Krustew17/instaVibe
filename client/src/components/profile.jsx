import React, { useState, useEffect } from "react";
import { IoHeartSharp } from "react-icons/io5";
import { FaTableCells } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaComment } from "react-icons/fa";
import { BsGearWide } from "react-icons/bs";
import { useSelector } from "react-redux";
import makeRequest from "../utils/makeRequest";
import sendNotification from "../utils/sendNotification";

export default function Profile({ user: initialUser, posts, likedPosts }) {
    const loggedUser = useSelector((state) => state.auth.user);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [activeTab, setActiveTab] = useState("posts");
    const [user, setUser] = useState(initialUser);

    const [isFollowing, setIsFollowing] = useState(
        !!user?.followers?.includes(loggedUser?._id)
    );

    const handleFollow = async () => {
        if (!loggedUser) {
            window.location.replace("/login");
            return;
        }
        const host = import.meta.env.VITE_SERVER_HOST;
        const fetchUrl = `${host}/users/${user._id}/follow`;

        try {
            const { status, data } = await makeRequest(fetchUrl, "POST");
            if (status !== 200) {
                return;
            }
            setIsFollowing(!isFollowing);

            setUser((prevUser) => ({
                ...prevUser,
                followersCount: isFollowing
                    ? prevUser.followersCount - 1
                    : prevUser.followersCount + 1,
            }));

            const type = isFollowing ? "unfollow" : "follow";
            await sendNotification(loggedUser._id, user._id, type, null);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 640);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isMobile) {
        return (
            <div className="mt-4 customBreakPoint:mt-8 customBreakPoint:ml-6 px-2">
                <div className=" flex justify-between items-center">
                    <div className="flex gap-2 text-sm">
                        <h1 className="font-semibold ">{user?.displayName}</h1>
                        <h1 className="text-gray-400 dark:text-gray-600 ">
                            @{user?.username}
                        </h1>
                    </div>
                    {(user?._id === loggedUser?._id && (
                        <div className="flex gap-2 flex-end">
                            <button className=" border-black py-1 bg-black text-white dark:border-white dark:bg-white dark:text-black border px-2 rounded-md text-sm">
                                Edit Profile
                            </button>
                            <button>
                                <BsGearWide />
                            </button>
                        </div>
                    )) || (
                        <button
                            className="border-black py-1 bg-black text-white dark:border-white dark:bg-white dark:text-black border px-2 rounded-lg text-md"
                            onClick={handleFollow}
                        >
                            {isFollowing ? "Unfollow" : "Follow"}
                        </button>
                    )}
                </div>

                <div className="mt-6">
                    <div className="flex gap-10 items-center">
                        <img
                            src={`${user?.profilePicture}`}
                            alt="profileImage"
                            className="h-16 w-16 aspect-square customBreakPoint:h-18 customBreakPoint:w-18 cxs:h-24 cxs:w-24 sm:h-auto md:h-20 rounded-full select-none"
                        />
                        <div className="flex flex-col gap-4">
                            <div>
                                <div className="flex gap-6 text-sm">
                                    <h2 className="flex flex-col customBreakPoint:flex-row customBreakPoint:gap-1 text-center">
                                        <strong>{posts?.length}</strong> Posts
                                    </h2>
                                    <h2 className="flex flex-col customBreakPoint:flex-row customBreakPoint:gap-1 text-center">
                                        <strong>
                                            {user?.followers.length}
                                        </strong>{" "}
                                        Followers
                                    </h2>
                                    <h2 className="flex flex-col customBreakPoint:flex-row customBreakPoint:gap-1 text-center">
                                        <strong>
                                            {user?.following.length}
                                        </strong>{" "}
                                        Following
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 text-xs border-b border-slate-300 dark:border-slate-800 pb-6 max-w-[320px]">
                        <p
                            style={{
                                whiteSpace: "pre-line",
                                wordBreak: "break-word",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 4,
                                overflow: "hidden",
                                textOverflow: "clip", // Changed from 'ellipsis' to 'clip'
                                lineHeight: "1em",
                                maxHeight: "4em",
                            }}
                        >
                            {user?.description}
                        </p>
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
            </div>
        );
    } else {
        return (
            <div className="mt-6 sm:ml-10 sm:mt-10 md:ml-10 md:mt-10 md:pr-6 px-2">
                <div className="flex gap-6 md:gap-16 border-b pb-12 border-slate-200 dark:border-slate-800 md:flex-row">
                    <img
                        src={`${user?.profilePicture}`}
                        alt="profileImage"
                        className="sm:w-36 sm:h-36 h-16 w-16 aspect-square rounded-full select-none"
                    />
                    <div className="flex flex-col gap-6 md:gap-6">
                        <div className="flex items-center gap-6 md:gap-10 xl:gap-20 lg:text-xl">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <h1>{user?.displayName}</h1>
                                <h1 className="dark:text-gray-600 text-gray-400">
                                    @{user?.username}
                                </h1>
                            </div>
                            {(loggedUser?.username === user?.username && (
                                <div className="flex items-center text-sm md:text-md gap-2">
                                    <Link
                                        to={"/profile/edit"}
                                        className="border-black lg:text-xl bg-black text-white dark:border-white dark:bg-white dark:text-black border px-2 rounded-md"
                                    >
                                        Edit Profile
                                    </Link>
                                    <Link
                                        to={`/profile/edit`}
                                        className="lg:text-xl"
                                    >
                                        <BsGearWide />
                                    </Link>
                                </div>
                            )) || (
                                <button
                                    className="px-6  border-none rounded-lg py-1 bg-black dark:bg-white dark:text-black text-white"
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
                                <strong>{user?.followersCount}</strong>{" "}
                                followers
                            </h2>
                            <h2>
                                <strong>{user?.followingCount}</strong>{" "}
                                following
                            </h2>
                        </div>
                        <p
                            className="max-w-[500px]"
                            style={{
                                whiteSpace: "pre-line",
                                wordBreak: "break-word",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 4,
                                overflow: "hidden",
                                textOverflow: "clip", // Changed from 'ellipsis' to 'clip'
                                lineHeight: "1em",
                                maxHeight: "4em",
                            }}
                        >
                            {user?.description}
                        </p>
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
}
