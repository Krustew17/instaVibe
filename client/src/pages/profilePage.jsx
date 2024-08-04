import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import makeRequest from "../utils/makeRequest";
import Profile from "../components/profile.jsx";

export default function ProfilePage() {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);

    const fetchUser = async () => {
        const host = import.meta.env.VITE_SERVER_HOST;
        const fetchUrl = `${host}/users/${username}`;
        const { status, data } = await makeRequest(fetchUrl, "GET");
        console.log(data);
        if (status !== 200) {
            return window.location.replace("/");
        }
        setUserData(data);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="min-h-screen md:ml-[70px] lg:ml-[250px] px-4 md:px-0">
            <Profile {...userData} />
        </div>
    );
}
