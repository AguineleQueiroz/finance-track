/* Callback functions */

const { home } = require('../../Controllers/homeController');
const { register } = require('../../Controllers/registerController');

const express = require("express");
const router = express.Router();
module.exports = router;

router.get('/', home);
router.post('/register', register);