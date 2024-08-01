import React, { useEffect, useState } from "react";
import { FaRegComment, FaShare } from "react-icons/fa";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";
import makeRequest from "../utils/makeRequest";
import convertDate from "../utils/convertDate";
import likePost from "../utils/likePost";

export default function PostDetails() {
    const [post, setPost] = useState({
        description: "",
        image: "",
        likes: [],
        comments: [],
        createdAt: "",
        createdBy: {
            username: "",
            profilePicture: "",
        },
    });
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    const { username, id } = useParams();

    const fetchPost = async () => {
        const host = import.meta.env.VITE_SERVER_HOST;
        const fetchUrl = `${host}/posts/${username}/${id}`;

        const data = await makeRequest(fetchUrl);

        if (!data) return window.location.replace("/");
        setIsLiked(!!data.likes[data.createdBy._id]); // TODO: update with current logged in user's id
        setLikesCount(data.likesCount);
        setPost(data);
    };

    const formattedDate = convertDate(post.createdAt);

    useEffect(() => {
        fetchPost();
    }, []);

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
        <div className="flex flex-col p-4 border-b border-gray-200 dark:border-gray-700 md:ml-[70px] lg:ml-[250px] ">
            <div className="flex">
                <img
                    src="/default_avatar.jpg"
                    alt={`${post.createdBy.username}'s profile`}
                    className="w-12 h-12 rounded-full mr-4"
                />
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="font-bold">
                                {post.createdBy.username}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 ml-2">
                                {formattedDate}
                            </span>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p>{post.description}</p>
                        {post.picturePath && (
                            <img
                                src={post.picturePath}
                                alt="Post media"
                                className="mt-2 rounded-lg max-w-full"
                            />
                        )}
                    </div>
                    <div className="flex gap-6 mt-2 md:mt-4 text-gray-500 dark:text-gray-400">
                        <div
                            className="hover:text-red-500 gap-1 flex select-none hover:cursor-pointer"
                            onClick={handleLikePost}
                        >
                            {isLiked ? (
                                <IoHeartSharp className="text-2xl text-red-500" />
                            ) : (
                                <IoHeartOutline className="text-2xl" />
                            )}
                            <span>{likesCount}</span>
                        </div>
                        <div className="flex items-center gap-1 hover:text-blue-400 hover:cursor-pointer select-none">
                            <FaRegComment className="text-lg" />
                            <span>{post.comments.length}</span>
                        </div>
                        <div className="flex items-center gap-1 hover:cursor-pointer hover:text-yellow-600">
                            <FaShare />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-2 md:mt-4">
                {post.comments.map((comment, index) => (
                    <div
                        key={index}
                        className="flex p-4 border-t border-gray-200 dark:border-gray-700"
                    >
                        <img
                            src={
                                comment.user.picturePath ||
                                "/default_avatar.jpg"
                            }
                            alt={`${comment.user.username}'s profile`}
                            className="w-10 h-10 rounded-full mr-4"
                        />
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="font-bold">
                                        @{comment.user.username}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                                        {comment.timestamp}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2">
                                <p>{comment.comment}</p>
                            </div>
                            <div className="mt-2">
                                <IoHeartOutline className="text-2xl" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
