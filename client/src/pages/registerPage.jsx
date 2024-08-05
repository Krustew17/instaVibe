import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";

const RegisterPage = () => {
    const [data, setData] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const host = import.meta.env.VITE_SERVER_HOST;
        const fetchUrl = `${host}/auth/register`;
        const headers = {
            "Content-Type": "application/json",
        };
        const body = JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
        });
        try {
            const response = await fetch(fetchUrl, {
                method: "POST",
                headers,
                body,
            });

            const data = await response.json();
            if (response.status !== 201) {
                setLoading(false);
                setError(data.message);
                return;
            }

            setError("");
            window.location.replace("/login");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen md:ml-[70px] lg:ml-[400px] px-4 md:px-0">
            <div className="w-full max-w-md p-8 space-y-8 rounded-2xl shadow-lg border-2 border-slate-200 dark:border-slate-900">
                <h2 className="text-3xl font-extrabold text-center ">
                    Create your account
                </h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="text-red-500 text-lg text-center font-bold">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                // value={username}
                                onChange={handleInputChange}
                                className="relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-800 placeholder-gray-500 bg-transparent  rounded-t-md 
                                focus:outline-none focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white focus:z-10 sm:text-sm"
                                placeholder="Username"
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                // value={email}
                                onChange={handleInputChange}
                                className="relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-800 placeholder-gray-500 bg-transparent focus:outline-none
                                 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                // value={password}
                                onChange={handleInputChange}
                                className="relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-800 placeholder-gray-500 bg-transparent focus:outline-none
                                 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="sr-only"
                            >
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                onChange={handleInputChange}
                                className="relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-800 placeholder-gray-500 bg-transparent rounded-b-md focus:outline-none
                                 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white focus:z-10 sm:text-sm"
                                placeholder="Confirm Password"
                            />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span>Already have an account?</span>
                        <Link to="/login" className="hover:underline">
                            Sign in
                        </Link>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="relative flex select-none justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black dark:text-black dark:bg-white border border-transparent rounded-md group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg
                                    className="w-5 h-5 text-black group-hover:text-white dark:text-white dark:group-hover:text-black"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="false"
                                    width={20}
                                    height={20}
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-4h2v2H9v-2zm1-8a1 1 0 00-.993.883L9 7v4a1 1 0 001.993.117L11 11V7a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                            {loading ? (
                                <ClipLoader size={15} color={"#ffffff"} />
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
