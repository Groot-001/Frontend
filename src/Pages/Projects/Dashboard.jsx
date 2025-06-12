import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserProjects, deleteProject } from "../../api/userApi";
import { FaTimes } from "react-icons/fa";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userProjects, setUserProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedProject, setExpandedProject] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const userData = await getUserProjects();
                setUserProjects(userData.projects || []);
            } catch (error) {
                console.error("Could not fetch projects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleDelete = async (projectId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await deleteProject(projectId);
                setUserProjects((prev) => prev.filter((p) => p._id !== projectId));
                Swal.fire("Deleted!", "Your project has been deleted.", "success");
                if (expandedProject?._id === projectId) setExpandedProject(null);
            } catch (error) {
                Swal.fire("Error!", error.message || "Failed to delete project.", "error");
            }
        }
    };

    const renderProjectCard = (project) => (
        <div
            key={project._id}
            className="bg-white rounded-xl shadow-md p-5 cursor-pointer transition hover:shadow-lg self-start h-44"
            onClick={() => setExpandedProject(project)}
        >
            <h3 className="text-xl font-semibold text-blue-800">{project.title}</h3>
            <p className="text-sm text-gray-500 mt-1 mb-2">{project.category || "Uncategorized"}</p>
            <p className="text-gray-700 line-clamp-3">{project.description}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 font-sans px-6 py-10">
            <div className="flex px-6">
                <div className="flex-shrink-0">
                    <img src="Logo.png" alt="Campus Collab Logo" className="w-36 h-36 rounded-full shadow-2xl" />
                </div>
                <div className="flex flex-col flex-grow ml-6 space-y-4">
                    <nav className="flex justify-between items-center bg-gradient-to-r from-white via-gray-100 to-white px-8 py-5 rounded-xl shadow-xl">
                        <h1 className="text-4xl font-extrabold text-blue-800 drop-shadow-md">
                            Campus <span className="text-gray-800">Collab</span>
                        </h1>
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate("/main")}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
                            >
                                Go to Main
                            </button>
                        </div>
                    </nav>
                </div>
            </div>

            {loading ? (
                <p className="text-center text-blue-600 mt-12">Loading your projects...</p>
            ) : (
                <section className="mt-12 px-8">
                    <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">Your Projects</h2>
                    {userProjects.length === 0 ? (
                        <p className="text-center text-gray-500">You haven't created any projects yet.</p>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {userProjects.map(renderProjectCard)}
                        </div>
                    )}
                </section>
            )}

            {expandedProject && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center px-4 py-8">
                    <div className="bg-white max-w-2xl w-full rounded-lg p-6 relative shadow-xl overflow-y-auto max-h-[90vh]">
                        <button
                            onClick={() => setExpandedProject(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                            aria-label="Close expanded view"
                        >
                            <FaTimes size={20} />
                        </button>

                        <h2 className="text-2xl font-bold text-blue-800 mb-2">{expandedProject.title}</h2>
                        <p className="text-sm text-gray-500 mb-4">{expandedProject.category || "Uncategorized"}</p>
                        <p className="text-gray-700 mb-6">{expandedProject.description}</p>

                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-2">
                                Members ({expandedProject.members?.length || 0}):
                            </h4>
                            {expandedProject.members?.length > 0 ? (
                                <ul className="text-gray-600 text-sm max-h-32 overflow-y-auto">
                                    {expandedProject.members.map((member) => (
                                        <li key={member._id} className="mb-1">
                                            <span className="font-medium">{member.user.userName || "Unknown"}</span> - {member.role}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400 italic">No members yet.</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setExpandedProject(null);
                                    navigate(`/editProject/${expandedProject._id}`);
                                }}
                                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
                            >
                                ✏️ Edit
                            </button>
                            <button
                                onClick={() => handleDelete(expandedProject._id)}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
