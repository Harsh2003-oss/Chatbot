const projectModel = require('../models/project.model');
const projectService = require('../services/project.service');  
const { validationResult } = require('express-validator');  
const userModel = require('../models/user.model');

const createProject = async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{


 const { name ,email } = req.body;
   const loggedInUser = await userModel.findOne({email});
const userId = loggedInUser._id;

const newProject = await projectService.createProject({name, userId});

res.status(201).json({newProject});
    } catch (error) {
        console.log(error)
        res .status(400).json({ error: error.message });
}
}

const getAllProjects = async (req, res) => {
    try {
        const loggedInUser = await userModel.findOne({
            email: req.user.email
        });

const allUserProjects = await projectService.getAllProjects(
       loggedInUser._id 
)

return res.status(200).json({allUserProjects});

    }catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}

const addUserToProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });    
    }

try {
    const { projectId, users } = req.body;

    const loggedInUser = await userModel.findOne({
        email: req.user.email
    });

    const project = await projectService.addUserToProject({
        projectId,
        users,
        userId: loggedInUser._id
    });

    return res.status(200).json({ project });

} catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
}
}

const getProjectById = async (req, res) => {
    const { projectId } = req.params;

try {
    
    const project= await projectModel.findById(
        projectId)

        return res.status(200).json({ project });

} catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
}
}
module.exports = {createProject, getAllProjects, addUserToProject, getProjectById};
