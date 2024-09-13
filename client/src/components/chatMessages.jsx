import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import makeRequest from "../utils/makeRequest";
import Spinner from "./spinner.jsx";
import { useDispatch, useSelector } from "react-redux";
import socket from "../utils/socket";
import { setConversations } from "../redux/chat/chatSlice.js";

const ChatMessages = () => {
    const { conversationId } = useParams();
    const [messages, setMessages] = useState(null);
    const [receiver, setReceiver] = useState(null);
    const [loading, setLoading] = useState(false);
    const loggedUser = useSelector((state) => state.auth.user);
    const userToken = JSON.parse(localStorage.getItem("authState")).token;
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);
    const dispatch = useDispatch();
    const handleInput = (e) => {
        const { _, value } = e.target;
        setMessage(value);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView();
    };

    const getConversationMessages = async () => {
        const fetchUrl = `${
            import.meta.env.VITE_SERVER_HOST
        }/chat/messages/${conversationId}`;
        const { status, data } = await makeRequest(fetchUrl, "GET");

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
    }, [conversationId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const messageData = {
            conversationId,
            sender: loggedUser._id,
            receiver,
            text: message,
        };
        const body = JSON.stringify(messageData);
        const fetchUrl = `${
            import.meta.env.VITE_SERVER_HOST
        }/chat/send-message`;

        const response = await fetch(fetchUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
            },
            body: body,
        });
        if (response.status !== 200) {
            return;
        }

        const data = await response.json();
        handleNewMessage(data);
    };

    const fetchConversations = async () => {
        const fetchUrl = `${
            import.meta.env.VITE_SERVER_HOST
        }/chat/conversations`;

        const { data } = await makeRequest(fetchUrl, "GET");
        dispatch(setConversations(data));
    };

    const handleNewMessage = (message) => {
        setMessages([...messages, message]);
        fetchConversations();
        setMessage("");
    };

    const fetchReceiver = async () => {
        const fetchUrl = `${
            import.meta.env.VITE_SERVER_HOST
        }/chat/conversation/${conversationId}`;

        if (!conversationId) return;

        const { status, data } = await makeRequest(fetchUrl, "GET");
        if (status === 404) {
            return;
        }
        setReceiver(data);
    };

    useEffect(() => {
        fetchReceiver();
    }, [conversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, getConversationMessages]);

    useEffect(() => {
        if (conversationId) {
            socket.emit("joinConversation", conversationId);

            socket.on("new-message", handleNewMessage);
            return () => {
                socket.off("new-message", handleNewMessage);
            };
        }
    });

    useEffect(() => {
        if (loggedUser && loggedUser._id) {
            socket.emit("join-room", loggedUser._id);
        }
    }, [loggedUser]);

    if (loading) {
        return (
            <div className="xl:ml-[400px]">
                <Spinner />
            </div>
        );
    }
    return (
        <div className="w-full border-r-2 border-l-2 border-gray-100 dark:border-gray-800 h-screen pb-[50px] md:pb-[30px] overflow-y-auto">
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
                    <div ref={messagesEndRef} />{" "}
                </div>
                <form
                    className="fixed bottom-12 md:bottom-0 flex items-center bg-white dark:bg-black"
                    onSubmit={handleSendMessage}
                >
                    <input
                        type="text"
                        name="message"
                        required
                        autoComplete="off"
                        value={message}
                        onChange={handleInput}
                        className="border dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white rounded-l-lg p-2 focus:outline-none"
                        placeholder="Type your message here"
                    />
                    <button className="bg-blue-500 text-white p-2 rounded-r-lg">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatMessages;
