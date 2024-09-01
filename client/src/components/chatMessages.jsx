import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import makeRequest from "../utils/makeRequest";
import Spinner from "./spinner.jsx";

const ChatMessages = () => {
    const { conversationId } = useParams();
    const [messages, setMessages] = useState(null);
    const [loading, setLoading] = useState(false);

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
    }, []);

    if (loading) {
        return (
            <div className="xl:ml-[400px]">
                <Spinner />
            </div>
        );
    }
    if (messages === null) {
        return (
            <div className="flex justify-center items-center min-w-full -translate-x-32">
                Select a conversation to start chatting
            </div>
        );
    }
    return <div>test</div>;
};

export default ChatMessages;
