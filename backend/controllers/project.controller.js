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


 const { name } = req.body;
   const loggedInUser = await userModel.findOne({email});
const userId = loggedInUser._id;

const newProject = await projectService.createProject({name, userId});

res.status(201).json({newProject});
    } catch (error) {
        console.log(error)
        res .status(400).json({ error: error.message });
}
}