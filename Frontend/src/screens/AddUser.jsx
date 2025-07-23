import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

const AddUser = () => {

  const location = useLocation();


  const [selectUserId, setSelectUserId] = useState([]);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const handleUserClick = (id) => {
    if (selectUserId.includes(id)) {
      setSelectUserId(selectUserId.filter(userId => userId !== id));
    } else {
      setSelectUserId([ ...selectUserId, id ]);
    }  
  };
  console.log(location.state.project._id);

  function addCollaborators() {
    axios.put("/projects/add-user", {
      projectId: location.state.project._id,
      users: Array.from(selectUserId)
    }).then(res => {
      console.log(res.data);
      navigate("/project-view", { state: { project: location.state?.project } })
    }).catch(err => {
      console.log(err)
    })
  }
    
  useEffect(() => {
    axios.get("/users/all-read").then(res => {
      setUsers(res.data.users)
    }).catch(err => {
      console.log(err)
    })
  }, []);

  console.log(selectUserId)

  return (
    <main className='min-h-screen w-full bg-gray-900'>
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-gray-800 p-4 rounded-md w-full max-w-md flex flex-col">
          <header className='flex items-center justify-between mb-4 text-gray-100'>
            <h2 className='text-xl font-semibold'>Select User</h2>
            <button onClick={() => navigate("/project-view", { state: { project: location.state?.project } })} className='text-xl cursor-pointer active:scale-105'><i className='ri-close-fill'></i></button>
          </header>
          <div className="flex flex-col gap-2 max-h-52 overflow-auto scrollbar-hide mb-4"> 
            {users.map(user => (
              <div key={user.id} className="flex flex-col">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer hover:bg-slate-500 transition-all active:scale-95 ${selectUserId.includes(user._id) ? 'bg-gray-600' : 'bg-slate-400'}`}onClick={() => handleUserClick(user._id)}>
                  <div className="w-fit h-fit flex items-center justify-center text-white p-4 aspect-square rounded-full bg-gray-600 cursor-pointer text-xl relative"><i className='ri-user-fill absolute'></i></div>
                  <h1 className='font-semibold'>{user.email}</h1>
                </div>
              </div>
            ))}
          </div> 
          <button onClick={addCollaborators} type='submit' className='w-full p-3 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer active:scale-95'>Add Collaborators</button>
        </div>
      </div>
    </main>
  )
}

export default AddUser;
