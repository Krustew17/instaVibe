import React, { useState, useRef } from "react";
export default function Test() {
    const [data, setData] = useState({
        description: "",
    });

    const fileInputRef = useRef(null);

    const handleFileChange = () => {
        const file = fileInputRef.current.files[0];
        setData({
            ...data,
            image: file,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    async function handleSubmission(e) {
        e.preventDefault();
        const token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTRjZTYyZTUxY2Y1NDAzN2NkYTgwOCIsImlhdCI6MTcyMjA4MjA3MiwiZXhwIjoxNzIyMDg1NjcyfQ.fwTJJZS4JhzadQ4XXQL6oVgFyZWo_yOk3JzQQNmnRQI";

        const formData = new FormData();
        formData.append("image", data.image);
        formData.append("description", data.description);

        if (!description && !image) return;

        const response = await fetch("http://127.0.0.1:3001/posts/create", {
            method: "POST",
            body: formData,
            headers: {
                authorization: `Bearer ${token}`,
            },
        });

        const responseJson = await response.json();

        console.log(responseJson);
    }

    return (
        <>
            <form onSubmit={handleSubmission}>
                <label htmlFor="description">Description</label>
                <input
                    type="text"
                    name="description"
                    id="description"
                    onChange={handleChange}
                />
                <label htmlFor="image">Image</label>
                <input
                    type="file"
                    name="image"
                    id="image"
                    required
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <button type="submit">Submit</button>
            </form>
        </>
    );
}
