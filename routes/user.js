let express = require('express');
let { 
	userById, 
	allUsers, 
	getUser, 
	updateUser, 
	deleteUser,
	userPhoto,
	addFollowing,
	addFollower,
	removeFollowing,
	removeFollower,
	findPeople,
	hasAuthorization
} = require('../controllers/user')
let {requireSignin} = require("../controllers/auth");

let router = express.Router();

router.put('/user/follow', requireSignin, addFollowing, addFollower);
router.put('/user/unfollow', requireSignin, removeFollowing, removeFollower);

router.get("/users", allUsers);
router.get("/user/:userId", requireSignin, getUser);
router.put("/user/:userId", requireSignin, hasAuthorization, updateUser);
router.delete("/user/:userId", requireSignin, hasAuthorization, deleteUser);
//photo
router.get('/user/photo/:userId', userPhoto);

//who to follow

router.get('/user/findpeople/:userId', requireSignin, findPeople);

router.param("userId", userById);

module.exports = router;