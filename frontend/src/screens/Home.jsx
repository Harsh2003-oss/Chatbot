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
    <>
    <main className='p-4'>
      <div className="projects flex flex-wrap gap-3">
        <button 
        onClick={() => setIsModalOpen(true)}
        className="project p-4 border border-slate-300 rounded-md">
        New Project
          <i className="ri-link ml-2"></i>
        </button>
{
          project.map((projectItem) => (
            <div key={projectItem._id}
            onClick={() =>{
               navigate(`/project`,{
              state:{projectItem}
            });
            }
            }       
             className="project p-4 flex flex-col gap-2 cursor-pointer border border-slate-300 rounded-md mb-4 min-w-52 hover:bg-slate-200">
            
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
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400 mb-4"
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
    </>
  )
}

export default Home