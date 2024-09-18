import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";

const MAX_BIO_LENGTH = 150;

export default function ProfileEdit() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const [image, setImage] = useState(null);
    const [isFocused, setIsFocused] = useState("");
    const [data, setData] = useState({
        displayName: user?.displayName || "",
        username: user?.username || "",
        email: user?.email || "",
        bio: user?.description || "",
    });
    const [bioLength, setBioLength] = useState(
        MAX_BIO_LENGTH - data.bio.length
    );

    const fileInputRef = useRef(null);
    const [profilePicture, setProfilePicture] = useState(
        user?.profilePicture || ""
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });

        if (name === "bio") {
            setBioLength(MAX_BIO_LENGTH - value.length);
        }
    };

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePicture = () => {
        setProfilePicture("/default_avatar.jpg");
        setImage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (image) {
            formData.append("image", image);
        } else {
            formData.append("resetProfilePicture", true);
        }
        formData.append("displayName", data.displayName);
        formData.append("username", data.username);
        formData.append("email", data.email);
        formData.append("bio", data.bio);
        setIsFocused("");

        // Send the form data to the server
        const host = import.meta.env.VITE_SERVER_HOST;
        const fetchUrl = `${host}/users/update`;
        const response = await fetch(fetchUrl, {
            method: "PUT",
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const dataJson = await response.json();
        if (response.status !== 200) {
            setError(dataJson.message);
            setTimeout(() => {
                setError("");
            }, 1000);
            return;
        }

        dispatch(updateUser(dataJson));
        navigate(`/${data.username}`);
    };

    return (
        <div className="sm:min-w-[300px] md:min-w-[400px] xl:min-w-[500px] mt-4 pb-[50px] xl:m-6 md:pb-0 w-full md:w-0 px-6">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <strong className="text-xl">Edit Profile</strong>

                <div className="flex flex-wrap justify-between">
                    <img
                        className="w-[100px] h-[100px] rounded-full"
                        src={profilePicture || "/default_avatar.jpg"}
                        alt="profile"
                    />
                    <div className="flex gap-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            aria-label="upload a file"
                            className="hidden"
                            accept="image/*"
                        />
                        <label htmlFor="profilePictureInput">
                            <button
                                className="px-6  text-xs md:text-lg rounded-sm mt-6 h-10 border border-black hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
                                type="button"
                                onClick={handleIconClick}
                            >
                                Change
                            </button>
                        </label>
                        <button
                            className="px-6  text-xs md:text-lg rounded-sm mt-6 h-10 border border-black hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
                            type="button"
                            onClick={handleRemovePicture}
                        >
                            Remove
                        </button>
                    </div>
                </div>

                <div className="flex flex-col">
                    <label
                        htmlFor="username"
                        className={`px-1 mb-2 select-none  ${
                            isFocused === "username"
                                ? "text-black dark:text-white"
                                : "text-gray-400 dark:text-gray-600"
                        }`}
                    >
                        Username
                    </label>
                    <input
                        className="border-2 border-slate-200 dark:border-gray-800 bg-transparent w-full p-2 rounded-md"
                        type="text"
                        placeholder="username"
                        name="username"
                        id="username"
                        value={data?.username}
                        onChange={handleChange}
                        onFocus={() => setIsFocused("username")}
                        onBlur={() => setIsFocused("")}
                    />
                </div>
                <div className="flex flex-col">
                    <label
                        htmlFor="displayName"
                        className={`px-1 mb-2 select-none ${
                            isFocused === "displayName"
                                ? "text-black dark:text-white"
                                : "text-gray-400 dark:text-gray-600"
                        }`}
                    >
                        Display Name
                    </label>
                    <input
                        className="border-2 border-slate-200 dark:border-gray-800 bg-transparent w-full p-2 rounded-md"
                        type="text"
                        placeholder="display name"
                        name="displayName"
                        id="displayName"
                        value={data?.displayName}
                        onChange={handleChange}
                        onFocus={() => setIsFocused("displayName")}
                        onBlur={() => setIsFocused("")}
                    />
                </div>
                <div className="flex flex-col">
                    <label
                        htmlFor="email"
                        className={`px-1 mb-2 select-none  ${
                            isFocused === "email"
                                ? "text-black dark:text-white"
                                : "text-gray-400 dark:text-gray-600"
                        }`}
                    >
                        Email
                    </label>
                    <input
                        className="border-2 border-slate-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-950 cursor-not-allowed w-full p-2 rounded-md"
                        type="text"
                        placeholder="email"
                        name="email"
                        id="email"
                        disabled
                        value={data?.email}
                        onChange={handleChange}
                        onFocus={() => setIsFocused("email")}
                        onBlur={() => setIsFocused("")}
                    />
                </div>

                <div className="flex flex-col">
                    <label
                        htmlFor="bio"
                        className={`px-1 mb-2 select-none  ${
                            isFocused === "bio"
                                ? "text-black dark:text-white"
                                : "text-gray-400 dark:text-gray-600"
                        }`}
                    >
                        Bio
                    </label>
                    <textarea
                        className="border-2 border-slate-200 dark:border-gray-800 bg-transparent w-full p-2 rounded-md max-h-32"
                        placeholder="description"
                        name="bio"
                        id="bio"
                        onChange={handleChange}
                        value={data?.bio}
                        onFocus={() => setIsFocused("bio")}
                        onBlur={() => setIsFocused("")}
                    />
                    <small
                        className={`self-start text-sm ${
                            data.bio.length > MAX_BIO_LENGTH
                                ? "text-red-500"
                                : "text-gray-400 dark:text-gray-600"
                        }`}
                    >
                        {bioLength} / {MAX_BIO_LENGTH}
                    </small>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-red-500">{error}</h1>
                </div>
                <button className="py-2 px-4 max-w-[170px] self-center rounded-sm  border-none bg-blue-500 text-white">
                    Save Changes
                </button>
            </form>
        </div>
    );
}
