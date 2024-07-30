import React, { useState, useRef } from "react";
import { FaImage, FaSearch, FaTimes } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";

export default function Main() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "for_you";

    const [query, setQuery] = useState("");
    const [gifs, setGifs] = useState([]);
    const [showGifModal, setShowGifModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedGif, setSelectedGif] = useState(null); // State for storing selected GIF URL
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearchClick = () => {
        fetchGifs();
    };

    const fetchGifs = async () => {
        setLoading(true);
        setError(null);

        const apiKey = "AIzaSyAqcfREir_kk_Y5BcaNXd34THhyU-2BDpA"; // Ensure this is your actual API key
        const url = `https://tenor.googleapis.com/v2/search?key=${apiKey}&q=${query}&limit=10`;

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
        // Handle file upload logic
    };

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    const selectGif = (gifUrl) => {
        setSelectedGif(gifUrl); // Store the selected GIF URL
        setShowGifModal(false);
    };

    const removeSelectedGif = () => {
        setSelectedGif(null); // Clear the selected GIF URL
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
                    src="../public/default_avatar.jpg"
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
                                className="w-full max-h-40 object-cover rounded-md" // Limit the GIF size
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
                                <FaImage className="text-xl" />
                            </button>
                        </div>
                        <button
                            onClick={() => setShowGifModal(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-full"
                        >
                            Add GIF
                        </button>
                        <button className="bg-blue-500 px-6 rounded-full text-sm font-bold text-white">
                            Post
                        </button>
                    </div>
                </div>
            </div>

            {showGifModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-3xl w-full h-[80vh] md:h-[50vh] overflow-auto">
                        {" "}
                        <h2 className="text-lg font-semibold mb-4 text-center">
                            Select a GIF
                        </h2>
                        <div className="flex items-center mb-4">
                            <input
                                type="text"
                                value={query}
                                onChange={handleInputChange}
                                placeholder="Search for GIFs"
                                className="border p-2 rounded-l-md flex-grow"
                            />
                            <button
                                onClick={handleSearchClick}
                                className="bg-blue-500 text-white p-2 rounded-r-md"
                            >
                                <FaSearch />
                            </button>
                        </div>
                        {loading && <p>Loading...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {gifs.map((gif) => (
                                <div
                                    key={gif.id}
                                    className="p-2 cursor-pointer"
                                    onClick={() =>
                                        selectGif(gif.media_formats.gif.url)
                                    }
                                >
                                    <img
                                        src={gif.media_formats.gif.url}
                                        alt={gif.content_description}
                                        className="w-full"
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowGifModal(false)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
