// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../../Api/userApi";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const token = searchParams.get("token");
    const id = searchParams.get("id");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await resetPassword(id, token, password);
            setMessage(res.message);
            setError("");
            setPassword("")
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong.");
            setMessage("");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-semibold mb-6">Reset Your Password</h2>
                {message && <p className="text-green-600 mb-4">{message}</p>}
                {error && <p className="text-red-600 mb-4">{error}</p>}
                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
