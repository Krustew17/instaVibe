import React, { useEffect, useState } from "react";
import { FaRegComment, FaRetweet, FaHeart, FaShare } from "react-icons/fa";
import { useParams } from "react-router-dom";

export default function PostDetails() {
    const [post, setPost] = useState({
        description: "",
        image: "",
        likes: [],
        comments: [],
        createdAt: "",
        createdBy: {
            username: "",
        },
    });

    const { username, id } = useParams();

    const fetchPost = async () => {
        const host = import.meta.env.VITE_SERVER_HOST;

        const res = await fetch(`${host}/posts/${username}/${id}`);
        const data = await res.json();

        setPost(data);
    };
    useEffect(() => {
        fetchPost();
    }, []);

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
                                {post.createdAt}
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
                    <div className="flex justify-around mt-4 text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                            <FaRegComment />
                            <span>12</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <FaRetweet />
                            <span>34</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <FaHeart />
                            <span>56</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <FaShare />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4">
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
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
