import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import Nav from "./components/nav";
import Main from "./components/home";
import RightSideBar from "./components/rightSideBar";
import PostDetails from "./components/postDetails";
import Search from "./components/Search";
import LoginPage from "./pages/loginPage";
import SendResetPasswordEmail from "./pages/sendResetPasswordEmail";
import ResetPassword from "./pages/resetPassword";
import RegisterPage from "./pages/registerPage";
import ProfilePage from "./pages/profilePage";
import ProfileEdit from "./pages/profileEditPage";
import Notifications from "./components/Notifications";
import { useDispatch, useSelector } from "react-redux";
import { updateUnreadCount } from "./redux/notifications/notifSlice";
import { io } from "socket.io-client";
import ProtectedRoute from "./components/protectedRoute";
import NotFound from "./components/notFound";
import VerificationPage from "./pages/verificationPage";
import ChangePassword from "./components/changePassword";
import SettingsLayout from "./components/settingsLayout";
import ChatLayout from "./components/chatLayout";
import ChatMessages from "./components/chatMessages";
import { logout } from "./redux/auth/authSlice";
import SessionExpired from "./components/sessionExpired";
import checkTokenExpirationNow from "./utils/checkExpiration";
import Privacy from "./components/privacy";

const socket = io(import.meta.env.VITE_SERVER_HOST);

function App() {
    const location = useLocation();
    const loggedUser = useSelector((state) => state.auth.user);
    const [sessionExpiredVisible, setSessionExpiredVisible] = useState(false);

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

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("authState"))?.token;
        if (token) {
            checkTokenExpirationNow(
                token,
                setSessionExpiredVisible,
                dispatch,
                logout
            );

            const checkTokenExpiration = setInterval(() => {
                checkTokenExpirationNow(
                    token,
                    setSessionExpiredVisible,
                    dispatch,
                    logout
                );
            }, 60000);

            return () => clearInterval(checkTokenExpiration);
        }
    }, [dispatch]);

    const hideSessionExpired = () => {
        setSessionExpiredVisible(false);
    };

    return (
        <div>
            {sessionExpiredVisible && (
                <SessionExpired onHide={hideSessionExpired} />
            )}
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
                            path="/reset-password/:userId/:token"
                            element={
                                <ProtectedRoute
                                    children={<ResetPassword />}
                                    to="/"
                                    shouldBeAuthenticated={false}
                                />
                            }
                        />
                        <Route
                            path="/reset-password"
                            element={
                                <ProtectedRoute
                                    children={<SendResetPasswordEmail />}
                                    to="/"
                                    shouldBeAuthenticated={false}
                                />
                            }
                        />
                        <Route path="/search" element={<Search />} />
                        <Route path="/chat" element={<ChatLayout />}>
                            <Route path="" element={<div></div>} />
                            <Route
                                path=":conversationId"
                                element={
                                    <ProtectedRoute
                                        children={<ChatMessages />}
                                        to="/login"
                                        shouldBeAuthenticated={true}
                                    />
                                }
                            />
                        </Route>
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
                        <Route
                            path="/verify-email/:userId/:token"
                            element={
                                <ProtectedRoute
                                    children={<VerificationPage />}
                                    to="/"
                                    shouldBeAuthenticated={false}
                                />
                            }
                        />
                        <Route path="/settings" element={<SettingsLayout />}>
                            <Route path="" element={<div></div>} />
                            <Route
                                path="profile/edit"
                                element={
                                    <ProtectedRoute
                                        children={<ProfileEdit />}
                                        to="/login"
                                        shouldBeAuthenticated={true}
                                    />
                                }
                            />
                            <Route
                                path="/settings/change-password"
                                element={
                                    <ProtectedRoute
                                        children={<ChangePassword />}
                                        to="/login"
                                        shouldBeAuthenticated={true}
                                    />
                                }
                            />
                            <Route
                                path="/settings/privacy"
                                element={
                                    <ProtectedRoute
                                        children={<Privacy />}
                                        to="/login"
                                        shouldBeAuthenticated={true}
                                    />
                                }
                            />
                            {/* Add more settings routes here */}
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                {!hideRightSideBar && <RightSideBar />}
            </div>
        </div>
    );
}

export default App;
