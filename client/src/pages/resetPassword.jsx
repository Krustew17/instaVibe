import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/auth/authSlice";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate, Link } from "react-router-dom";

const ResetPassword = () => {
    const [data, setData] = useState({});
    const navigate = useNavigate();
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
        const fetchUrl = `${host}/auth/login`;
        const headers = {
            "Content-Type": "application/json",
        };

        const body = JSON.stringify({
            email: data.email,
            password: data.password,
        });

        try {
            const response = await fetch(fetchUrl, {
                method: "POST",
                headers,
                body,
            });

            const data = await response.json();

            if (response.status !== 200) {
                setLoading(false);
                setError(data.message);
                return;
            }
            dispatch(login({ token: data.token, user: data.user }));
            navigate("/");
            setError("");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-2">
            <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-lg bg-transparent border-gray-200 dark:border-gray-800 border md:ml-[100px] lg:ml-[400px]">
                <h2 className="text-3xl font-extrabold text-center">
                    Send Password Reset Email
                </h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    autoComplete="email"
                                    required
                                    onChange={handleInputChange}
                                    className="relative block w-full px-3 py-2 border bg-transparent border-gray-300 dark:border-gray-800 placeholder-gray-500  rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md group hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
                            {loading ? (
                                <ClipLoader size={15} color={"#ffffff"} />
                            ) : (
                                "Reset Password"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
