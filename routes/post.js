let express = require('express');
let {getPosts, 
	createPost, 
	postsByUser, 
	postById,
	isPoster,
	deletePost,
	updatePost,
	photo,
	singlePost,
	like,
	unlike,
	comment,
	uncomment
} = require('../controllers/post');
let {requireSignin} = require("../controllers/auth");
let { userById } = require('../controllers/user')
let {createPostValidator} = require('../validator/')//../validator/index

let router = express.Router();

router.get("/posts"/*, requireSignin*/, getPosts);
//why can we define the userid of whose post it is???

router.post("/post/new/:userId", 
	requireSignin,  
	createPost,
	createPostValidator
);

//like unlike
router.put("/post/like", requireSignin, like);
router.put("/post/unlike", requireSignin, unlike);

router.put("/post/comment", requireSignin, comment);
router.put("/post/uncomment", requireSignin, uncomment);

router.get('/post/:postId', singlePost)
router.get("/posts/by/:userId", requireSignin, postsByUser);
router.put('/post/:postId', requireSignin, isPoster,  updatePost);
router.delete('/post/:postId', requireSignin, isPoster,  deletePost);
router.get("/post/photo/:postId", photo);



router.param("userId", userById);

router.param("postId", postById);

module.exports = router;