import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/nav";
import Main from "./components/home";
import RightSideBar from "./components/rightSideBar";
import PostDetails from "./components/postDetails";
import Search from "./components/Search";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import ProfilePage from "./pages/profilePage";
import ProfileEdit from "./pages/profileEditPage";
import Notifications from "./components/Notifications";
import { useDispatch } from "react-redux";
import { updateUnreadCount } from "./redux/notifications/notifSlice";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_HOST);

function App() {
    const location = useLocation();
    const hideRightSideBar =
        /^\/[^/]+(\/post|\/comment)?$/.test(location.pathname) ||
        location.pathname === "/profile/edit";

    const dispatch = useDispatch();

    useEffect(() => {
        if (location.pathname !== "notifications") {
            socket.on("notification", (notification) => {
                dispatch(updateUnreadCount());
            });

            return () => {
                socket.off("notification");
            };
        }
    }, [dispatch]);

    return (
        <div className="flex min-h-screen max-w-[1250px] mx-auto">
            <Nav />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route
                        path="/:username/post/:postId"
                        element={<PostDetails />}
                    />
                    <Route
                        path="/:username/post/:postId/comment/:commentId"
                        element={<PostDetails />}
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/chat" element={<div>he</div>} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/create" element={<div>he</div>} />
                    <Route path="/:username" element={<ProfilePage />} />
                    <Route path="/profile/edit" element={<ProfileEdit />} />
                </Routes>
            </main>
            {(!hideRightSideBar ||
                /\/search|\/chat|\/notifications|\/create/.test(
                    location.pathname
                )) && <RightSideBar />}
        </div>
    );
}

export default App;
