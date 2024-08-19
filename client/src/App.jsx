import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/nav";
import Main from "./components/home";
import RightSideBar from "./components/rightSideBar";
import PostDetails from "./components/postDetails";
import Search from "./components/Search";
import LoginPage from "./pages/loginPage";
import ResetPassword from "./pages/resetPassword";
import RegisterPage from "./pages/registerPage";
import ProfilePage from "./pages/profilePage";
import ProfileEdit from "./pages/profileEditPage";
import Notifications from "./components/Notifications";
import { useDispatch, useSelector } from "react-redux";
import { updateUnreadCount } from "./redux/notifications/notifSlice";
import { io } from "socket.io-client";
import Chat from "./components/chat";
import ProtectedRoute from "./components/protectedRoute";
import NotFound from "./components/notFound";

const socket = io(import.meta.env.VITE_SERVER_HOST);

function App() {
    const location = useLocation();
    const loggedUser = useSelector((state) => state.auth.user);

    const visibleRoutes = ["/", "/create", "/search", "/notifications"];

    // Determine if the right sidebar should be hidden
    const hideRightSideBar = !(
        visibleRoutes.some((route) => location.pathname === route) ||
        location.pathname.match(/^\/[^/]+\/post\/[^/]+$/)
    );
    const dispatch = useDispatch();

    useEffect(() => {
        if (location.pathname !== "/notifications") {
            socket.on("notification", (notification) => {
                if (notification.receiver !== loggedUser?._id) {
                    return;
                }
                dispatch(updateUnreadCount());
            });

            return () => {
                socket.off("notification");
            };
        }
    }, [dispatch, location.pathname, loggedUser?._id]);

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
                    <Route
                        path="/login"
                        element={
                            <ProtectedRoute
                                children={<LoginPage />}
                                to="/"
                                shouldBeAuthenticated={false}
                            />
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <ProtectedRoute
                                children={<RegisterPage />}
                                to="/"
                                shouldBeAuthenticated={false}
                            />
                        }
                    />
                    <Route
                        path="/reset-password"
                        element={
                            <ProtectedRoute
                                children={<ResetPassword />}
                                to="/"
                                shouldBeAuthenticated={false}
                            />
                        }
                    />
                    <Route path="/search" element={<Search />} />
                    <Route
                        path="/chat/:conversationId?"
                        element={
                            <ProtectedRoute
                                children={<Chat />}
                                to="/login"
                                shouldBeAuthenticated={true}
                            />
                        }
                    />
                    <Route
                        path="/notifications"
                        element={
                            <ProtectedRoute
                                children={<Notifications />}
                                to="/"
                                shouldBeAuthenticated={true}
                            />
                        }
                    />
                    <Route path="/:username" element={<ProfilePage />} />
                    <Route
                        path="/profile/edit"
                        element={
                            <ProtectedRoute
                                children={<ProfileEdit />}
                                to="/login"
                                shouldBeAuthenticated={true}
                            />
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            {!hideRightSideBar && <RightSideBar />}
        </div>
    );
}

export default App;
