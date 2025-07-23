import React from 'react';
import { Routes, BrowserRouter, Route } from 'react-router-dom';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Home from '../screens/Home';
import Project from '../screens/Project';
import CreateProject from '../screens/CreateProject';
import AddUser from '../screens/AddUser';
import UpdateProject from '../screens/UpdateProject';
import UserAuth from '../auth/UserAuth';

const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/home' element={<UserAuth><Home /></UserAuth>} />
            <Route path='/register' element={<Register />} />
            <Route path='/create-project' element={<CreateProject />} />
            <Route path='/project-view' element={<UserAuth><Project /></UserAuth>} />
            <Route path='/add-user' element={<AddUser />} />
            <Route path='/project-update' element={<UpdateProject /> } />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes;
