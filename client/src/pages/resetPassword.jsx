import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const ResetPassword = () => {
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const { userId, token } = useParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleShowPassword = (field) => {
        if (field === "password") {
            setShowPassword(!showPassword);
        } else if (field === "confirmPassword") {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const host = import.meta.env.VITE_SERVER_HOST;
        const fetchUrl = `${host}/auth/password/reset/${userId}/${token}`;
        const headers = {
            "Content-Type": "application/json",
        };

        const body = JSON.stringify({
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

            if (response.status !== 200) {
                setLoading(false);
                setError(data.message);
                return;
            }

            setLoading(false);
            setSuccessMessage(data.message);
            setError("");
            setTimeout(() => {
                navigate("/login");
            }, 3000);
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
                    Reset Your Password
                </h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="password" className="sr-only">
                                password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="password"
                                    required
                                    onChange={handleInputChange}
                                    className="relative block w-full px-3 py-2 border bg-transparent border-gray-300 dark:border-gray-800 placeholder-gray-500  rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                />
                                <span
                                    onClick={(e) =>
                                        toggleShowPassword("password")
                                    }
                                    className="absolute z-10 right-2 top-2.5 md:top-2 cursor-pointer text-sm text-blue-500 select-none"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="sr-only"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="confirmPassword"
                                    required
                                    onChange={handleInputChange}
                                    className="relative block w-full px-3 py-2 border bg-transparent border-gray-300 dark:border-gray-800 placeholder-gray-500  rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Confirm Password"
                                />
                                <span
                                    onClick={(e) =>
                                        toggleShowPassword("confirmPassword")
                                    }
                                    className="absolute z-10 right-2 top-2.5 md:top-2 cursor-pointer text-sm text-blue-500 select-none"
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </span>
                            </div>
                        </div>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    {successMessage && (
                        <p className="text-green-500">{successMessage}</p>
                    )}
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
