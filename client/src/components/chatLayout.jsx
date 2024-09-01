import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Conversations from "./conversations";

function ChatLayout() {
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 768);
    const location = useLocation();

    useEffect(() => {
        function handleResize() {
            setIsWideScreen(window.innerWidth > 768);
        }

        window.addEventListener("resize", handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Check if we're exactly on the /settings route
    const isChatRoot = location.pathname === "/chat";

    return (
        <div className="flex gap-2 w-full basis-full">
            {(isWideScreen || isChatRoot) && <Conversations />}
            <Outlet />
        </div>
    );
}

export default ChatLayout;
