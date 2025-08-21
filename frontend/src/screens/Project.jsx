import React, { useState, useEffect } from 'react'
import axios from '../config/axios'
import { useLocation } from 'react-router-dom'

const Project = () => {
    const location = useLocation();
  
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [project, setProject] = useState(location.state.project);
    const [projectCollaborators, setProjectCollaborators] = useState([]); // Add this state

    const handleUserSelect = (userId) => {
        console.log('Clicking user ID:', userId);
        console.log('Current selectedUsers:', selectedUsers);
        console.log('User ID type:', typeof userId);
        
        // Ensure userId is treated as string for consistent comparison
        const userIdStr = String(userId);
        
        setSelectedUsers(prev => {
            // Convert all IDs to strings for comparison
            const prevStrings = prev.map(id => String(id));
            const isSelected = prevStrings.includes(userIdStr);
            
            console.log('Is user already selected?', isSelected);
            console.log('Previous IDs as strings:', prevStrings);
            console.log('User ID as string:', userIdStr);
            
            const newSelection = isSelected
                ? prev.filter(id => String(id) !== userIdStr)
                : [...prev, userIdStr];
            
            console.log('New selection:', newSelection);
            return newSelection;
        });
    };

    function addCollaborators() {
        axios.put('/projects/add-user', {
            projectId: location.state.projectId,
            users: Array.from(selectedUsers)
        }).then((response) => {
            console.log(response.data);
            // Refresh project collaborators after adding
            fetchProjectWithCollaborators();
            setSelectedUsers([]); // Clear selected users after adding
        }).catch((error) => {
            console.error('Error adding collaborators:', error);
        });
    }

    // Add function to fetch project collaborators
    const fetchProjectCollaborators = async () => {
        try {
            const response = await axios.get(`/projects/get-project/${location.state.projectId}`);
            setProject(response.data.project);
            
            console.log('Project data:', response.data.project); // Debug log
            
            // The project has a 'users' array with user IDs (not 'collaborators')
            if (response.data.project.users && response.data.project.users.length > 0) {
                console.log('Project users array:', response.data.project.users); // Debug log
                
                // Since you already have all users loaded, find matching users from the users state
                // If users state is not loaded yet, we'll update collaborators when users are loaded
                if (users.length > 0) {
                    const projectUserIds = response.data.project.users.map(id => String(id));
                    const collaborators = users.filter(user => 
                        projectUserIds.includes(String(user._id || user.id))
                    );
                    console.log('Found collaborators:', collaborators); // Debug log
                    setProjectCollaborators(collaborators);
                } else {
                    // Users not loaded yet, we'll handle this in useEffect
                    console.log('Users not loaded yet, will update collaborators after users are fetched');
                }
            } else {
                setProjectCollaborators([]);
            }
        } catch (error) {
            console.error('Error fetching project collaborators:', error);
        }
    };

    // Real API call
    useEffect(() => {
        // Fetch all users first
        axios.get('/projects/allusers').then((response) => {
            console.log('API Response:', response.data.users);
            console.log('First user structure:', response.data.users[0]);
            
            const usersWithStringIds = response.data.users.map(user => ({
                ...user,
                id: String(user.id || user._id)
            }));
            console.log('Processed users:', usersWithStringIds);
            setUsers(usersWithStringIds);
            
            // After users are loaded, fetch project and set collaborators
            fetchProjectWithCollaborators(usersWithStringIds);
        }).catch((error) => {
            console.error('Error fetching users:', error);
        });
    }, []);

    // Separate function to fetch project and match collaborators
    const fetchProjectWithCollaborators = async (allUsers = users) => {
        try {
            const response = await axios.get(`/projects/get-project/${location.state.projectId}`);
            setProject(response.data.project);
            
            console.log('Project data:', response.data.project);
            
            if (response.data.project.users && response.data.project.users.length > 0) {
                console.log('Project users array:', response.data.project.users);
                
                // Match project user IDs with the users from allUsers array
                const projectUserIds = response.data.project.users.map(id => String(id));
                const collaborators = allUsers.filter(user => 
                    projectUserIds.includes(String(user._id || user.id))
                );
                
                console.log('Project user IDs:', projectUserIds);
                console.log('Found collaborators:', collaborators);
                setProjectCollaborators(collaborators);
            } else {
                setProjectCollaborators([]);
            }
        } catch (error) {
            console.error('Error fetching project:', error);
        }
    };

    return (
        <>
            <main className='h-screen w-screen flex'>
                <section className='flex relative flex-col left h-full min-w-96 bg-slate-300'>
                    <header className='flex justify-between items-center p-2 px-4 w-full bg-slate-100'>
                      

                      
                        <button
                            className='flex gap-2 hover:bg-slate-200 px-3 py-2 rounded-md transition-colors'
                            onClick={() => setIsModalOpen(true)}
                        >
                            <i className="ri-add-fill mr-1"></i>
                            <p>Add Collaborator</p>
                        </button>
                        
                        <button
                            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                            className='p-2 hover:bg-slate-200 rounded-md transition-colors'>
                            <i className="ri-group-line"></i>
                        </button>
                    </header>

                    <div className="conversation-area flex flex-grow flex-col">
                        <div className="message-box p-1 flex-grow flex flex-col gap-2">
                            <div className="max-w-56 message flex flex-col gap-1 bg-slate-50 w-fit rounded-md p-2">
                                <small className='opacity-65 text-xs'>example@gmail.com</small>
                                <p className='text-sm'>Lorem ipsum dolor sit amet.</p>
                            </div>

                            <div className="ml-auto max-w-56 message flex flex-col gap-1 bg-slate-50 w-fit rounded-md p-2">
                                <small className='opacity-65 text-xs'>example@gmail.com</small>
                                <p className='text-sm'>Lorem ipsum dolor sit amet.</p>
                            </div>
                        </div>
                        
                        <div className="input-field w-full flex">
                            <input
                                className='p-2 flex-grow px-4 border-none outline-none'
                                type="text" placeholder='Enter message' />
                            <button className='px-5 bg-slate-950 text-white hover:bg-slate-800 transition-colors'>
                                <i className="ri-send-plane-fill"></i>
                            </button>
                        </div>
                    </div>

                    <div className={`sidePanel w-full h-full bg-slate-50 flex flex-col gap-2 absolute top-0 left-0 transition-transform duration-300 ease-in-out ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <header className='flex justify-between items-center px-4 p-2 bg-slate-200'>
                            <h1 className='font-semibold'>Collaborators</h1>
                            <button 
                                onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                                className='p-2 hover:bg-slate-300 rounded-md transition-colors'>
                                <i className="ri-close-line"></i>
                            </button>
                        </header>
  
                        <div className="users flex flex-col gap-2 p-2">
                            {/* Show existing project collaborators */}
                            <div className="project-collaborators">
                                <h3 className="font-semibold mb-2 text-gray-700">Project Collaborators ({projectCollaborators.length})</h3>
                                {projectCollaborators.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No collaborators yet</p>
                                ) : (
                                    projectCollaborators.map(collaborator => (
                                        <div key={collaborator._id || collaborator.id} className="user hover:bg-slate-200 p-2 flex gap-2 items-center transition-colors rounded">
                                            <div className='w-8 h-8 rounded-full flex items-center justify-center text-white bg-slate-500'>
                                                <i className="ri-user-fill"></i>
                                            </div>
                                            <h4 className='font-semibold'>{collaborator.email}</h4>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Show selected users (pending to be added) */}
                            {selectedUsers.length > 0 && (
                                <div className="selected-users mt-4 pt-4 border-t border-gray-300">
                                    <h3 className="font-semibold mb-2 text-blue-700">Pending Collaborators ({selectedUsers.length})</h3>
                                    {selectedUsers.map(userId => {
                                        const user = users.find(u => String(u.id) === String(userId));
                                        return user ? (
                                            <div key={userId} className="user cursor-pointer hover:bg-blue-100 p-2 flex gap-2 items-center transition-colors rounded border border-blue-200">
                                                <div className='w-8 h-8 rounded-full flex items-center justify-center text-white bg-blue-500'>
                                                    <i className="ri-user-fill"></i>
                                                </div>
                                                <h4 className='font-semibold text-blue-700'>{user.email}</h4>
                                                <i className="ri-time-line text-blue-500 ml-auto"></i>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-semibold">Select Users</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-md transition-colors"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="p-4 max-h-96 overflow-y-auto">
                            {users.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">Loading users...</div>
                            ) : (
                                users.map(user => {
                                    const isSelected = selectedUsers.some(selectedId => 
                                        String(selectedId) === String(user.id)
                                    );
                                    
                                    // Check if user is already a collaborator
                                    const isAlreadyCollaborator = projectCollaborators.some(collaborator => 
                                        String(collaborator._id || collaborator.id) === String(user.id)
                                    );
                                    
                                    return (
                                        <div
                                            key={user.id}
                                            onClick={(e) => {
                                                if (isAlreadyCollaborator) return; // Don't allow selecting existing collaborators
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleUserSelect(user.id);
                                            }}
                                            className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-all duration-200 border mb-2
                                                ${isAlreadyCollaborator
                                                    ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
                                                    : isSelected
                                                    ? 'bg-indigo-50 border-indigo-200'
                                                    : 'hover:bg-gray-50 border-transparent'
                                                }`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-slate-500 flex items-center justify-center text-white">
                                                <i className="ri-user-fill"></i>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium">{user.email}</h3>
                                                {isAlreadyCollaborator && (
                                                    <small className="text-gray-500">Already a collaborator</small>
                                                )}
                                            </div>
                                            {isAlreadyCollaborator ? (
                                                <i className="ri-user-check-line text-gray-400 text-xl"></i>
                                            ) : isSelected ? (
                                                <i className="ri-check-line text-indigo-600 text-xl"></i>
                                            ) : null}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="border-t p-4 flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedUsers([]);
                                }}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    console.log('Adding collaborators:', selectedUsers);
                                    setIsModalOpen(false);
                                    addCollaborators();
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                disabled={selectedUsers.length === 0}
                            >
                                Add Selected ({selectedUsers.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Project