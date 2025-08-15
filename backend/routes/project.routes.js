var express = require('express');
var router = express.Router();

const {body} = require('express-validator');
const projectController = require('../controllers/project.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create',
  authMiddleware.authUser,body('name').isString().withMessage('Project name is required'),

    projectController.createProject
)

module.exports = router;