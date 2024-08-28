import React, { useState } from "react";
import { FaRegComment, FaShare } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import convertDate from "../utils/convertDate";
import likePost from "../utils/likePost";
import { useSelector } from "react-redux";
import sendNotification from "../utils/sendNotification";
import makeRequest from "../utils/makeRequest";

const Post = ({
    _id: postId,
    createdBy: { username, profilePicture, _id },
    description,
    picturePath,
    createdAt,
    likes,
    likesCount: initialLikesCount,
    comments,
    showMenu = false,
}) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const navigate = useNavigate();
    const loggedUser = useSelector((state) => state.auth.user);
    const [isLiked, setIsLiked] = useState(!!likes[loggedUser?._id]);
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newDescription, setNewDescription] = useState(description);

    const owner = _id === loggedUser?._id;

    // CONVERT CREATEDATE
    const formattedDate = convertDate(createdAt);

    const handleLikePost = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        const {
            success,
            isLiked: newIsLiked,
            likesCountChange,
        } = await likePost(e, postId, isLiked);

        if (success) {
            setIsLiked(newIsLiked);
            setLikesCount(
                (prevLikesCount) => prevLikesCount + likesCountChange
            );
            const type = newIsLiked ? "like" : "unlike";

            if (loggedUser?._id !== _id) {
                await sendNotification(loggedUser?._id, _id, type, postId);
            }
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleDelete = async () => {
        const host = import.meta.env.VITE_SERVER_HOST;
        const fetchUrl = `${host}/posts/${postId}/delete`;
        const { status } = await makeRequest(fetchUrl, "DELETE");
        if (status === 200) {
            navigate("/");
        }
        return;
    };

    const handleEdit = () => {
        setIsEditing(true);
        setIsMenuOpen(false);
    };

    const handleSave = async () => {
        const host = import.meta.env.VITE_SERVER_HOST;
        const fetchUrl = `${host}/posts/${postId}/update`;
        const headers = {
            "Content-Type": "application/json",
        };
        const body = JSON.stringify({ description: newDescription });
        const { status } = await makeRequest(fetchUrl, "PUT", headers, body);
        if (status === 200) {
            setIsEditing(false);
            setNewDescription(newDescription);
        }
    };

    const handleCancel = () => {
        setNewDescription(description);
        setIsEditing(false);
    };

    return (
        <div className="flex p-4 border-b border-gray-200 dark:border-gray-700">
            <img
                src={profilePicture}
                alt={`${username}'s profile`}
                className="w-12 h-12 rounded-full mr-4"
            />
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <div className="flex justify-between w-full">
                        <div className="flex gap-3">
                            <Link to={`/${username}`}>
                                <span className="font-bold">@{username}</span>
                            </Link>
                            <span className="text-gray-400 dark:text-gray-600">
                                {formattedDate}
                            </span>
                        </div>
                        {showMenu && owner && (
                            <div className="relative text-gray-500 select-none">
                                <button
                                    onClick={toggleMenu}
                                    className="focus:outline-none"
                                >
                                    ...
                                </button>
                                {isMenuOpen && (
                                    <div className="absolute flex flex-col gap-2 right-0 md:mt-2 w-32 border p-4 bg-white dark:bg-black dark:border-gray-800 rounded-lg shadow-lg z-10">
                                        <button
                                            onClick={handleEdit}
                                            className="block w-full rounded-lg text-center px-4 py-2 bg-black dark:bg-white text-sm text-white hover:bg-gray-700 dark:text-black dark:hover:bg-gray-300"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="block w-full rounded-lg text-center px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 dark:text-gray-200 dark:hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-2">
                    {isEditing ? (
                        <div className="flex flex-col gap-2">
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-black dark:text-white"
                                value={newDescription}
                                onChange={(e) =>
                                    setNewDescription(e.target.value)
                                }
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xl overflow-hidden">
                            {newDescription}
                        </p>
                    )}
                    {(picturePath && picturePath.includes("mp4") && (
                        <video
                            controls
                            src={picturePath}
                            alt="Post media"
                            className="mt-2 rounded-lg max-w-full"
                        />
                    )) || (
                        <img
                            src={picturePath}
                            alt="Post media"
                            className="mt-2 rounded-lg max-w-full border shadow-sm shadow-black border-slate-200 dark:border-slate-800"
                        />
                    )}
                </div>
                <div className="flex gap-6 mt-4 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                        <div
                            className="hover:text-red-500 p-1 rounded gap-1 flex cursor-pointer"
                            onClick={handleLikePost}
                        >
                            {isLiked ? (
                                <IoHeartSharp className="text-2xl text-red-500" />
                            ) : (
                                <IoHeartOutline className="text-2xl" />
                            )}
                            <span>{likesCount}</span>
                        </div>
                    </div>
                    <div className="flex hover:text-blue-400 cursor-pointer">
                        <div className="flex items-center space-x-1">
                            <FaRegComment className="text-lg" />
                            <span>{comments.length}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-yellow-600 cursor-pointer">
                        <FaShare />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;
