import React, { useState, useRef, useEffect } from "react";
import { FaImage, FaSearch, FaTimes } from "react-icons/fa";
import { MdGifBox } from "react-icons/md";
import { Link, useSearchParams } from "react-router-dom";
import Post from "./post";

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
    const [uploadedImage, setUploadedImage] = useState(null); // State for storing uploaded image
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearchClick = () => {
        fetchGifs();
    };

    const closeGifModal = () => {
        setShowGifModal(false);
        setQuery("");
        setGifs([]);
    };

    const fetchGifs = async () => {
        setLoading(true);
        setError(null);

        if (!query) {
            setError("Please enter a search query");
            setLoading(false);
            return;
        }

        const apiKey = import.meta.env.VITE_TENOR_API;
        const url = `https://tenor.googleapis.com/v2/search?key=${apiKey}&q=${query}&limit=1000`;

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
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
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
        const res = await fetch(`${host}/posts/all`);
        const data = await res.json();
        setPosts(data);
        return data;
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
            <div className="p-5 flex w-full border-b-2 border-slate-200 dark:border-slate-900">
                <img
                    src="/default_avatar.jpg"
                    className="max-h-12 max-w-12 rounded-full"
                />
                <div className="ml-5 flex-1 flex-col w-full max-h-full">
                    <textarea
                        type="textarea"
                        placeholder="What's on your mind?"
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
                                className="w-full max-h-40 object-cover rounded-md"
                            />
                            <button
                                onClick={removeUploadedImage}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                                aria-label="Remove Image"
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
                            >
                                <FaImage className="text-2xl" />
                            </button>

                            <button
                                onClick={() => setShowGifModal(true)}
                                className="text-blue-500 text-3xl"
                            >
                                <MdGifBox />
                            </button>
                        </div>
                        <button className="bg-blue-500 px-6 rounded-full text-sm font-bold text-white">
                            Post
                        </button>
                    </div>
                </div>
            </div>

            {showGifModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-3xl w-full h-[80vh] md:h-[60vh] overflow-auto">
                        {" "}
                        <h2 className="text-lg font-semibold mb-4 text-center">
                            Select a GIF
                        </h2>
                        <div className="flex items-center mb-4 border rounded-xl ">
                            <button
                                onClick={handleSearchClick}
                                className="text-white p-2 rounded-xl mr-1"
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
            {posts && posts.map((post) => <Post key={post._id} {...post} />)}
        </div>
    );
}
