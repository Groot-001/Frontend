import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../Pages/User/HomePage";
import Register from "../Pages/User/Register";
import Login from "../Pages/User/LoginPage";
import ForgotPasswordPage from "../Pages/User/ForgetPasswordPage";
import VerifyEmail from "../Pages/User/VerifyEmail";
import VerifyResetLink from "../Pages//User/VerifyResetLink";
import ResetPassword from "../Pages/User/ResetPasswordPage";
import CreateProject from "../Pages/Projects/createProject";
import AllProjects from "../Pages/Projects/Allprojects";
import Main from "../Pages/Projects/Main";
import Dashboard from "../Pages/Projects/Dashboard";
import EditProject from "../Pages/Projects/EditProject";
import AppliedProjects from "../Pages/Projects/AppliedProjects";
import PendingRequests from "../Pages/Projects/PendingRequests";
import ContactUs from "../Pages/User/ContactUs";
import ProtectedRoute from "./ProtectedRoute";

const MyRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<VerifyResetLink />} />
                <Route path="/reset-password-form" element={<ResetPassword />} />
                <Route path="/contact" element={<ContactUs />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/getAllProjects"
                    element={
                        <ProtectedRoute>
                            <AllProjects />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/main"
                    element={
                        <ProtectedRoute>
                            <Main />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/createProject"
                    element={
                        <ProtectedRoute>
                            <CreateProject />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/editProject/:projectId"
                    element={
                        <ProtectedRoute>
                            <EditProject />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/appliedProjects"
                    element={
                        <ProtectedRoute>
                            <AppliedProjects />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/pendingrequests"
                    element={
                        <ProtectedRoute>
                            <PendingRequests />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default MyRoutes;
