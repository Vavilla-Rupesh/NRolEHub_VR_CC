// const express = require('express');
// const router = express.Router();
// const AuthController = require('../../modules/auth/auth.controller');
// const AuthMiddleware = require('../middleware/auth.middleware')

// // User Authentication
// router.post('/register', AuthController.register);
// router.post('/verifyOTP', AuthController.verifyOTP); // Add OTP verification route
// router.post('/login', AuthController.login);
// router.get('/profile', AuthMiddleware.authenticate, AuthController.getProfile);

// module.exports = router;
const express = require('express');
const router = express.Router();
const AuthController = require('../../modules/auth/auth.controller');
const AuthMiddleware = require('../middleware/auth.middleware')

// User Authentication
router.post('/register', AuthController.register);
router.post('/verifyOTP', AuthController.verifyOTP);
router.post('/resend-otp', AuthController.resendOTP);
router.post('/login', AuthController.login);
router.get('/profile', AuthMiddleware.authenticate, AuthController.getProfile);

// Forgot Password Routes
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/verify-reset-otp', AuthController.verifyResetOTP);
router.post('/reset-password', AuthController.resetPassword);

// Super Admin Routes
router.get('/pending-admins', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.authorize(['super_admin']), 
  AuthController.getPendingAdmins
);
router.put('/approve-admin/:pendingAdminId', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.authorize(['super_admin']), 
  AuthController.approveAdmin
);
router.put('/reject-admin/:pendingAdminId', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.authorize(['super_admin']), 
  AuthController.rejectAdmin
);

module.exports = router;