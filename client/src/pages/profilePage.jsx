import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import makeRequest from "../utils/makeRequest";
import Profile from "../components/profile.jsx";
import Spinner from "../components/spinner.jsx";

export default function ProfilePage() {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchUser = async () => {
        setLoading(true);
        const host = import.meta.env.VITE_SERVER_HOST;
        const fetchUrl = `${host}/users/${username}`;
        try {
            const { status, data } = await makeRequest(fetchUrl, "GET");

            if (status !== 200) {
                return window.location.replace("/");
            }
            setUserData(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="md:ml-[70px] lg:ml-[250px]">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen md:ml-[70px] lg:ml-[250px] px-4 md:px-0">
            <Profile {...userData} />
        </div>
    );
}
