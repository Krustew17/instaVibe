import React, { useState } from "react";
import makeRequest from "../utils/makeRequest";

const ChangePassword = () => {
    const [isFocused, setIsFocused] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [data, setData] = useState({
        oldPassword: "",
        password: "",
        confirmPassword: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const host = import.meta.env.VITE_SERVER_HOST;

        const fetchUrl = `${host}/auth/password/change`;

        const headers = {
            "Content-Type": "application/json",
        };

        const body = JSON.stringify({
            oldPassword: data.oldPassword,
            newPassword: data.password,
            confirmPassword: data.confirmPassword,
        });

        try {
            const { status, data } = await makeRequest(
                fetchUrl,
                "POST",
                headers,
                body,
                true
            );
            console.log(data);

            if (status !== 200) {
                setError(data.message);
                setTimeout(() => {
                    setError("");
                }, 3000);
                return;
            }

            setSuccess(data.message);
            setTimeout(() => {
                setSuccess("");
            }, 3000);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="lg:m-6 mt-10 sm:min-w-[300px] md:min-w-[100px] flex flex-col gap-4 w-full md:max-w-[400px] xl:max-w-[500px] px-10 sm:px-6">
            <h1 className="text-2xl font-semibold">Change Password</h1>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                    <label
                        htmlFor="oldPassword"
                        className={`px-1 mb-1 select-none  ${
                            isFocused === "oldPassword"
                                ? "text-black dark:text-white"
                                : "text-gray-400 dark:text-gray-600"
                        }`}
                    >
                        Current Password
                    </label>
                    <input
                        className="border-2 border-slate-200 dark:border-gray-800 bg-transparent w-full p-2 rounded-md"
                        type="password"
                        placeholder="Current Password"
                        name="oldPassword"
                        id="oldPassword"
                        value={data?.oldPassword}
                        onChange={handleChange}
                        onFocus={() => setIsFocused("oldPassword")}
                        onBlur={() => setIsFocused("")}
                    />
                </div>
                <div className="flex flex-col">
                    <label
                        htmlFor="password"
                        className={`px-1 mb-1 select-none  ${
                            isFocused === "password"
                                ? "text-black dark:text-white"
                                : "text-gray-400 dark:text-gray-600"
                        }`}
                    >
                        New Password
                    </label>
                    <input
                        className="border-2 border-slate-200 dark:border-gray-800 bg-transparent w-full p-2 rounded-md"
                        type="password"
                        placeholder="New Password"
                        name="password"
                        id="password"
                        value={data?.password}
                        onChange={handleChange}
                        onFocus={() => setIsFocused("password")}
                        onBlur={() => setIsFocused("")}
                    />
                </div>
                <div className="flex flex-col">
                    <label
                        htmlFor="confirmPassword"
                        className={`px-1 mb-1 select-none  ${
                            isFocused === "confirmPassword"
                                ? "text-black dark:text-white"
                                : "text-gray-400 dark:text-gray-600"
                        }`}
                    >
                        Confirm Password
                    </label>
                    <input
                        className="border-2 border-slate-200 dark:border-gray-800 bg-transparent w-full p-2 rounded-md"
                        type="password"
                        placeholder="Confirm New Password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={data?.confirmPassword}
                        onChange={handleChange}
                        onFocus={() => setIsFocused("confirmPassword")}
                        onBlur={() => setIsFocused("")}
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}

                {success && <p className="text-green-500">{success}</p>}

                <button
                    type="submit"
                    className="py-2 px-8 max-w-[170px] self-center rounded-sm  border-none bg-blue-500 text-white"
                >
                    Save
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
