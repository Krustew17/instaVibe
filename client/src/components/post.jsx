import React, { useState } from "react";
import { FaRegComment, FaHeart, FaShare } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

const Post = ({
    id,
    createdBy,
    description,
    picturePath,
    createdAt,
    likes,
    likesCount: initialLikesCount,
    comments,
}) => {
    const [isLiked, setIsLiked] = useState(!!likes[createdBy._id]);
    const [likesCount, setLikesCount] = useState(initialLikesCount);

    // CONVERT CREATEDAT
    const date = new Date(createdAt);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    const likePost = async (e) => {
        e.preventDefault();
        const host = import.meta.env.VITE_SERVER_HOST;

        const res = await fetch(`${host}/posts/${id}/like`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTRjZTYyZTUxY2Y1NDAzN2NkYTgwOCIsImlhdCI6MTcyMjQ0MDA5OSwiZXhwIjoxNzIyNDQzNjk5fQ.wnC8sQxTiHXFFigIe7xzH8YVIIHJGHwZxtENDNbnnpg`,
            },
        });
        const data = await res.json();

        if (!res.ok) {
            console.error("Error liking post:", data.message);
        }

        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
        console.log(likesCount);

        return data;
    };

    return (
        <Link
            className="flex p-4 border-b border-gray-200 dark:border-gray-700"
            to={`${createdBy.username}/post/${id}`}
        >
            <img
                src={createdBy.profilePicture}
                alt={`${createdBy.username}'s profile`}
                className="w-12 h-12 rounded-full mr-4"
            />
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                        <span className="font-bold">@{createdBy.username}</span>
                        <span className="text-gray-400 dark:text-gray-600 ">
                            {formattedDate}
                        </span>
                    </div>
                </div>
                <div className="mt-2">
                    <p className="text-xl">{description}</p>
                    {picturePath && (
                        <img
                            src={picturePath}
                            alt="Post media"
                            className="mt-2 rounded-lg max-w-full"
                        />
                    )}
                </div>
                <div className="flex gap-6 mt-4 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                        <div
                            className="hover:text-red-500 gap-1 flex transition-all duration-200"
                            onClick={likePost}
                        >
                            {isLiked ? (
                                <IoHeartSharp className="text-2xl text-red-500" />
                            ) : (
                                <IoHeartOutline className="text-2xl" />
                            )}
                            <span>{likesCount}</span>
                        </div>
                    </div>
                    <div className="flex hover:text-blue-400">
                        <div className="flex items-center space-x-1">
                            <FaRegComment />
                            <span>{comments.length}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-yellow-600">
                        <FaShare />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Post;
