import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import makeRequest from "../utils/makeRequest";
import Comment from "./Comment";
import Post from "./post";
import { useSelector } from "react-redux";
import { GoArrowLeft } from "react-icons/go";
import ClipLoader from "react-spinners/ClipLoader";

export default function PostDetails() {
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState("");
    const { username, postId } = useParams();
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchPost = async () => {
        try {
            const host = import.meta.env.VITE_SERVER_HOST;
            const fetchUrl = `${host}/posts/${username}/${postId}`;

            const { data } = await makeRequest(
                fetchUrl,
                "GET",
                null,
                null,
                null
            );

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

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const host = import.meta.env.VITE_SERVER_HOST;
        const fetchUrl = `${host}/posts/${postId}/comment`;
        const body = JSON.stringify({ comment });
        const headers = { "Content-Type": "application/json" };
        try {
            const { status, data } = await makeRequest(
                fetchUrl,
                "POST",
                headers,
                body
            );
            if (status !== 201) {
                setError(data.message);
                setTimeout(() => {
                    setError("");
                }, 3000);
                return;
            }
            fetchPost();
            setComment("");
        } catch (error) {
            return;
        } finally {
            setLoading(false);
        }
    };

    if (!post) return null;

    return (
        <div>
            <div onClick={goBack}>
                <GoArrowLeft className="text-2xl m-2 md:ml-[80px] lg:ml-[260px]" />
            </div>
            <div className=" md:ml-[70px] lg:ml-[250px] min-h-screen">
                <Post {...post} showMenu={true} />
                {isAuthenticated && (
                    <form
                        className="border-b border-slate-200 dark:border-slate-800 pb-2 px-4"
                        onSubmit={handleCommentSubmit}
                    >
                        <div className="flex gap-4 p-2">
                            <img
                                src={user.profilePicture}
                                alt="userPicture"
                                className="w-12 h-12 rounded-full"
                            />
                            <textarea
                                name="comment"
                                id="reply"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-md dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                                placeholder="Add a comment"
                            ></textarea>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-red-500">
                                {error && <p>{error}</p>}
                            </div>
                            <button className="px-4 py-2 bg-blue-500 text-white border-none rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2">
                                {loading ? (
                                    <ClipLoader size={15} color={"#ffffff"} />
                                ) : (
                                    "Coment"
                                )}
                            </button>
                        </div>
                    </form>
                )}
                <div>
                    {post.comments &&
                        post.comments.map((comment) => (
                            <Comment {...comment} key={comment.id} />
                        ))}
                </div>
            </div>
        </div>
    );
}
