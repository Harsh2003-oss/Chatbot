var express = require('express');
var router = express.Router();

const {body} = require('express-validator');
const projectController = require('../controllers/project.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controllers');

router.post('/create',
  authMiddleware.authUser,body('name').isString().withMessage('Project name is required'),

    projectController.createProject
)

router.get('/all', authMiddleware.authUser,
    projectController.getAllProjects
)

router.put('/add-user',
    authMiddleware.authUser,
    body('projectId').isString().withMessage('Project ID must be a string'),
    body('users')
    .isArray({ min: 1 }).withMessage('Users must be a non-empty array')
    .custom((arr) => arr.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
    projectController.addUserToProject
)

router.get('/allusers',
    authMiddleware.authUser,
    userController.getAllUsersController)

router.get('/get-project/:projectId',
    authMiddleware.authUser,
projectController.getProjectById)

module.exports = router;