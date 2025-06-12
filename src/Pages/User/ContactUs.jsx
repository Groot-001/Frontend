import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";  // for form and error messages
import { FaArrowLeft } from "react-icons/fa"; // Used for icons
import { useNavigate } from "react-router-dom";
import { contactSchema } from '/Campus Collab/Shared/contactSchema'
import { contact } from "../../api/userApi";

const ContactUs = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (values, { resetForm }) => {
        await contact(values)
        setSubmitted(true);
        setTimeout(() => {
            resetForm();
            setSubmitted(false);
        }, 4000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
            <div className="absolute top-5 left-5">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center text-blue-700 hover:text-blue-900 font-semibold"
                >
                    <FaArrowLeft className="mr-2" /> Back to Home
                </button>
            </div>

            <img src="/Logo.png" alt="Campus Collab Logo" className="w-28 h-28 mb-4 rounded-full shadow-lg" />

            <h2 className="text-3xl font-bold text-blue-800 mb-8 drop-shadow-md">Contact Us</h2>

            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl animate-fadeIn">
                {submitted && (
                    <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-6 text-center font-semibold shadow">
                        Thanks for reaching out! We'll get back to you shortly.
                    </div>
                )}

                <Formik
                    initialValues={{ name: '', email: '', subject: '', message: '' }}
                    validationSchema={contactSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-gray-700 font-semibold mb-1">Name</label>
                                <Field
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 shadow-sm"
                                />
                                <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">Email</label>
                                <Field
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 shadow-sm"
                                />
                                <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-gray-700 font-semibold mb-1">Message</label>
                                <Field
                                    as="textarea"
                                    name="message"
                                    id="message"
                                    rows="4"
                                    className="w-full px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                                />
                                <ErrorMessage name="message" component="p" className="text-red-500 text-sm mt-1" />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold shadow-md transition-transform transform hover:scale-105"
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>

            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.5s ease-out;
                    }
                `}
            </style>
        </div>
    );
};

export default ContactUs;
