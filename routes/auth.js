let express = require('express');
let { 
	signup, 
	signin, 
	signout,
	forgotPassword,
	resetPassword,
	socialLogin
} = require('../controllers/auth')
let { userById } = require('../controllers/user')
let {userSignupValidator, passwordResetValidator} = require('../validator')//../validator/index

let router = express.Router();

router.post("/social-login", socialLogin)

router.put('/forgot-password', forgotPassword);//add require signin?
router.put('/reset-password', passwordResetValidator, resetPassword)//add require signin?

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get ("/signout", signout);

// any route containing userId, our app will exec userById
router.param("userId", userById);

module.exports = router;