import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
    return (
        <>
            <header className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="text-2xl sm:text-3xl font-bold text-blue-600 tracking-wide">
                            Campus Collab
                        </div>

                        <nav className="space-x-4 sm:space-x-6 text-gray-700 font-medium flex flex-wrap justify-center md:justify-start text-xl">
                            <Link to="/" className="hover:text-blue-600 transition">Home</Link>
                            <Link to="/register" className="hover:text-blue-600 transition">Register</Link>
                            <Link to="/login" className="hover:text-blue-600 transition">Login</Link>
                            <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
                        </nav>

                    </div>
                </div>
            </header>

            <main className="bg-gray-50 px-4 py-10">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center min-h-[66vh] overflow-y-auto">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                            Welcome to <span className="text-blue-600">Campus Collab</span>
                        </h1>
                        <p className="text-gray-600 mb-6 text-lg sm:text-xl md:text-3xl leading-relaxed">
                            A centralized platform for college students to collaborate, share resources,
                            and explore academic & creative opportunities together.
                        </p>
                        <div className="space-x-4">
                            <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition inline-block text-center">
                                Get Started
                            </Link>
                            <Link to="/contact" className="text-blue-600 font-semibold hover:underline ml-4">
                                Contact Us
                            </Link>
                        </div>
                    </div>

                    <div>
                        <img
                            src="Logo.png"
                            alt="Campus Collaboration"
                            className="w-full h-auto object-cover max-h-72 sm:max-h-96 rounded-xl"
                        />
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t mt-10 py-6">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-base sm:text-lg font-bold">
                    <p>&copy; {new Date().getFullYear()} Campus Collab. All rights reserved.</p>
                </div>
            </footer>
        </>
    )
}

export default HomePage
