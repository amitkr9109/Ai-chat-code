import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../config/axios';
import { UserContext } from '../context/user.context';
import { toast } from 'react-toastify';

const Register = () => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const {setUser} = useContext(UserContext);

    const navigate = useNavigate();

    function submitHandler (e) {
        e.preventDefault();

        axios.post("/users/register", {
            email, password
        }).then((res) => {

            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);

            navigate("/home");
            toast.success("User Register successfully!");
            
        }).catch((err) => {
            if (err.response && err.response.data) {
                if (Array.isArray(err.response.data.errors)) {
                const validationMessages = err.response.data.errors.map(u => u.msg);
                validationMessages.forEach(msg => toast.error(msg));
                } else if (err.response.data.message) {
                toast.error(err.response.data.message);
                } else {
                toast.error("Something went wrong");
                }
            } else {
                toast.error("Server not responding");
            }
        })
    }

  return (
    <>
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className='text-2xl font-bold text-white mb-6'>Register</h2>
                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className='block text-gray-400 mb-2' htmlFor='email'>Email</label>
                        <input onChange={(e) => setEmail(e.target.value)} type="email" id='email' placeholder='Enter your email' className='w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500' />
                    </div>
                    <div className="mb-6">
                        <label className='block text-gray-400 mb-2' htmlFor='password'>Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" id='password' placeholder='Enter your password' className='w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500' />
                    </div>
                    <button type='submit' className='w-full p-3 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'>Register</button>
                </form>
                <p className='text-gray-400 mt-4'>Already have an account ? Please,  <Link to="/" className='text-blue-500 hover:underline'>Login Account</Link></p>
            </div>
        </div>
    </>
  )
}

export default Register
