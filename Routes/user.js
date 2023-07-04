const express = require('express');
const router = express.Router();

const userCtlr = require('../Controllers/user')

router.post('/signup', userCtlr.signup)
router.post('/login', userCtlr.login)


module.exports = router; 