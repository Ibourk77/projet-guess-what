const express = require('express');
const mainController = require('../controllers/main.controller');
const {signupAction, signinAction} = require('../controllers/user.controller');
const verifyBodyRegister = require('../middlewares/verifyBodyRegister');
const userAlreadyExist = require('../middlewares/userAlreadyExist');


const authRouter = express.Router();

//router.get('/', mainController.homePage);

authRouter.route('/signup')
  .post(verifyBodyRegister, userAlreadyExist, signupAction);

authRouter.route('/signin')
  .post(signinAction);






module.exports = authRouter;