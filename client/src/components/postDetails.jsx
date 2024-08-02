import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import makeRequest from "../utils/makeRequest";
import Comment from "./Comment";
import Post from "./post";

export default function PostDetails() {
    const [post, setPost] = useState(null);
    const { username, id } = useParams();

    const fetchPost = async () => {
        try {
            setLoading(true);
            const host = import.meta.env.VITE_SERVER_HOST;
            const fetchUrl = `${host}/posts/${username}/${id}`;

            const data = await makeRequest(fetchUrl);

            if (!data) return window.location.replace("/");

            setPost(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, []);

    if (!post) return null;

    return (
        <div className=" md:ml-[70px] lg:ml-[250px]">
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
