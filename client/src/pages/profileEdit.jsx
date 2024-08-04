import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/auth/authSlice";

export default function ProfileEdit() {
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const [image, setImage] = useState(null);
    const [isFocused, setIsFocused] = useState("");
    const [data, setData] = useState({
        displayName: user?.displayName || "",
        username: user?.username || "",
        email: user?.email || "",
        bio: user?.description || "",
    });

    const fileInputRef = useRef(null);
    const [profilePicture, setProfilePicture] = useState(
        user?.profilePicture || ""
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            // Simulate upload and update the profile picture URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePicture = () => {
        setProfilePicture("/default_avatar.jpg");
        setImage("/default_avatar.jpg");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", image);
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
        if (response.status !== 200) {
            return;
        }
        const dataJson = await response.json();
        console.log(dataJson);

        dispatch(updateUser(dataJson));
    };

    return (
        <div className="sm:ml-[70px] md:ml-[250px]">
            <form
                className="px-2 mt-5 md:ml-[100px] flex flex-col gap-6"
                onSubmit={handleSubmit}
            >
                <strong className="text-xl">Edit Profile</strong>

                <div className="flex flex-wrap justify-between items-center">
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
                                className="px-6 border-none rounded-sm bg-black dark:bg-white dark:text-black text-white"
                                type="button"
                                onClick={handleIconClick}
                            >
                                Change
                            </button>
                        </label>
                        <button
                            className="px-6 border-none rounded-sm bg-black dark:bg-white dark:text-black text-white"
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
                        className="border-2 border-slate-200 dark:border-gray-800 bg-transparent w-full p-2 rounded-md"
                        type="text"
                        placeholder="email"
                        name="email"
                        id="email"
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
                        className="border-2 border-slate-200 dark:border-gray-800 bg-transparent w-full p-2 rounded-md"
                        placeholder="description"
                        name="bio"
                        id="bio"
                        onChange={handleChange}
                        value={data?.bio}
                        onFocus={() => setIsFocused("bio")}
                        onBlur={() => setIsFocused("")}
                    />
                </div>

                <button className="py-2 px-4 max-w-[170px] self-center rounded-sm border border-black hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black">
                    Save Changes
                </button>
            </form>
        </div>
    );
}
