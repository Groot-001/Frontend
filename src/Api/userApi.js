import axios from 'axios'
import axiosInstance from './axiosInstance'

const BACKEND_URL = `http://localhost:5000`

export const register = async (user) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/register`, user)
        return response.data
    }

    catch (error) {
        console.log("Registration Error : ", error)
        throw error
    }
}

export const verifyEmail = async (id, token) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/verify-email`, {
            params: { id, token }
        });
        return response.data;
    } catch (error) {
        console.error("Email verification error", error);
        throw error;
    }
};

export const login = async (user) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/login`, user, {
            withCredentials: true
        }
        )
        return response.data

    }
    catch (error) {
        console.log("Logging in error", error)
        throw error
    }
}

export const contact = async (user) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/contact`, user, {
            withCredentials: true
        }
        )
        return response.data
    }
    catch (error) {
        console.log("Contacting error", error)
        throw error
    }
}

export const forgetpassword = async (user) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/forgot-password`, user)
        return response.data
    }
    catch (error) {
        console.log("Forgetting password error ", error)
        throw error
    }
}

export const validateResetToken = async (id, token) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/reset-password`, {
            params: { id, token }
        })
        return response.data
    }
    catch (error) {
        console.log("Reset Password error ", error)
        throw error
    }
}

export const resetPassword = async (id, token, password) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/reset-password`,
            { password },
            { params: { id, token } })
        return response.data
    }
    catch (error) {
        console.log("Reset Password error ", error)
        throw error
    }
}

export const logout = async () => {
    try {
        const response = await axios.post(`${BACKEND_URL}/logout`,
            {},
            { withCredentials: true }
        )
        return response.data

    }
    catch (error) {
        console.log("Logging out error : ", error)
        throw error
    }
}



export const createProject = async (project) => {
    try {
        const response = await axiosInstance.post('/createProject', project)
        return response.data
    }
    catch (error) {
        console.log("Project creation error", error)
        throw error
    }
}

export const getAllProjects = async () => {
    try {
        const response = await axiosInstance.get('/getAllProjects')
        return response.data
    }
    catch (error) {
        console.log("Getting Projects error", error)
        throw error
    }
}

export const getUserProjects = async () => {
    try {
        const response = await axiosInstance.get('/getUserProjects');
        return response.data;
    } catch (error) {
        console.error("Fetching user projects error", error);
        throw error;
    }
}

export const updateProject = async (projectId, updatedData) => {
    try {
        const response = await axiosInstance.put(`/updateProject/${projectId}`, updatedData);
        return response.data;
    } catch (error) {
        console.log("Project Updation error", error);
        throw error;
    }
}

export const deleteProject = async (projectId) => {
    try {
        const response = await axiosInstance.delete(`/deleteProject/${projectId}`);
        return response.data;
    } catch (error) {
        console.log("Project Deletion error", error);
        throw error;
    }
}


export const getAppliedProjects = async () => {
    try {
        const response = await axiosInstance.get('/getAppliedProjects');
        return response.data;
    } catch (error) {
        console.error("Fetching applied projects error", error);
        throw error;
    }
}

export const joinProjectRequest = async (projectId, role) => {
    try {
        const response = await axiosInstance.post(`/joinProject/${projectId}`, { role });
        return response.data;
    } catch (error) {
        console.error("Join project request error", error);
        throw error;
    }
}

export const cancelJoinRequest = async (projectId) => {
    try {
        const response = axiosInstance.post('/cancelrequest', { projectId });
        return response.data
    }
    catch (error) {
        console.error("Cancellation request error", error);
        throw error;
    }
};

export const handleJoinRequest = async (projectId, targetUserId, action) => {
    try {
        const response = await axiosInstance.post('/handleJoin', {
            projectId,
            targetUserId,
            action
        });
        return response.data;
    } catch (error) {
        console.error("Handle join request error", error);
        throw error;
    }
}


export const getPendingRequests = async () => {
    try {
        const response = await axiosInstance.get('/pendingrequests');
        return response.data;
    } catch (error) {
        console.error("Error fetching pending requests:", error);
        throw error;
    }
}











