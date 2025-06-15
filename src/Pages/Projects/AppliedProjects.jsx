import { useEffect, useState } from "react";
import { getAppliedProjects, cancelJoinRequest } from "../../Api/userApi";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AppliedProjects = () => {
    const [appliedProjects, setAppliedProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedProjectId, setExpandedProjectId] = useState(null);
    const navigate = useNavigate();

    // const currentUser = JSON.parse(localStorage.getItem("user"));
    // const currentUserId = currentUser?._id;

    useEffect(() => {
        const fetchAppliedProjects = async () => {
            try {
                const data = await getAppliedProjects();
                setAppliedProjects(data.projects || []);
            } catch (error) {
                console.error("Error fetching applied projects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppliedProjects();
    }, []);

    const toggleExpand = (projectId) => {
        setExpandedProjectId((prev) => (prev === projectId ? null : projectId));
    };

    const handleCancelRequest = async (projectId) => {
        const confirm = await Swal.fire({
            title: "Cancel Join Request?",
            text: "Are you sure you want to cancel your request to join this project?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, cancel it",
        });

        if (confirm.isConfirmed) {
            try {
                await cancelJoinRequest(projectId);
                setAppliedProjects((prev) => prev.filter(p => p._id !== projectId));
                Swal.fire("Cancelled", "Your join request has been cancelled.", "success");
            } catch (error) {
                console.error("Cancel error:", error);
                Swal.fire("Error", "Failed to cancel request. Try again.", "error");
            }
        }
    };

    const renderProjectCard = (project) => {
        const isExpanded = expandedProjectId === project._id;
        // const pendingRequest = project.pendingRequests?.find(req => req.user === currentUserId)

        return (
            <div
                key={project._id}
                className={`bg-white rounded-xl shadow-md p-5 cursor-pointer transition-shadow self-start ${isExpanded ? "shadow-xl h-auto" : "hover:shadow-lg h-44"}`}
                onClick={() => toggleExpand(project._id)}
            >
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-blue-800">{project.title}</h3>
                    {isExpanded && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(project._id);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                            aria-label="Close expanded project"
                        >
                            <FaTimes size={18} />
                        </button>
                    )}
                </div>

                <p className="text-sm text-gray-500 mt-1 mb-3">
                    {project.category || "Uncategorized"}
                </p>

                {!isExpanded ? (
                    <span className="text-gray-700 line-clamp-3 overflow-hidden">
                        <span className="font-semibold"> Description : </span>
                        <p className="text-gray-700 mb-4">{project.description.length > 100 ? project.description.slice(0, 100) + "..." : project.description}
                            {project.description}</p>
                    </span>
                ) : (
                    <>
                        <p className="text-gray-700 mb-4">
                            {project.description}</p>

                        <p className="text-sm text-gray-600 mb-2">
                            <strong>Applied Role:</strong> {project.appliedRole || "N/A"}
                        </p>

                        <p className="text-sm text-gray-600 mb-4">
                            <strong>Project Creator:</strong> {project.createdBy?.userName || "Unknown"}
                        </p>

                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-800 mb-2">
                                Members ({project.members?.length || 0}):
                            </h4>
                            {project.members?.length > 0 ? (
                                <ul className="text-gray-600 text-sm max-h-32 overflow-y-auto">
                                    {project.members.map((member) => (
                                        <li key={member.userId} className="mb-1">
                                            <span className="font-medium">{member.userName || "Unknown"}</span> - {member.role}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400 italic">No members yet.</p>
                            )}
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCancelRequest(project._id);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md font-semibold transition"
                        >
                            Cancel Request
                        </button>
                    </>
                )
                }
            </div >
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 px-6 py-10 font-sans">
            <div className="flex px-6">
                <div className="flex-shrink-0">
                    <img
                        src="Logo.png"
                        alt="Campus Collab Logo"
                        className="w-36 h-36 rounded-full shadow-2xl transition-all duration-300"
                    />
                </div>

                <div className="flex flex-col flex-grow ml-6 space-y-4">
                    <nav className="flex justify-between items-center bg-gradient-to-r from-white via-gray-100 to-white px-8 py-5 rounded-xl shadow-xl">
                        <h1 className="text-4xl font-extrabold text-blue-800 drop-shadow-md">
                            Campus <span className="text-gray-800">Collab</span>
                        </h1>
                        <button
                            onClick={() => navigate("/main")}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
                        >
                            Go to Main
                        </button>
                    </nav>
                </div>
            </div>

            <h2 className="text-3xl font-bold text-green-700 mb-8 text-center drop-shadow-md">
                Applied Projects
            </h2>

            {loading ? (
                <p className="text-center text-blue-600">Loading applied projects...</p>
            ) : appliedProjects.length === 0 ? (
                <p className="text-center text-gray-500">You haven't applied to any projects yet.</p>
            ) : (
                <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {appliedProjects.map((project) => renderProjectCard(project))}
                </div>
            )}
        </div>
    );
};

export default AppliedProjects;
