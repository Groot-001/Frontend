import { Formik } from 'formik';
import * as Yup from 'yup';
import React, { useState } from 'react';
import { forgetpassword } from '../../api/userApi';

const ForgotPasswordPage = () => {

    const [errorMsg, seterror] = useState('')
    const [successMsg, setsuccess] = useState('')

    return (
        <>
            <header className="bg-blue-600 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold tracking-wide">Campus Collab</h1>
                    <nav className="space-x-4">
                        <a href="/register" className="hover:underline text-lg font-medium">
                            Register
                        </a>
                        <a href="/login" className="hover:underline text-lg font-medium">
                            Login
                        </a>
                    </nav>
                </div>
            </header>

            <section className="bg-gray-100 min-h-screen flex items-center justify-center px-4">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                    <h2 className="text-2xl font-semibold text-center text-blue-700 mb-6">
                        Reset Your Password
                    </h2>

                    <Formik
                        initialValues={{ email: '' }}
                        validationSchema={Yup.object({
                            email: Yup.string()
                                .email('Invalid email format')
                                // .matches(/@gniindia\.org$/, 'Only GNI emails are allowed')
                                .required('Email is required'),
                        })}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            try {
                                const response = await forgetpassword(values)
                                seterror('')
                                setsuccess(response.message || "Forget Password successful")
                                resetForm()
                                setTimeout(() => {
                                    setsuccess('')
                                }, 4000);
                            }
                            catch (error) {
                                const errorMsg = error.response?.data?.error || "Forgot password error"
                                seterror(errorMsg)
                                setTimeout(() => {
                                    setsuccess('')
                                }, 4000);
                                console.log(error)
                            }
                            finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ handleSubmit, handleChange, values, touched, errors }) => (
                            <form onSubmit={handleSubmit} className="space-y-4">

                                {successMsg && (
                                    <div className="text-green-600 text-sm font-medium mb-4 text-center">
                                        {successMsg}
                                    </div>
                                )}

                                {errorMsg && (
                                    <div className="text-red-600 text-sm font-medium mb-4 text-center">
                                        {errorMsg}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1 text-center">Email</label>
                                    <input
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your email"
                                    />
                                    {touched.email && errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                                >
                                    Send Reset Link
                                </button>

                                <div className="text-center mt-4">
                                    <a href="/login" className="text-blue-600 hover:underline text-x">
                                        Back to Login
                                    </a>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </section>
        </>
    );
};

export default ForgotPasswordPage
