const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const verifyTokenController = require('../controllers/verifyToken');


router.post('/login', authController.loginUser);
router.post("/refresh", authController.requestRefreshToken);
router.post("/logout", authController.logOut);

module.exports = router;