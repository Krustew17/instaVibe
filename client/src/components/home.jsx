import React, { useState, useRef, useCallback, useEffect } from "react";
import { FaImage, FaSearch, FaTimes } from "react-icons/fa";
import { MdGifBox } from "react-icons/md";
import { Link, useSearchParams } from "react-router-dom";
import Post from "./post";
import makeRequest from "../utils/makeRequest";
import ClipLoader from "react-spinners/ClipLoader";
import { useSelector, useDispatch } from "react-redux";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { logout } from "../redux/auth/authSlice.js";

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
    const [uploadedFile, setUploadedFile] = useState(null); // Updated state
    const [file, setFile] = useState(null); // Holds the actual file
    const fileInputRef = useRef(null);
    const [description, setDescription] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(true);

    const dispatch = useDispatch();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
    };

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle("dark");
        setIsDarkMode(!isDarkMode);
    };

    const handlePostClick = () => {
        sessionStorage.setItem("scrollPosition", window.scrollY);
    };

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

    useEffect(() => {
        const scroll = sessionStorage.getItem("scrollPosition");
        if (scroll) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(scroll), {
                    behavior: "smooth",
                });
            }, 100);
        }
        sessionStorage.removeItem("scrollPosition");
    }, []);

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
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const fileURL = URL.createObjectURL(selectedFile);
            setUploadedFile(fileURL);
            setError("");
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

    const removeUploadedFile = () => {
        setUploadedFile(null);
        setFile(null);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const host = import.meta.env.VITE_SERVER_HOST;
        const { data } = await makeRequest(
            `${host}/posts/all`,
            "GET",
            null,
            null,
            null
        );
        setPosts(data);
        return data;
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);

            const formData = new FormData();
            if (file) {
                formData.append("image", file);
            }
            formData.append("description", description);

            const host = import.meta.env.VITE_SERVER_HOST;
            let request;

            const token = JSON.parse(localStorage.getItem("authState")).token;

            if (file) {
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
                setTimeout(() => {
                    setError("");
                }, 3000);
                throw new Error(data.message);
            }

            setUploadedFile(null);
            setFile(null);
            setSelectedGif(null);
            setError("");
            setDescription("");
            fetchPosts();
            fileInputRef.current.value = "";
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="md:ml-[70px] lg:ml-[250px] flex flex-col min-h-screen mt-2 sm:mt-4 md:pr-32 lg:px-2 pb-[50px] md:pb-0">
            <div className="flex justify-between items-center border-b-2 border-slate-200 dark:border-slate-900 pb-2">
                <div className="flex gap-4">
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
                {isAuthenticated ? (
                    <div className="flex md:hidden items-center">
                        <button
                            className="px-4 dark:bg-white dark:text-black bg-black text-white py-1 rounded-md"
                            onClick={handleLogout}
                        >
                            logout
                        </button>
                    </div>
                ) : (
                    <div className="flex md:hidden items-center">
                        <Link
                            to="/login"
                            className="dark:bg-white dark:text-black bg-black text-white  px-4 py-1 rounded-md"
                        >
                            Sign in
                        </Link>
                    </div>
                )}
                <div className="flex items-center md:hidden px-2">
                    <DarkModeSwitch
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                        size={25}
                        moonColor="#000000"
                        sunColor="#f5f5f5"
                        className="select-none"
                    />
                </div>
            </div>
            {isAuthenticated && (
                <form
                    className="p-5 flex w-full border-b-2 border-slate-200 dark:border-slate-900"
                    onSubmit={handleSubmit}
                >
                    <img
                        src={`${user?.profilePicture}`}
                        className="max-h-12 max-w-12 rounded-full aspect-square"
                    />
                    <div className="ml-5 flex-1 flex-col w-full max-h-full">
                        <textarea
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
                        {uploadedFile && (
                            <div className="relative mt-2">
                                {file?.type.startsWith("video/") ? (
                                    <video
                                        src={uploadedFile}
                                        controls
                                        width="100%"
                                        className="rounded-md"
                                    />
                                ) : (
                                    <img
                                        src={uploadedFile}
                                        alt="Uploaded"
                                        className="w-full object-cover rounded-md"
                                    />
                                )}
                                <button
                                    onClick={removeUploadedFile}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                                    aria-label="Remove File"
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
                                    accept="image/jpeg, image/png, image/gif, video/mp4"
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
                            <div className="text-red-500 font-semibold flex items-center">
                                {error}
                            </div>
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
            )}

            {showGifModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-3xl w-full h-[70vh] md:h-[80vh] overflow-auto">
                        <h2 className="text-lg font-semibold mb-4 text-center">
                            Select a GIF
                        </h2>
                        <div className="flex items-center mb-4 border rounded-xl">
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
                posts.map((post) => (
                    <Link
                        to={`${post.createdBy.username}/post/${post.id}`}
                        key={post._id}
                        onClick={handlePostClick}
                    >
                        <Post {...post} />
                    </Link>
                ))}
        </div>
    );
}
