import React, { useEffect, useState } from 'react';
import { getAllProjects, joinProjectRequest } from '../../api/userApi';
import Swal from 'sweetalert2';

const AllProjects = () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');
    const [selectedRoles, setSelectedRoles] = useState({});

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getAllProjects();
                setProjects(data.projects || []);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch projects');
            }
        };

        fetchProjects();
    }, []);

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

    const handleRoleChange = (projectId, role) => {
        setSelectedRoles(prev => ({
            ...prev,
            [projectId]: role
        }));
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Explore All Projects</h2>

            {error && <p className="text-red-600 mb-6 text-center">{error}</p>}

            {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            className="bg-white border border-gray-200 rounded-lg shadow-md p-6 transition-transform transform hover:scale-[1.03]"
                        >
                            <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                            <p className="text-gray-600 mt-3 min-h-[60px]">{project.description}</p>
                            <p className="text-sm text-blue-600 mt-3">
                                Created By: <span className="font-medium">{project.createdBy?.userName || 'Unknown'}</span>
                            </p>

                            {project.roles && project.roles.length > 0 && (
                                <div className="mt-5">
                                    <label
                                        htmlFor={`role-select-${project._id}`}
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Select Role
                                    </label>
                                    <select
                                        id={`role-select-${project._id}`}
                                        className="w-full border border-gray-300 rounded-md text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={selectedRoles[project._id] || ''}
                                        onChange={(e) => handleRoleChange(project._id, e.target.value)}
                                    >
                                        <option value="">-- Select a Role --</option>
                                        {project.roles.map((role, idx) => (
                                            <option key={idx} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => handleJoin(project._id)}
                                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
                                    >
                                        Request to Join
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 text-lg mt-12">No projects found.</p>
            )}
        </div>
    );
};

export default AllProjects;
