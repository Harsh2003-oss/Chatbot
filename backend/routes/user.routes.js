var express = require('express');
var router = express.Router();
var userController = require("../controllers/user.controllers")
const {body} = require('express-validator')
var authMiddleware = require('../middlewares/auth.middleware')

router.post('/register',
  body('email').isEmail().withMessage('Email must be valid email address'),
body('password').isLength({min:3}).withMessage("Password must be atleast 3 characters long "),
  userController.createUserController)

router.post('/login',
   body('email').isEmail().withMessage('Email must be valid email address'),
body('password').isLength({min:3}).withMessage("Password must be atleast 3 characters long "),
  userController.loginController)

router.get('/profile',authMiddleware.authUser,userController.profileController)

router.get('/logout',authMiddleware.authUser,userController.logoutController)

module.exports = router;
