/* Callback functions */

const { home } = require('../../Controllers/homeController');
const { signup } = require('../../Controllers/signupController');
const { signin } = require('../../Controllers/signinController');
const { getUser } = require('../../Controllers/userController');
const { verifyTokenUser } = require('../../Middleware/verifyTokenUser');

const express = require("express");
const router = express.Router();
module.exports = router;

router.get('/', home);
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/user/:id', verifyTokenUser, getUser )