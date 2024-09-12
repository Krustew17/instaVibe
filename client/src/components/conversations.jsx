import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../index.css";
import makeRequest from "../utils/makeRequest";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import socket from "../utils/socket";
import { setConversations, updateLastMessage } from "../redux/chat/chatSlice";

const Conversations = () => {
    const { conversationId } = useParams();
    const dispatch = useDispatch();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const loggedUser = useSelector((state) => state.auth.user);
    const conversations = useSelector((state) => state.chat.conversations);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchConversations = async () => {
            const host = import.meta.env.VITE_SERVER_HOST;
            const fetchUrl = `${host}/chat/conversations`;
            const { data } = await makeRequest(fetchUrl, "GET");
            dispatch(setConversations(data));
        };
        fetchConversations();
    }, []);

    useEffect(() => {
        socket.on("new-message", (data) => {
            dispatch(
                updateLastMessage({
                    conversationId: data.conversationId,
                    message: data.text,
                })
            );
        });
    });

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
                    {conversations?.map((conversation) => (
                        <Link
                            to={`/chat/${conversation._id}`}
                            key={conversation._id}
                            className={`flex hover:bg-gray-200 dark:hover:bg-gray-900 pl-4 pr-6 rounded-md py-2 ${
                                conversation.lastMessage.seen ||
                                conversationId === conversation._id
                                    ? "text-black dark:text-white"
                                    : "font-semibold"
                            }`}
                        >
                            {conversation?.participants.map(
                                (participant) =>
                                    participant._id !== loggedUser._id && (
                                        <div
                                            key={participant._id}
                                            className="flex"
                                        >
                                            <img
                                                src={`${participant.profilePicture}`}
                                                alt="avatar"
                                                className="w-12 h-12 rounded-full aspect-square"
                                            />
                                            <div className="flex flex-col ">
                                                <p className="ml-4">
                                                    {participant.username}
                                                </p>
                                                <p
                                                    className={`ml-4  text-sm ${
                                                        conversation.lastMessage
                                                            .seen ||
                                                        conversationId ===
                                                            conversation._id
                                                            ? "text-gray-400"
                                                            : "font-semibold text-gray-800"
                                                    }`}
                                                >
                                                    {conversation?.lastMessage
                                                        ?.text ||
                                                        "No messages yet"}
                                                </p>
                                            </div>
                                        </div>
                                    )
                            )}
                        </Link>
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
