import { Formik } from 'formik'
import * as Yup from 'yup';
import React, { useState } from 'react'
import { register } from '../../Api/userApi'
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const departments = [
        "Computer Science",
        "Computer Science & Design",
        "Artificial Intelligence & Machine Learning",
        "Data Science",
        "Machine Learning",
        "Data Analytics",
        "Electronics & Communication",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Information Technology",
        "Others",
    ];

    const [errorMsg, seterror] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const navigate = useNavigate();

    return (
        <>
            <header className="bg-blue-600 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold tracking-wide">Campus Collab</h1>
                    <nav className="space-x-4">
                        <a href="/" className="hover:underline text-lg font-medium">Home</a>
                        <a href="/register" className="hover:underline text-lg font-medium">Register</a>
                        <a href="/login" className="hover:underline text-lg font-medium">Login</a>
                    </nav>
                </div>
            </header>

            <section className="bg-gray-100 min-h-screen flex items-center justify-center px-4">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                    <h2 className="text-2xl font-semibold text-center text-blue-700 mb-6">
                        Create Your Account
                    </h2>

                    <Formik
                        initialValues={{
                            userName: '',
                            email: '',
                            department: '',
                            password: '',
                        }}
                        validationSchema={Yup.object({
                            userName: Yup.string()
                                .required('Username is required')
                                .min(3, "At least 3 characters")
                                .max(20, "Up to 20 characters"),
                            email: Yup.string()
                                .email('Invalid email format')
                                // .matches(/@gniindia\.org$/, 'Only GNI emails are allowed') 
                                .required('Email is required'),
                            department: Yup.string()
                                .oneOf(departments, 'Please select a valid department')
                                .required('Department is required'),
                            password: Yup.string()
                                .min(6, 'At least 6 characters')
                                .required('Password is required'),
                        })}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            try {
                                const response = await register(values);
                                seterror('');
                                setSuccessMsg(response.message || "Registration successful!");
                                resetForm();
                                setTimeout(() => {
                                    setSuccessMsg('');
                                    navigate('/login');
                                }, 3000);
                            } catch (error) {
                                const errorMsg = error.response?.data?.error || "Registration error.";
                                seterror(errorMsg);
                                setTimeout(() => seterror(''), 4000);
                            } finally {
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
                                    <label className="block text-gray-700 font-medium mb-1">Username</label>
                                    <input
                                        name="userName"
                                        value={values.userName}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your username"
                                    />
                                    {touched.userName && errors.userName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
                                    )}
                                </div>

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
                                    <label className="block text-gray-700 font-medium mb-1">Department</label>
                                    <select
                                        name="department"
                                        value={values.department}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="" disabled>Select your department</option>
                                        {departments.map((dept) => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    {touched.department && errors.department && (
                                        <p className="text-red-500 text-sm mt-1">{errors.department}</p>
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

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                                >
                                    Register
                                </button>
                            </form>
                        )}
                    </Formik>


                    <div className="mt-6 text-center text-lg text-gray-600">
                        Already have an account?{" "}
                        <button
                            onClick={() => navigate("/login")}
                            className="text-blue-600 font-medium hover:underline transition"
                        >
                            Login here
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Register;
