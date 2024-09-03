import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../index.css";

const Conversations = () => {
    const { conversationId } = useParams();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={`flex h-screen ${!conversationId ? "min-w-full" : ""}`}>
            <div
                className="md:ml-[70px] lg:ml-[250px] py-4 border-r dark:border-gray-800 md:min-w-[300px] w-full md:w-0 lg:min-w-[350px] 
                h-full overflow-y-auto dark:scrollbar-red scrollbar-light"
            >
                <div className="mb-4">
                    <h1 className="font-semibold text-xl px-4">
                        Conversations
                    </h1>
                </div>
                <div className="flex flex-col">
                    {Array(24)
                        .fill(0)
                        .map((_, index) => (
                            <div
                                key={index}
                                className="flex hover:bg-gray-200 dark:hover:bg-gray-900 pl-4 pr-6 rounded-md py-2"
                            >
                                <img
                                    src="/default_avatar.jpg"
                                    alt="avatar"
                                    className="w-12 h-12 rounded-full aspect-square"
                                />
                                <div className="flex flex-col">
                                    <p className="ml-4">krustew17</p>
                                    <p className="ml-4 text-gray-500 text-sm">
                                        test
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            {!conversationId && !isMobile && (
                <div className="flex justify-center items-center w-full">
                    <h1 className="text-center text-xl xl:text-3xl mx-auto 2xl:translate-x-1/4">
                        Select a conversation to start chatting
                    </h1>
                </div>
            )}
        </div>
    );
};

export default Conversations;
