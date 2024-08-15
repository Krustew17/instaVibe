import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center lg:ml-[250px] md:ml-[70px]">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl mb-4">
                Oops! The page you are looking for does not exist.
            </p>
            <Link to="/" className="text-blue-500 underline">
                Go back to the homepage
            </Link>
        </div>
    );
};

export default NotFound;
