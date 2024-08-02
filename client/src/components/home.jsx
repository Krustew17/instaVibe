import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaImage, FaSearch, FaTimes } from "react-icons/fa";
import { MdGifBox } from "react-icons/md";
import { Link, useSearchParams } from "react-router-dom";
import Post from "./post";
import makeRequest from "../utils/makeRequest";
import ClipLoader from "react-spinners/ClipLoader";

export default function Main() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "for_you";
    const [posts, setPosts] = useState([]);
    const [query, setQuery] = useState("");
    const [gifs, setGifs] = useState([]);
    const [showGifModal, setShowGifModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedGif, setSelectedGif] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);
    const [description, setDescription] = useState("");

    const DEBOUNCE_DELAY = 1000;

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSearchClick = () => {
        fetchGifs();
    };

    const closeGifModal = () => {
        setShowGifModal(false);
        setQuery("");
        setGifs([]);
    };

    const fetchGifs = useCallback(async () => {
        setLoading(true);
        setError(null);

        if (!query) {
            setError("Please enter a search query");
            setLoading(false);
            return;
        }

        const apiKey = import.meta.env.VITE_TENOR_API;

        const url = `https://tenor.googleapis.com/v2/search?key=${apiKey}&q=${query}&limit=100&media_filter=gif`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                console.error(
                    "HTTP Error:",
                    response.status,
                    response.statusText
                );
                throw new Error("Error fetching GIFs");
            }

            const data = await response.json();
            setGifs(data.results);
        } catch (error) {
            console.error("Error:", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [query]);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setError("");
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setUploadedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    const selectGif = (gifUrl) => {
        setSelectedGif(gifUrl);
        setQuery("");
        setGifs([]);
        setShowGifModal(false);
    };

    const removeSelectedGif = () => {
        setSelectedGif(null);
    };

    const removeUploadedImage = () => {
        setUploadedImage(null);
    };
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const host = import.meta.env.VITE_SERVER_HOST;
        const data = await makeRequest(`${host}/posts/all`);
        setPosts(data);
        return data;
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);

            const formData = new FormData();
            if (uploadedImage) {
                formData.append("image", image);
            }
            formData.append("description", description);

            const host = import.meta.env.VITE_SERVER_HOST;
            let request;

            // const token = localStorage.getItem("token");
            const token =
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTRjZTYyZTUxY2Y1NDAzN2NkYTgwOCIsImlhdCI6MTcyMjU5MDQ4MywiZXhwIjoxNzIyNjc2ODgzfQ.86THG-crd7Ec148o8GEbh-jsEVuFjFcq94G_X5euWM8";

            if (uploadedImage) {
                request = await fetch(`${host}/posts/upload`, {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                    body: formData,
                });
            } else {
                request = await fetch(`${host}/posts/upload`, {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        gifUrl: selectedGif,
                        description: description,
                    }),
                });
            }
            const data = await request.json();

            if (!request.ok) {
                throw new Error(data.message);
            }

            setUploadedImage(null);
            setImage(null);
            setSelectedGif(null);
            setError("");
            setDescription("");
            fetchPosts();
            fileInputRef.current.value = "";
            console.log("cleared inputs");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="md:ml-[70px] lg:ml-[250px] flex flex-col min-h-screen mt-2 sm:mt-4">
            <div className="flex gap-4 border-b-2 border-slate-200 dark:border-slate-900 pb-2">
                <Link
                    to="?tab=for_you"
                    className={`${
                        activeTab === "for_you" ? "font-semibold" : ""
                    } ml-5`}
                    onClick={() => setSearchParams({ tab: "for_you" })}
                >
                    For you
                </Link>
                <Link
                    to="?tab=following"
                    className={`${
                        activeTab === "following" ? "font-semibold" : ""
                    }`}
                    onClick={() => setSearchParams({ tab: "following" })}
                >
                    Following
                </Link>
            </div>
            <form
                className="p-5 flex w-full border-b-2 border-slate-200 dark:border-slate-900"
                onSubmit={handleSubmit}
            >
                <img
                    src="/default_avatar.jpg"
                    className="max-h-12 max-w-12 rounded-full"
                />
                <div className="ml-5 flex-1 flex-col w-full max-h-full">
                    <textarea
                        type="textarea"
                        placeholder="What's on your mind?"
                        name="description"
                        value={description}
                        onChange={handleDescriptionChange}
                        className="w-full overflow-hidden resize-none border-b-2 border-slate-200 dark:border-slate-900 focus:outline-none bg-transparent"
                    />
                    {selectedGif && (
                        <div className="relative mt-2">
                            <img
                                src={selectedGif}
                                alt="Selected GIF"
                                className="w-full object-cover rounded-md"
                            />
                            <button
                                onClick={removeSelectedGif}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                                aria-label="Remove GIF"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    )}
                    {uploadedImage && (
                        <div className="relative mt-2">
                            <img
                                src={uploadedImage}
                                alt="Uploaded"
                                className="w-full object-cover rounded-md"
                            />
                            <button
                                onClick={removeUploadedImage}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                                aria-label="Remove Image"
                                type="button"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    )}
                    <div className="flex justify-between w-full mt-2">
                        <div className="flex items-center">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                aria-label="upload a file"
                                className="hidden"
                                accept="image/*"
                            />
                            <button
                                onClick={handleIconClick}
                                className="p-2 rounded-full text-blue-500"
                                aria-label="Upload File"
                                type="button"
                            >
                                <FaImage className="text-2xl" />
                            </button>

                            <button
                                onClick={() => setShowGifModal(true)}
                                className="text-blue-500 text-3xl"
                                type="button"
                            >
                                <MdGifBox />
                            </button>
                        </div>
                        <div className="text-red-500">{error}</div>
                        <button
                            className="bg-blue-500 px-6 rounded-full text-sm font-bold text-white"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <ClipLoader size={15} color={"#ffffff"} />
                            ) : (
                                "Post"
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {showGifModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-3xl w-full h-[70vh] md:h-[80vh] overflow-auto">
                        {" "}
                        <h2 className="text-lg font-semibold mb-4 text-center">
                            Select a GIF
                        </h2>
                        <div className="flex items-center mb-4 border rounded-xl ">
                            <button
                                onClick={handleSearchClick}
                                className="dark:text-white p-2 rounded-xl mr-1"
                            >
                                <FaSearch />
                            </button>
                            <input
                                type="text"
                                value={query}
                                onChange={handleInputChange}
                                placeholder="Search for GIFs"
                                className="rounded-l-md flex-grow bg-transparent focus:outline-none"
                            />
                        </div>
                        {loading && <p>Loading...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="grid grid-cols-2 md:grid-cols-3">
                            {gifs.map((gif) => (
                                <div
                                    key={gif.id}
                                    className="cursor-pointer"
                                    onClick={() =>
                                        selectGif(gif.media_formats.gif.url)
                                    }
                                >
                                    <img
                                        src={gif.media_formats.gif.url}
                                        alt={gif.content_description}
                                        className="w-full h-full"
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={closeGifModal}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {posts &&
                posts.map((post) => {
                    return (
                        <Link
                            to={`${post.createdBy.username}/post/${post.id}`}
                            key={post._id}
                        >
                            <Post {...post} />
                        </Link>
                    );
                })}
        </div>
    );
}
