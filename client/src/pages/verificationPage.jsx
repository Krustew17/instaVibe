import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import makeRequest from "../utils/makeRequest";

export default function VerificationPage() {
    const [verificationStatus, setVerificationStatus] =
        useState("Verifying...");
    const { userId, token } = useParams();
    const navigate = useNavigate();

    const verifyEmail = async (userId, token) => {
        try {
            const fetchUrl = `${
                import.meta.env.VITE_SERVER_HOST
            }/auth/verify-email/${userId}/${token}`;

            const { status, response } = await makeRequest(
                fetchUrl,
                "GET",
                null,
                null,
                false
            );

            if (status === 200) {
                setVerificationStatus(
                    "Email verified successfully! Redirecting..."
                );
                setTimeout(() => {
                    navigate("/login");
                }, 5000);
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error(error);
            return;
        }
    };

    useEffect(() => {
        verifyEmail(userId, token);
    }, [userId, token]);

    return (
        <div className="flex items-center justify-center min-h-screen lg:ml-[250px] md:ml-[70px]">
            <div className="p-10 rounded-lg shadow-lg text-center border dark:border-slate-800">
                <h2 className="text-3xl font-bold mb-4">Email Verification</h2>
                <h3
                    className={`${
                        verificationStatus.includes("success")
                            ? "text-green-500"
                            : ""
                    } text-3xl`}
                >
                    {verificationStatus}
                </h3>
            </div>
        </div>
    );
}
