import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProjectService } from '../API/ProjectService';

const CreateProject = () => {
  const [projectName, setProjectName] = useState('');
  const navigate = useNavigate();
  const formRef = useRef();

  const createProject = async (e) => {
    e.preventDefault();

    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    try {
      await createProjectService({ name: projectName });
      setProjectName('');
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='fixed inset-0'>
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="p-6 rounded-md shadow-md w-1/3 bg-gray-800">
          <h2 className='text-2xl mb-4 text-white font-semibold'>Create New Project</h2>
          <form ref={formRef} onSubmit={createProject}>
            <div className="mb-4">
              <label className='block text-sm font-medium text-gray-400'>Project Name</label>
              <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                type="text"
                className='mt-4 block w-full p-2 border border-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md'
                placeholder='Enter your project name'
                required
              />
            </div>
            <div className="flex justify-end">
              <button type='button' onClick={() => navigate("/home")}
                className='mr-2 px-4 py-2 bg-gray-300 rounded-md cursor-pointer active:scale-95 hover:bg-gray-400'>Cancel
              </button>
              <button type='submit' className='px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer active:scale-95 hover:bg-blue-800'>Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
