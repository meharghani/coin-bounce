const express  = require('express');
const authController = require('../controller/authController');
const auth = require('../middleware/auth');
const blogController = require('../controller/blogController');
const commentController = require('../controller/commentController');

const router = express.Router();

router.get('/test', (req, res)=>res.json({msg: 'Working'}));

//user
//Login
router.post('/login',authController.login)
//register
router.post('/register', authController.register);
//logout
router.post('/logout',auth, authController.logout);
//refresh
router.post('/refresh', authController.refresh);
//blog
//CRUD
//create
router.post('/blog', auth, blogController.create);
// read all blog
router.get('/blog/all', auth, blogController.getAll);
//read blog by id
router.get('/blog/:id', auth, blogController.getById);
//update
router.put('/blog', auth, blogController.update);
//delete
router.delete('/blog/:id', auth, blogController.delete);

//comment
//create comment
router.post('/comment', auth, commentController.create);
//read comment by blog id
router.get('/comment/:id',auth, commentController.getById);

module.exports = router;