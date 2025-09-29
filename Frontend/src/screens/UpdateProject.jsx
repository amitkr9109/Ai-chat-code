import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { updateProjectService } from '../API/ProjectService';
import { toast } from 'react-toastify';


const UpdateProject = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const [projectName, setProjectName] = useState('');

    const projectId = location.state?.project?._id;

    useEffect(() => {
        if (location.state?.project) {
            setProjectName(location.state.project.name);
        }
    }, [location.state]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!projectName) return alert("Project name is required");

        try {
            const updated = await updateProjectService(projectId, { name: projectName });
            navigate('/home');
            toast.success("Project update successfully!");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <form onSubmit={handleUpdate} className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className='text-2xl font-bold text-white mb-6'>Update Project</h2>
                <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className='w-full p-2 mb-4 rounded bg-gray-700 text-white' placeholder='Project Name' />
                <button type='submit' className='w-full p-3 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'>Update</button>
                <p className='text-gray-400 mt-4 text-center'>Don't want to update?&nbsp;<Link to="/home" className='text-blue-500 hover:underline'> Cancel and Go Back</Link></p>
            </form>
        </div>
    )
}

export default UpdateProject;


