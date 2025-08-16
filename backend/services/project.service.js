const projectModel = require('../models/project.model');
const mongoose = require('mongoose');

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

const addUserToProject = async ({ projectId, users, userId }) => {
    if (!projectId) {
        throw new Error('Project ID and users are required');
    }

    if (!mongoose.isValidObjectId(projectId)) {
        throw new Error('Invalid Project ID format');
    }

    if (!users || !Array.isArray(users) || users.length === 0) {
        throw new Error('Users must be a non-empty array');
    }

    if (!userId) {
        throw new Error('User ID is required');
    }

    // Validate each user ID in the array
    const invalidUserIds = users.filter(userId => !mongoose.isValidObjectId(userId));
    if (invalidUserIds.length > 0) {
        throw new Error(`Invalid User ID format for: ${invalidUserIds.join(', ')}`);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid User ID format');
    } // Missing closing brace was here

    const project = await projectModel.findOne({
        _id: projectId,
        users: userId // Ensure the user is part of the project
    });

    if (!project) {
        throw new Error('Project not found or user is not part of the project');
    }

    // Single implementation for adding users to project
    const updatedProject = await projectModel.findByIdAndUpdate(
        projectId,
        { $addToSet: { users: { $each: users } } },
        { new: true }
    );

    if (!updatedProject) {
        throw new Error('Project not found');
    }

    return updatedProject;
};

module.exports = { createProject, getAllProjects, addUserToProject };