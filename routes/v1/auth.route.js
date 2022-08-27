const express = require('express');
const router = express.Router();

// controllers
const authController = require('../../controllers/auth.controllers');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/account-activation', authController.accountActivation);
router.post('/reset-password-link', authController.resetPasswordLink);
router.post('/reset-password', authController.resetPassword);


module.exports = router;