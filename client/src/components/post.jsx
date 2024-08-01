import React, { useState } from "react";
import { FaRegComment, FaShare } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import convertDate from "../utils/convertDate";
import likePost from "../utils/likePost";

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

    // CONVERT CREATEDATE
    const formattedDate = convertDate(createdAt);

    const handleLikePost = async (e) => {
        e.preventDefault();
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
                            className="mt-2 rounded-lg max-w-full border shadow-sm shadow-black border-slate-200 dark:border-slate-800"
                        />
                    )}
                </div>
                <div className="flex gap-6 mt-4 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                        <div
                            className="hover:text-red-500 gap-1 flex"
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
                    <div className="flex hover:text-blue-400">
                        <div className="flex items-center space-x-1">
                            <FaRegComment className="text-lg" />
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
