import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import makeRequest from "../utils/makeRequest";
import Spinner from "./spinner.jsx";
import { useSelector } from "react-redux";

const ChatMessages = () => {
    const { conversationId } = useParams();
    const [messages, setMessages] = useState(null);
    const [loading, setLoading] = useState(false);
    const loggedUser = useSelector((state) => state.auth.user);

    const getConversationMessages = async () => {
        const fetchUrl = `${
            import.meta.env.VITE_SERVER_HOST
        }/chat/messages/${conversationId}`;
        const { status, data } = await makeRequest(fetchUrl, "GET");
        console.log(data);

        if (status === 404) {
            setMessages(null);
            return;
        }

        setMessages(data);
    };

    useEffect(() => {
        setLoading(true);
        getConversationMessages();
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <div className="xl:ml-[400px]">
                <Spinner />
            </div>
        );
    }
    return (
        <div className="w-full border-r-2 border-l-2 border-gray-100 dark:border-gray-800 min-h-screen pb-[50px] md:pb-0 overflow-y-auto ">
            <div>
                <div className="flex flex-col p-4">
                    {messages &&
                        messages.map((message) => (
                            <div
                                key={message._id}
                                className={`text-white px-4 py-1 rounded-xl max-w-fit mb-1 ${
                                    message.sender._id === loggedUser._id
                                        ? "ml-auto bg-blue-500"
                                        : "bg-gray-500"
                                }`}
                            >
                                {message.text}
                            </div>
                        ))}
                </div>
                <div className="fixed bottom-12 md:bottom-0 flex items-center bg-white dark:bg-black">
                    <input
                        type="text"
                        className="flex-1 border dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white rounded-l-lg p-2 focus:outline-none"
                        placeholder="Type your message here"
                    />
                    <button className="bg-blue-500 text-white p-2 rounded-r-lg">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatMessages;
