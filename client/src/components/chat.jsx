import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    setConversations,
    setCurrentConversation,
    setMessages,
    addMessage,
} from "../redux/chat/chatSlice";
import makeRequest from "../utils/makeRequest";
import socket from "../utils/socket";
import { useNavigate, useParams } from "react-router-dom";

const host = import.meta.env.VITE_SERVER_HOST;

const Chat = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { conversationId } = useParams();
    const conversations = useSelector((state) => state.chat.conversations);
    const currentConversation = useSelector(
        (state) => state.chat.currentConversation
    );
    const messages = useSelector((state) => state.chat.messages);
    const loggedUser = useSelector((state) => state.auth.user);
    const [text, setText] = useState("");
    const [isMobileView, setIsMobileView] = useState(true);

    // Fetch conversations
    useEffect(() => {
        const fetchConversations = async () => {
            const fetchUrl = `${host}/chat/conversations`;
            const { data } = await makeRequest(fetchUrl, "GET");
            dispatch(setConversations(data));
        };
        fetchCurrentConversation();
        fetchConversations();
    }, [dispatch]);

    const fetchCurrentConversation = useCallback(async () => {
        if (!conversationId) {
            return;
        }
        const fetchUrl = `${host}/chat/conversation/${conversationId}`;
        const { status, data } = await makeRequest(fetchUrl, "GET");
        if (status !== 200) {
            return;
        }
        dispatch(setCurrentConversation(data));
    });

    useEffect(() => {
        if (conversationId) {
            const fetchMessages = async () => {
                const fetchUrl = `${host}/chat/messages/${conversationId}`;
                const { data } = await makeRequest(fetchUrl, "GET");
                dispatch(setMessages(data));
            };

            fetchMessages();

            socket.emit("joinConversation", conversationId);

            const handleNewMessage = (message) => {
                dispatch(addMessage(message));
            };

            socket.on("new-message", handleNewMessage);

            return () => {
                socket.off("new-message", handleNewMessage);
            };
        }
    }, [conversationId, dispatch]);

    const handleConversationClick = (conversation) => {
        navigate(`/chat/${conversation._id}`);
        dispatch(setCurrentConversation(conversation));
        setIsMobileView(false);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        const messageData = {
            conversationId: currentConversation._id,
            sender: loggedUser._id,
            receiver: currentConversation.participants.find(
                (p) => p._id !== loggedUser._id
            )._id,
            text,
        };

        const headers = {
            "Content-Type": "application/json",
        };
        const body = JSON.stringify(messageData);
        const fetchUrl = `${host}/chat/send-message`;
        const { data } = await makeRequest(fetchUrl, "POST", headers, body);

        dispatch(addMessage(data));
        socket.emit("new-message", data);
        setText("");
    };

    if (!loggedUser) {
        navigate("/login");
        return null;
    }

    return (
        <div className="flex flex-col h-screen w-full lg:flex-row lg:ml-[250px] md:ml-[70px]">
            {/* Conversations List */}
            <div
                className={`lg:w-[400px] w-full border-r border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 ${
                    isMobileView ? "" : "hidden lg:block"
                }`}
            >
                <h2 className="text-xl font-bold mb-4">Conversations</h2>
                <div className="overflow-y-auto h-[calc(100vh-100px)]">
                    {conversations.map((conversation) => (
                        <div
                            key={conversation._id}
                            onClick={() =>
                                handleConversationClick(conversation)
                            }
                            className={`cursor-pointer p-2 flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all rounded-lg ${
                                currentConversation?._id === conversation._id
                                    ? "bg-gray-200 dark:bg-gray-800"
                                    : ""
                            }`}
                        >
                            {conversation.participants.map(
                                (participant) =>
                                    participant._id !== loggedUser._id && (
                                        <div
                                            key={participant._id}
                                            className="flex items-center"
                                        >
                                            <img
                                                src={participant.profilePicture}
                                                alt={participant.username}
                                                className="w-12 h-12 rounded-full mr-2 object-cover aspect-square"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {participant.username}
                                                </span>
                                                <span className="text-gray-500 dark:text-gray-400 text-sm">
                                                    {conversation.lastMessage ||
                                                        "No messages yet"}
                                                </span>
                                            </div>
                                        </div>
                                    )
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat View */}
            <div className="flex-1 p-4 flex flex-col bg-white dark:bg-gray-900">
                {currentConversation ? (
                    <>
                        {/* Back button for mobile view */}
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 lg:mb-0">
                            <div className="flex items-center">
                                {isMobileView && (
                                    <button
                                        onClick={() => setIsMobileView(true)}
                                        className="lg:hidden mr-2 text-blue-500"
                                    >
                                        &larr; Back
                                    </button>
                                )}
                                <img
                                    src={
                                        currentConversation.participants.find(
                                            (p) => p._id !== loggedUser._id
                                        )?.profilePicture
                                    }
                                    alt="Recipient"
                                    className="w-10 h-10 rounded-full mr-2 object-cover"
                                />
                                <h3 className="font-semibold text-lg">
                                    {
                                        currentConversation.participants.find(
                                            (p) => p._id !== loggedUser._id
                                        )?.username
                                    }
                                </h3>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800">
                            {messages.map((message) => (
                                <div
                                    key={message._id}
                                    className={`mb-2 flex ${
                                        message.sender._id === loggedUser._id
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`inline-block p-2 rounded-lg max-w-[75%] ${
                                            message.sender._id ===
                                            loggedUser._id
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                                        }`}
                                    >
                                        {message.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form
                            onSubmit={handleSendMessage}
                            className="flex items-center"
                        >
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Type your message..."
                                required
                                className="flex-1 border dark:border-gray-800 bg-transparent rounded-l-lg p-2 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white p-2 rounded-r-lg"
                            >
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex items-center justify-center flex-1">
                        <p className="text-gray-500 dark:text-gray-400">
                            Select a conversation to start chatting
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
