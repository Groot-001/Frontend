import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { validateResetToken } from "../../Api/userApi";

const VerifyResetLink = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("Checking...");

    useEffect(() => {
        const token = searchParams.get("token");
        const id = searchParams.get("id");

        if (!token || !id) {
            setStatus("Invalid link.");
            return;
        }

        validateResetToken(id, token)
            .then(() => {
                navigate(`/reset-password-form?token=${token}&id=${id}`);
            })
            .catch((error) => {
                console.error(error);
                setStatus("Link is invalid or expired.");
            });
    }, [searchParams, navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
            {status}
        </div>
    );
};

export default VerifyResetLink;
