import { useState,useEffect, use } from 'react';
import React , {useContext} from 'react'
import {UserContext} from '../context/user.context';
import axios from  "../config/axios"
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const {user} = useContext(UserContext);
  const[isModalOpen, setIsModalOpen] = useState(false);
 const [projectName, setProjectName] = useState('');
const [project, setProject] = useState([]);

const navigate = useNavigate();

async function createProject(e) {
    e.preventDefault();
    console.log('create project');


    
    try {
      const response = await axios.post('/projects/create', {
        name: projectName,
        email: user.email 
      });
      
      console.log('Project created:', response.data);
      setIsModalOpen(false);
      setProjectName(''); // Reset form
      // You might want to refresh the projects list here
      
    } catch (err) {
      console.error('Error creating project:', err);
      if (err.response?.status === 401) {
        alert('You are not authenticated. Please log in again.');
        // You might want to redirect to login page here
      } else {
        alert('Failed to create project. Please try again.');
      }
    } 
  }

useEffect(() => {
  axios.get('/projects/all').then((response) => {
setProject(response.data.allUserProjects);
  }).catch((error) => { 
    console.log(error);
        setProject([]);
  });
}, []);

  return (
  
    <main className='p-6  min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white'>
  
<div className="hyperlinks flex gap-305 mb-6">
       <a 
       className="px-6 py-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 font-medium"
       href="/login">Click to Login</a>

<a 
       className="px-6 py-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 font-medium"
       href="/register">Click to Register</a>

</div>

      <div className="projects py-10 flex flex-wrap gap-3">
        <button 
        onClick={() => setIsModalOpen(true)}
        className="project p-3 border border-slate-300 rounded-md ">
        New Project
          <i className="ri-link ml-2"></i>
        </button>
{
          project.map((projectItem) => (
            <div key={projectItem._id}
            onClick={() =>{
               navigate(`/project`,{
              state:{projectId:projectItem._id}
            });
            }
            }       
             className="project p-4 flex flex-col gap-2 cursor-pointer border border-slate-300 rounded-md mb-4 min-w-52 hover:bg-purple-400 hover:text-black transition">
            
              <h2 className='font-semibold' >{projectItem.name}</h2>
  
  <div className='flex gap-2'>
  <p>  <small> <i className="ri-user-line"></i> Collaborators:</small> </p>
    {projectItem.users.length}
    </div>

            </div>
          ))
}
      </div>
    
    {isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
          <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
          <form
            onSubmit={createProject}
          >
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
            onChange={(e) => setProjectName(e.target.value)}
              value={projectName}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded text-black focus:outline-none focus:ring focus:border-blue-400 mb-4"
              placeholder="Enter project name"
              required
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
 

    </main>
  
  )
}

export default Home