const projectModel = require('../models/project.model');

 const createProject = async ({
    name,userId
}) => {
    if(!name){
        throw new Error('Project name is required');
    }
    if(!userId){
        throw new Error('User ID is required');
    }

    try {
        const project = await projectModel.create({
            name,   
            users: [userId] // Add the user to the project
        })
        return project;
    } catch (err) {
        if (err.code === 11000) {
            throw new Error('Project name already exists');
        }
        throw err;
    }
}

const getAllProjects = async (userId) => {
    if(!userId){
        throw new Error('User ID is required');
    }
    
    const allUserProjects = await projectModel.find({
        users:userId
 
})
return allUserProjects;
}

module.exports = {createProject, getAllProjects};