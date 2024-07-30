import React from "react";
import { Routes, Route, Router } from "react-router-dom";
import Nav from "./components/nav";
import Main from "./components/main";
import RightSideBar from "./components/rightSideBar";

function App() {
    return (
        <div className="flex min-h-screen max-w-[1200px] mx-auto">
            <Nav />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/search" element={<div>he</div>} />
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
