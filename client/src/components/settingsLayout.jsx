import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Test from "./test";

function SettingsLayout() {
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
    const isSettingsRoot = location.pathname === "/settings";

    return (
        <div className="flex gap-2 w-full basis-full">
            {(isWideScreen || isSettingsRoot) && <Test />}
            <Outlet />
        </div>
    );
}

export default SettingsLayout;
