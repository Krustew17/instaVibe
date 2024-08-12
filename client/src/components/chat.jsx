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
        <div className="flex max-h-screen md:ml-[70px] lg:ml-[250px] w-full">
            <div className="w-[400px] border-r border-gray-200 dark:border-gray-700 p-4">
                <h2 className="text-xl font-bold mb-4">Conversations</h2>
                {conversations.map((conversation) => (
                    <div
                        key={conversation._id}
                        onClick={() => handleConversationClick(conversation)}
                        className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        {conversation.participants.map((participant) => (
                            <div>
                                {participant._id !== loggedUser._id && (
                                    <div
                                        key={participant._id}
                                        className="flex items-center"
                                    >
                                        <img
                                            src={participant.profilePicture}
                                            alt={participant.username}
                                            className="w-10 h-10 rounded-full mr-2"
                                        />
                                        <span>{participant.username}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="w-full p-4 flex flex-col">
                {currentConversation ? (
                    <>
                        <div className="mb-4 max-h-screen overflow-auto px-2">
                            {messages.map((message) => (
                                <div
                                    key={message._id}
                                    className={`mb-2 ${
                                        message.sender._id === loggedUser._id
                                            ? "text-right"
                                            : "text-left"
                                    }`}
                                >
                                    <span
                                        className={`inline-block p-2 rounded-lg ${
                                            message.sender._id ===
                                            loggedUser._id
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 dark:bg-gray-700"
                                        }`}
                                    >
                                        {message.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendMessage} className="flex">
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Type your message..."
                                required
                                className="flex-1 border dark:border-gray-800 bg-transparent rounded-l-lg p-2"
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
                    <div>Select a conversation to start chatting</div>
                )}
            </div>
        </div>
    );
};

export default Chat;
