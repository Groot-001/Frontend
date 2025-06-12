import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { getPendingRequests, handleJoinRequest } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

const PendingRequests = () => {
    const [pendingProjects, setPendingProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedProjectId, setExpandedProjectId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const data = await getPendingRequests();
                setPendingProjects(data.projects || []);
            } catch (error) {
                console.error("Error fetching pending requests", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPending();
    }, []);

    const toggleExpand = (projectId) => {
        setExpandedProjectId((prev) => (prev === projectId ? null : projectId));
    };

    const handleAction = async (projectId, targetUserId, action) => {
        console.log("In pending :", projectId, targetUserId, action)
        const actionName = action === "approve" ? "Approve" : "Reject";

        const confirm = await Swal.fire({
            title: `${actionName} Join Request?`,
            text: `Are you sure you want to ${actionName.toLowerCase()} this user's join request?`,
            icon: action === "approve" ? "success" : "warning",
            showCancelButton: true,
            confirmButtonColor: action === "approve" ? "#28a745" : "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: `Yes, ${actionName.toLowerCase()} it`,
        });

        if (confirm.isConfirmed) {
            try {
                await handleJoinRequest(projectId, targetUserId, action);

                Swal.fire(`${actionName}d!`, `Request has been ${actionName.toLowerCase()}d.`, "success");

                setPendingProjects((prev) =>
                    prev
                        .map((proj) => {
                            if (proj._id !== projectId) return proj;

                            const updatedRequests = proj.pendingRequests.filter((req) => {
                                const id = req.user?._id || req.user;
                                return id.toString() !== targetUserId.toString();
                            });

                            return {
                                ...proj,
                                pendingRequests: updatedRequests,
                            };
                        })
                        .filter((proj) => proj.pendingRequests.length > 0)
                );

            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: error.message || `Failed to ${actionName.toLowerCase()} request. Try again.`,
                    icon: "error",
                });
            }
        }
    };

    const renderProjectCard = (project) => {
        const isExpanded = expandedProjectId === project._id;

        return (
            <div
                key={project._id}
                className={`bg-white rounded-xl shadow-md p-5 cursor-pointer transition-shadow self-start ${isExpanded ? "shadow-xl" : "hover:shadow-lg"}`}
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

                <p className="text-sm text-gray-500 mt-1 mb-3">{project.category || "Uncategorized"}</p>

                {!isExpanded ? (
                    <p className="text-gray-700 line-clamp-3 overflow-hidden">{project.description}</p>
                ) : (
                    <>
                        <p className="text-gray-700 mb-4">{project.description}</p>

                        <p className="text-sm text-gray-600 mb-4">
                            <strong>Project Creator:</strong> {project.createdBy?.userName || "Unknown"}
                        </p>

                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-800 mb-2">
                                Pending Requests ({project.pendingRequests?.length || 0}):
                            </h4>
                            {project.pendingRequests?.length > 0 ? (
                                <ul className="text-gray-600 text-sm max-h-48 overflow-y-auto space-y-2">
                                    {project.pendingRequests.map((req, index) => {
                                        const userObj = req.user;
                                        const targetUserId = userObj?._id || userObj;
                                        const userName = userObj?.userName || req.userName || "Unknown User";

                                        return (
                                            <li
                                                key={targetUserId || `req-${index}`}
                                                className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm"
                                            >
                                                <div>
                                                    <p className="font-medium">{userName}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Requested role: {req.role || "N/A"}
                                                    </p>
                                                </div>

                                                <div className="space-x-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAction(project._id, targetUserId, "approve");
                                                        }}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md font-semibold transition"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAction(project._id, targetUserId, "reject");
                                                        }}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md font-semibold transition"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="italic text-gray-400">No pending requests.</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-800 mb-2">
                                Members ({project.members?.length || 0}):
                            </h4>
                            {project.members?.length > 0 ? (
                                <ul className="text-gray-600 text-sm max-h-32 overflow-y-auto">
                                    {project.members.map((member) => (
                                        <li key={member.user._id || member.user} className="mb-1">
                                            <span className="font-medium">{member.user?.userName || "Unknown"}</span> -{" "}
                                            {member.role}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400 italic">No members yet.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
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

            <h2 className="text-3xl font-bold text-green-700 mb-8 text-center drop-shadow-md">
                Pending Join Requests
            </h2>

            {loading ? (
                <p className="text-center text-blue-600">Loading pending requests...</p>
            ) : pendingProjects.length === 0 ? (
                <p className="text-center text-gray-500">No pending join requests at the moment.</p>
            ) : (
                <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {pendingProjects.map((project) => renderProjectCard(project))}
                </div>
            )}
        </div>
    );
};

export default PendingRequests;
