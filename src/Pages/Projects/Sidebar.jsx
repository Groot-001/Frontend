import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaProjectDiagram, FaCheckCircle, FaTimesCircle, FaPlusCircle, FaSignOutAlt } from "react-icons/fa";
import { logout } from "../../api/userApi";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const baseBtnClasses =
        "flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 font-semibold text-gray-700";

    const activeBtnClasses = "bg-blue-600 text-white shadow-md";
    const inactiveBtnHoverClasses = "hover:bg-blue-100";

    const handleLogout = async () => {
        try {
            await logout()
            localStorage.clear()
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <aside className="w-64 min-h-screen bg-white shadow-lg flex flex-col items-center py-8 space-y-10 sticky top-0">
            <img
                src="/Logo.png"
                alt="Campus Collab Logo"
                className="w-24 h-24 rounded-full shadow-lg mb-2"
            />
            <h2 className="text-2xl font-bold text-blue-700 mb-8 select-none">Campus Collab</h2>

            <nav className="w-full px-6 space-y-3 flex flex-col flex-grow">
                <button
                    onClick={() => navigate("/main")}
                    className={`${baseBtnClasses} ${isActive("/main") ? activeBtnClasses : inactiveBtnHoverClasses}`}
                    aria-current={isActive("/main") ? "page" : undefined}
                >
                    <FaHome className="mr-3 text-lg" />
                    Home
                </button>

                <button
                    onClick={() => navigate("/dashboard")}
                    className={`${baseBtnClasses} ${isActive("/dashboard") ? activeBtnClasses : inactiveBtnHoverClasses}`}
                    aria-current={isActive("/dashboard") ? "page" : undefined}
                >
                    <FaProjectDiagram className="mr-3 text-lg" />
                    Your Projects
                </button>

                <button
                    onClick={() => navigate("/appliedProjects")}
                    className={`${baseBtnClasses} ${isActive("/applied-projects") ? activeBtnClasses : inactiveBtnHoverClasses}`}
                    aria-current={isActive("/applieProjects") ? "page" : undefined}
                >
                    <FaCheckCircle className="mr-3 text-lg" />
                    Applied Projects
                </button>

                <button
                    onClick={() => navigate("/pendingrequests")}
                    className={`${baseBtnClasses} ${isActive("/pending-requests") ? activeBtnClasses : inactiveBtnHoverClasses}`}
                    aria-current={isActive("/pendingrequests") ? "page" : undefined}
                >
                    <FaTimesCircle className="mr-3 text-lg" />
                    Pending Requests
                </button>

                <hr className="my-6 border-gray-200" />

                <button
                    onClick={() => navigate("/createProject")}
                    className={`${baseBtnClasses} ${isActive("/create-project") ? "bg-purple-600 text-white shadow-md" : "text-purple-700 hover:bg-purple-100"}`}
                    aria-current={isActive("/createProject") ? "page" : undefined}
                >
                    <FaPlusCircle className="mr-3 text-lg" />
                    Add New Project
                </button>

                <button
                    onClick={handleLogout}
                    className="mt-auto flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 font-semibold text-red-600 hover:bg-red-100"
                    aria-label="Logout"
                >
                    <FaSignOutAlt className="mr-3 text-lg" />
                    Logout
                </button>
            </nav>
        </aside>
    );
};

export default Sidebar;
