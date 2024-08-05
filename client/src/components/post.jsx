import React, { useState } from "react";
import { FaRegComment, FaShare } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import convertDate from "../utils/convertDate";
import likePost from "../utils/likePost";
import { useSelector } from "react-redux";

const Post = ({
    id,
    createdBy: { username, profilePicture },
    description,
    picturePath,
    createdAt,
    likes,
    likesCount: initialLikesCount,
    comments,
}) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [isLiked, setIsLiked] = useState(!!likes[user?._id]);
    const [likesCount, setLikesCount] = useState(initialLikesCount);

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
        } = await likePost(e, id, isLiked);

        if (success) {
            setIsLiked(newIsLiked);
            setLikesCount(
                (prevLikesCount) => prevLikesCount + likesCountChange
            );
        }
    };

    return (
        <div className="flex p-4 border-b border-gray-200 dark:border-gray-700">
            <Link to={`/${username}`}>
                <img
                    src={profilePicture}
                    alt={`${username}'s profile`}
                    className="w-12 h-12 rounded-full mr-4"
                />
            </Link>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                        <Link to={`/${username}`}>
                            {" "}
                            <span className="font-bold">@{username}</span>{" "}
                        </Link>
                        <span className="text-gray-400 dark:text-gray-600 ">
                            {formattedDate}
                        </span>
                    </div>
                </div>
                <div className="mt-2">
                    <p className="text-xl overflow-hidden">{description}</p>
                    {picturePath && (
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
