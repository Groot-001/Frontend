import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../../api/userApi';

const VerifyEmail = () => {
    const [verification, setVerification] = useState({ status: 'loading', message: '' });
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const id = searchParams.get('id');
        const token = searchParams.get('token');

        if (!id || !token) {
            setVerification({ status: 'error', message: 'Invalid verification link.' });
            return;
        }

        const verify = async () => {
            try {
                const response = await verifyEmail(id, token);
                setVerification({ status: 'success', message: response.message || 'Email verified successfully!' });
            } catch (error) {
                const errMsg = error.response?.data?.error || 'Verification failed. Try again later.';
                setVerification({ status: 'error', message: errMsg });
            }
        };

        verify();
    }, []);

    const { status, message } = verification;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                {status === 'loading' && (
                    <>
                        <h2 className="text-xl font-semibold text-blue-600">Verifying your email...</h2>
                        <p className="mt-2 text-gray-600">Please wait a moment.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <h2 className="text-xl font-semibold text-green-600">Success!</h2>
                        <p className="mt-2 text-gray-700">{message}</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <h2 className="text-xl font-semibold text-red-600">Oops!</h2>
                        <p className="mt-2 text-gray-700">{message}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
