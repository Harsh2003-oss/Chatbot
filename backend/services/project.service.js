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

    const project = await projectModel.create({
        name,   
        users: [userId] // Add the user to the project
    })
    return project;
}

module.exports = {createProject}