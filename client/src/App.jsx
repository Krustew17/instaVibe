import React from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/nav";
import Main from "./components/home";
import RightSideBar from "./components/rightSideBar";
import PostDetails from "./components/postDetails";
import Search from "./components/Search";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";

function App() {
    return (
        <div className="flex min-h-screen max-w-[1200px] mx-auto">
            <Nav />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route
                        path="/:username/post/:id"
                        element={<PostDetails />}
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/chat" element={<div>he</div>} />
                    <Route path="/notifications" element={<div>he</div>} />
                    <Route path="/create" element={<div>he</div>} />
                    <Route path="/profile" element={<div>he</div>} />
                </Routes>
            </main>
            <RightSideBar />
        </div>
    );
}

export default App;
