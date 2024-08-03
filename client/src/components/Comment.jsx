import React, { useState } from "react";
import convertDate from "../utils/convertDate";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";
import likeComment from "../utils/likeComment";
import { useSelector } from "react-redux";

export default function Comment({
    id,
    comment,
    user: { username, profilePicture },
    createdAt,
    replies,
    likes,
    likesCount: initialLikesCount,
}) {
    const user = useSelector((state) => state.auth.user);
    const [isLiked, setIsLiked] = useState(!!likes[user?._id]);
    const [likesCount, setLikesCount] = useState(initialLikesCount);

    const handleLikeComment = async (e) => {
        e.preventDefault();

        if (!user) {
            return;
        }

        const {
            success,
            isLiked: newIsLiked,
            likesCountChange,
        } = await likeComment(e, id, isLiked);
        if (success) {
            setIsLiked(newIsLiked);
            setLikesCount(
                (prevLikesCount) => prevLikesCount + likesCountChange
            );
        }
    };

    const formattedDate = convertDate(createdAt);

    return (
        <div className="flex p-4 border-b border-slate-200 dark:border-slate-800">
            <img
                src={profilePicture || "/default_avatar.jpg"}
                alt={`${username}'s profile`}
                className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="font-bold">@{username}</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                            {formattedDate}
                        </span>
                    </div>
                </div>
                <div className="mt-2">
                    <p>{comment}</p>
                </div>
                <div className="flex gap-6 mt-2 md:mt-4 text-gray-500 dark:text-gray-400">
                    <div
                        className="flex gap-1 cursor-pointer hover:text-red-500 select-none"
                        onClick={handleLikeComment}
                    >
                        {isLiked ? (
                            <IoHeartSharp className="text-2xl text-red-500" />
                        ) : (
                            <IoHeartOutline className="text-2xl" />
                        )}
                        <span>{likesCount}</span>
                    </div>
                    {/* <div className="flex items-center gap-1 hover:text-blue-400 hover:cursor-pointer select-none">
                        <FaRegComment className="text-lg" />
                        <span>{replies.length}</span>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
