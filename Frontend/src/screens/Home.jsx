import React, { useContext } from 'react'
import { UserContext } from '../context/user.context'
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { allFetchedProjectService , deleteProjectService } from '../API/ProjectService';
import axios from '../config/axios';

const Home = () => {

  const { user } = useContext(UserContext);

  const [project, setProject] = useState([]);

  const navigate = useNavigate();

  const fetchProjects = async ()  => {
    try {
      const projects = await allFetchedProjectService();
      setProject(projects)
    } catch (error) {
      console.error(err);
    }
  };


  const handleLogout = async () => {
    try {
      await axios.get("/users/logout", { withCredentials: true });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.log(error)
    }
  }

  const DeleteHandler = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this project?");
    if (!confirm) return;
  
    try {
      await deleteProjectService(id);
      setProject(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);



  return (
    <main className='p-4 w-full min-h-screen bg-gray-900'>
      <div className="login-logout-container flex items-center justify-between">
        <Link to="/" className="text-gray-200 mb-2">Login...</Link>
        <button onClick={handleLogout} className='project px-4 py-2 rounded-md bg-red-500 text-white cursor-pointer active:scale-95 transition duration-300 hover:bg-red-600'>Logout</button>
      </div>
      <div className="projects flex items-center flex-wrap gap-3">
        <Link to="/create-project">
          <button className='project p-4 rounded-md bg-gray-50 cursor-pointer active:scale-95 shadow-white shadow-md hover:shadow-lg transition duration-300 border border-gray-400 hover:border-white'>New Project <i className="ri-link ml-2"></i></button>
        </Link>
      </div>

      <h2 className='font-semibold text-2xl mt-5 mb-2 text-gray-400'>All Projects Here...</h2>


      {project.length === 0 ? <div><p className='text-gray-400'>No Projects Create...</p></div> : <section>
        <h3 className='text-gray-400'>All Create Projects Here...</h3>
          <div className="flex items-center flex-wrap gap-20 mt-10 px-7">
              
          {project.map((project) => {
            return <div key={project._id} className="flex flex-col gap-2 bg-gray-200 cursor-pointer px-6 py-2 rounded-md shadow-white shadow-md hover:shadow-lg transition duration-300 border border-gray-400 hover:border-white">
              <h2 className='font-semibold'>Project Name :- {project.name}</h2>
              <div className="flex gap-2">
                <p> <small> <i className="ri-user-line"></i> Collaborators</small> :</p>
                {project.users.length}
              </div>
              <div className="logo-container flex items-center justify-between text-xl mt-2">
                <div className="view text-blue-600 active:scale-95" onClick={() => {
                  navigate(`/project-view`, { state: {project} })
                  }}><i className="ri-eye-fill"></i>
                </div>
                <div className="update text-yellow-500 active:scale-95" onClick={() => {
                  navigate(`/project-update`, { state: {project} })
                  }}><i className="ri-edit-circle-line"></i>
                </div>
                <div className="delete text-red-700 active:scale-95" onClick={() => {DeleteHandler(project._id)} }><i className="ri-delete-bin-fill"></i>
                </div>
              </div>
            </div>
            })
          }
          </div>
        </section>
      }

    </main>
  )
}

export default Home;
