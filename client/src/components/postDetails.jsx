import React, { useEffect, useState } from "react";
import { FaRegComment, FaShare } from "react-icons/fa";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";
import makeRequest from "../utils/makeRequest";
import convertDate from "../utils/convertDate";
import likePost from "../utils/likePost";
import Comment from "./Comment";
import Post from "./post";
import Loader from "./Loader";

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
            _id: "",
        },
        likesCount: 0,
        picturePath: "",
    });
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const { username, id } = useParams();

    const fetchPost = async () => {
        try {
            setLoading(true);
            const host = import.meta.env.VITE_SERVER_HOST;
            const fetchUrl = `${host}/posts/${username}/${id}`;

            const data = await makeRequest(fetchUrl);

            if (!data) return window.location.replace("/");
            // setIsLiked(!!data.likes[data.createdBy._id]); // TODO: update with current logged in user's id
            // setLikesCount(data.likesCount);
            setPost(data);
        } catch (error) {
            console.error("Failed to fetch post details:", error);
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    // const formattedDate = convertDate(post.createdAt);

    useEffect(() => {
        fetchPost();
    }, []);

    if (loading) {
        return <Loader />;
    }
    return (
        <div className="ml-[250px] min-h-screen">
            <Post {...post} />
            <div className="mt-2 md:mt-4">
                {post.comments &&
                    post.comments.map((comment, index) => (
                        <Comment key={index} {...comment} />
                    ))}
            </div>
        </div>
    );
}
