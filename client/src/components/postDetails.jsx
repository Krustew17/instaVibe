import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import makeRequest from "../utils/makeRequest";
import Comment from "./Comment";
import Post from "./post";
import { GoArrowLeft } from "react-icons/go";

export default function PostDetails() {
    const [post, setPost] = useState(null);
    const { username, id } = useParams();

    const fetchPost = async () => {
        try {
            const host = import.meta.env.VITE_SERVER_HOST;
            const fetchUrl = `${host}/posts/${username}/${id}`;

            const data = await makeRequest(fetchUrl);

            if (!data) return window.location.replace("/");

            setPost(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPost();
    }, []);

    const goBack = () => {
        window.history.back();
        setTimeout(() => {
            const scrollPosition = sessionStorage.getItem("scrollPosition");
            if (scrollPosition) {
                window.scrollTo(0, parseInt(scrollPosition, 0));
                sessionStorage.removeItem("scrollPosition");
            }
        }, 0);
    };

    if (!post) return null;

    return (
        <div>
            <div onClick={goBack}>
                <GoArrowLeft className="text-2xl m-2 md:ml-[80px] lg:ml-[260px]" />
            </div>
            <div className=" md:ml-[70px] lg:ml-[250px]">
                <Post {...post} />
                <div className="mt-2 md:mt-4">
                    {post.comments &&
                        post.comments.map((comment, index) => (
                            <Comment key={index} {...comment} />
                        ))}
                </div>
            </div>
        </div>
    );
}
