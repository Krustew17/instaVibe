import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineAccountCircle } from "react-icons/md";
import { FaTableCells } from "react-icons/fa6";
import makeRequest from "../utils/makeRequest.js";

const SearchComponent = () => {
    const [activeTab, setActiveTab] = useState("accounts");
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const host = import.meta.env.VITE_SERVER_HOST;
        const headers = {
            "Content-Type": "application/json",
        };
        const { status, data } = await makeRequest(
            `${host}/users/search?query=${query}`,
            "POST",
            headers
        );

        if (status !== 200) {
            setError(data.message);
            return;
        }
        setResults(data);
    };

    return (
        <div className="md:ml-[70px] lg:ml-[250px] flex flex-col min-h-screen mt-2 sm:mt-4">
            <div className="px-2">
                <form
                    onSubmit={handleSearch}
                    className="flex items-center border border-gray-300 dark:border-gray-800 rounded-md"
                >
                    <button className="">
                        {" "}
                        <FaSearch className="text-black dark:text-white ml-3" />
                    </button>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 px-4 py-2 border-none rounded-l-md focus:outline-none bg-transparent"
                    />
                </form>
            </div>
            <div className="mt-4 border-t border-gray-300 dark:border-gray-800 ">
                <div className="flex justify-center gap-6">
                    <button
                        className={`py-2 text-lg flex items-center gap-2 select-none ${
                            activeTab === "accounts"
                                ? "border-t-2 dark:border-white border-black"
                                : "text-gray-400 dark:text-gray-600"
                        }`}
                        onClick={() => setActiveTab("accounts")}
                    >
                        <MdOutlineAccountCircle /> Accounts
                    </button>
                    <button
                        className={`py-2 text-lg flex items-center gap-2 select-none ${
                            activeTab === "posts"
                                ? "border-t-2 dark:border-white border-black"
                                : "text-gray-400 dark:text-gray-600"
                        }`}
                        onClick={() => setActiveTab("posts")}
                    >
                        <FaTableCells /> Posts
                    </button>
                </div>
            </div>
            {(results && results.length > 0 && activeTab === "accounts" && (
                <div className="mt-2 border-gray-300 dark:border-gray-800 border-t">
                    {results.map((result) => (
                        <div
                            key={result._id}
                            className="flex items-center gap-4 p-2 cursor-pointer border-b border-gray-300 hover:bg-gray-200 dark:border-gray-800 dark:hover:bg-gray-900"
                        >
                            <img
                                src={result.profilePicture}
                                alt=""
                                className="w-10 h-10 rounded-full"
                            />
                            <p className="text-lg">
                                {result.displayName || result.username}
                            </p>
                        </div>
                    ))}
                </div>
            )) ||
                (results && results.length > 0 && activeTab === "posts" && (
                    <div>test</div>
                ))}
        </div>
    );
};

export default SearchComponent;
