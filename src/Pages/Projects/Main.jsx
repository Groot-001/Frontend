import { useState, useEffect } from "react";
import { getAllProjects, getAppliedProjects, joinProjectRequest } from "../../Api/userApi";
import Sidebar from "./Sidebar";
import { FaSearch, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

const Main = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedProject, setExpandedProject] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState({});
    const [loading, setLoading] = useState(true);
    const [appliedProjects, setAppliedProjects] = useState([])

    useEffect(() => {
        const fetchAllProjects = async () => {
            try {
                const data = await getAllProjects();
                setProjects(data.projects || []);
                setFilteredProjects(data.projects || []);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        const appliedProjects = async () => {
            try {
                const data = await getAppliedProjects();
                setAppliedProjects(data.projects || [])
            }
            catch (error) {
                console.log("Fetching applied Projects ", error)
            }
        }

        fetchAllProjects();
        appliedProjects()
    }, [appliedProjects]);

    // For appliedProjects
    const isApplied = expandedProject
        ? appliedProjects.some(project => project._id === expandedProject._id)
        : false;


    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        const filtered = projects.filter((project) =>
            project.title.toLowerCase().includes(value.toLowerCase()) ||
            project.category?.toLowerCase().includes(value.toLowerCase()) ||
            project.roles?.some((role) => role.toLowerCase().includes(value.toLowerCase()))
        );

        setFilteredProjects(value.trim() === "" ? projects : filtered);
    };

    const handleRoleChange = (projectId, role) => {
        setSelectedRoles(prev => ({
            ...prev,
            [projectId]: role
        }));
    };

    const handleJoin = async (projectId) => {
        const selectedRole = selectedRoles[projectId];
        if (!selectedRole) {
            Swal.fire("Select Role", "Please select a role before joining.", "warning");
            return;
        }

        try {
            const res = await joinProjectRequest(projectId, selectedRole);
            Swal.fire("Success", res.success || "Join request sent.", "success");
        } catch (err) {
            Swal.fire("Error", err.response?.data?.error || "Failed to send join request.", "error");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex relative">
            <Sidebar />

            <div className="flex-1 pl-10 px-6 py-8">
                <div className="flex justify-center mb-8">
                    <h1 className="text-4xl font-extrabold text-blue-800 drop-shadow-lg tracking-wide">
                        Explore Projects
                    </h1>
                </div>

                <div className="flex justify-center mb-10">
                    <div className="w-full sm:w-2/3">
                        <div className="flex items-center border-2 border-blue-300 rounded-full px-5 py-3 shadow-md bg-white transition-all focus-within:ring-2 focus-within:ring-blue-400">
                            <FaSearch className="text-blue-500 mr-3 text-lg" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Search by title, role or category..."
                                className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-800 text-sm"
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500">Loading projects...</p>
                ) : filteredProjects.length === 0 ? (
                    <p className="text-center text-gray-500">No projects found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <div
                                key={project._id}
                                onClick={() => setExpandedProject(project)}
                                className="bg-white rounded-xl shadow-md p-5 h-40 cursor-pointer transition-shadow self-start hover:shadow-lg"
                            >
                                <h3 className="text-2xl font-bold text-blue-700 mb-2 text-center">
                                    {project.title}
                                </h3>
                                <p className="text-sm mb-3 text-black italic">
                                    <span className="font-semibold">Description:</span>{" "}
                                    {project.description.length > 100
                                        ? project.description.slice(0, 100) + "..."
                                        : project.description}
                                </p>
                                <p className="text-xs text-black italic">
                                    <span className="font-semibold">Category:</span>{" "}
                                    {project.category || "Uncategorized"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {expandedProject && (
                <div>
                    {
                        isApplied ? (
                            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
                                <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
                                    <button
                                        className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl"
                                        onClick={() => setExpandedProject(null)}
                                    >
                                        <FaTimes />
                                    </button>

                                    <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">
                                        {expandedProject.title}
                                    </h2>

                                    <p className="text-gray-700 text-md mb-4">
                                        <span className="font-semibold">Description: </span>
                                        {expandedProject.description}
                                    </p>

                                    <p className="text-gray-700 mb-2">
                                        <span className="font-semibold">Category: </span>
                                        {expandedProject.category || "Uncategorized"}
                                    </p>

                                    <p className="text-gray-700 mb-4">
                                        <span className="font-semibold">Created By: </span>
                                        {expandedProject.createdBy?.userName || "Unknown"}
                                    </p>

                                    {expandedProject.roles && expandedProject.roles.length > 0 && (
                                        <div>
                                            <button
                                                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
                                            >
                                                Requested
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
                                <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
                                    <button
                                        className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl"
                                        onClick={() => setExpandedProject(null)}
                                    >
                                        <FaTimes />
                                    </button>

                                    <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">
                                        {expandedProject.title}
                                    </h2>

                                    <p className="text-gray-700 text-md mb-4">
                                        <span className="font-semibold">Description: </span>
                                        {expandedProject.description}
                                    </p>

                                    <p className="text-gray-700 mb-2">
                                        <span className="font-semibold">Category: </span>
                                        {expandedProject.category || "Uncategorized"}
                                    </p>

                                    <p className="text-gray-700 mb-4">
                                        <span className="font-semibold">Created By: </span>
                                        {expandedProject.createdBy?.userName || "Unknown"}
                                    </p>

                                    {expandedProject.roles && expandedProject.roles.length > 0 && (
                                        <div>
                                            <label className="block mb-2 font-medium text-gray-700">
                                                Select Role:
                                            </label>
                                            <select
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={selectedRoles[expandedProject._id] || ""}
                                                onChange={(e) =>
                                                    handleRoleChange(expandedProject._id, e.target.value)
                                                }
                                            >
                                                <option value="">-- Select a Role --</option>
                                                {expandedProject.roles.map((role, idx) => (
                                                    <option key={idx} value={role}>
                                                        {role}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
                                                onClick={() => handleJoin(expandedProject._id)}
                                            >
                                                Request to Join
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }
                </div>
            )}
        </div>
    );
};

export default Main;
