import { Formik } from 'formik'
import * as Yup from 'yup';
import React, { useState } from 'react';
import { login } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [errorMsg, seterror] = useState('')
    const navigate = useNavigate();

    return (
        <>
            <header className="bg-blue-600 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold tracking-wide">Campus Collab</h1>
                    <nav className="space-x-4">
                        <a href="/" className="hover:underline text-lg font-medium">
                            Home
                        </a>
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
                        Login to Your Account
                    </h2>

                    <Formik
                        initialValues={{
                            email: '',
                            password: '',
                        }}
                        validationSchema={Yup.object({
                            email: Yup.string()
                                .email('Invalid email format')
                                // .matches(/@gniindia\.org$/, 'Only GNI emails are allowed')
                                .required('Email is required'),
                            password: Yup.string()
                                .min(6, 'Password must be at least 6 characters')
                                .required('Password is required'),
                        })}

                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            try {
                                await login(values)
                                    .then(data => {
                                        const { accesstoken, user } = data
                                        localStorage.setItem('token', accesstoken)

                                        localStorage.setItem('user', JSON.stringify(user))
                                    })
                                seterror('')
                                resetForm()
                                navigate('/main')
                            }
                            catch (error) {
                                const errorMsg = error.response?.data?.error || "Something went wrong.";
                                seterror(errorMsg)
                            }
                            finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ handleSubmit, handleChange, values, touched, errors }) => (
                            <form onSubmit={handleSubmit} className="space-y-4">

                                {errorMsg && (
                                    <div className="text-red-600 text-sm font-medium mb-4 text-center">
                                        {errorMsg}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Email</label>
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

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your password"
                                    />
                                    {touched.password && errors.password && (
                                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                    )}
                                </div>

                                <div className="text-center ">
                                    <a
                                        href="/forgot-password"
                                        className="text-blue-600 hover:underline text-x"
                                    >
                                        Forgot Password?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                                >
                                    Login
                                </button>
                            </form>
                        )}
                    </Formik>

                    <hr className="my-5 border-t border-gray-300" />

                    <div className="mt-3 text-center text-lg text-gray-600">
                        <button
                            onClick={() => navigate("/register")}
                            className="text-blue-600 font-medium hover:underline transition"
                        >
                            Create New Account
                        </button>
                    </div>

                </div>
            </section >
        </>
    );
};

export default Login;
