const AuthService = require('./auth.service');
const { sendOTP, sendRegistrationOTP, sendAdminApprovalEmail, sendAdminRejectionEmail } = require('../../utils/mailer');

exports.register = async (req, res) => {
  try {
    // Validate required fields for students
    if (req.body.role === 'student') {
      const requiredFields = ['mobile_number', 'roll_number', 'year', 'semester'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        });
      }

      // Validate mobile number format
      if (!/^[0-9]{10}$/.test(req.body.mobile_number)) {
        return res.status(400).json({ 
          message: 'Invalid mobile number format. Must be 10 digits.' 
        });
      }

      // Validate year and semester
      const year = parseInt(req.body.year);
      const semester = parseInt(req.body.semester);
      
      if (year < 1 || year > 4) {
        return res.status(400).json({ message: 'Year must be between 1 and 4' });
      }
      
      if (semester < 1 || semester > 2) {
        return res.status(400).json({ message: 'Semester must be between 1 and 8' });
      }
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // Store user data and OTP temporarily
    const tempUser = await AuthService.storeTempUser({ ...req.body, otp });
    
    // Send OTP via email
    await sendRegistrationOTP(req.body.email, otp, req.body.username);

    res.status(200).json({ 
      message: 'OTP sent to your email',
      temp_id: tempUser.id
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      if (error.fields.roll_number) {
        return res.status(400).json({ message: 'Roll number already exists' });
      }
      if (error.fields.email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }
    res.status(400).json({ message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { temp_id, otp } = req.body;
    
    if (!temp_id || !otp) {
      return res.status(400).json({ message: 'Temp ID and OTP are required' });
    }

    // Verify OTP and create user if valid
    const result = await AuthService.verifyOTPAndCreateUser(temp_id, otp);
    
    // Handle pending admin approval
    if (result.isPendingApproval) {
      return res.status(200).json({
        message: result.message,
        isPendingApproval: true
      });
    }

    // Handle successful user creation
    if (result.user && result.token) {
      res.status(201).json({ 
        message: 'Registration successful', 
        user: result.user,
        token: result.token
      });
    } else {
      throw new Error('Invalid response from verification service');
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { temp_id } = req.body;
    
    if (!temp_id) {
      return res.status(400).json({ message: 'Temp ID is required' });
    }

    // Generate new OTP and update temp user
    const result = await AuthService.resendOTP(temp_id);
    
    res.status(200).json({ 
      message: 'New OTP sent to your email',
      temp_id: result.temp_id
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);
    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await AuthService.getProfile(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // Store OTP temporarily
    const tempData = await AuthService.storeTempPasswordReset(email, otp);
    
    // Send OTP via email
    await sendOTP(email, otp);

    res.status(200).json({ 
      message: 'OTP sent to your email',
      temp_id: tempData.id
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.verifyResetOTP = async (req, res) => {
  try {
    const { temp_id, otp } = req.body;
    
    if (!temp_id || !otp) {
      return res.status(400).json({ message: 'Temp ID and OTP are required' });
    }

    // Verify OTP
    const isValid = await AuthService.verifyPasswordResetOTP(temp_id, otp);
    
    if (isValid) {
      res.status(200).json({ 
        message: 'OTP verified successfully',
        temp_id
      });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { temp_id, new_password } = req.body;
    
    if (!temp_id || !new_password) {
      return res.status(400).json({ 
        message: 'Temp ID and new password are required' 
      });
    }

    await AuthService.resetPassword(temp_id, new_password);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.getPendingAdmins = async (req, res) => {
  try {
    const pendingAdmins = await AuthService.getPendingAdmins();
    res.status(200).json(pendingAdmins);
  } catch (error) {
    console.error('Get pending admins error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.approveAdmin = async (req, res) => {
  try {
    const { pendingAdminId } = req.params;
    const superAdminId = req.user.id;
    
    const newAdmin = await AuthService.approveAdmin(pendingAdminId, superAdminId);
    
    // Send approval email
    try {
      await sendAdminApprovalEmail(newAdmin.email, newAdmin.username);
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
    }
    
    res.status(200).json({ 
      message: 'Admin approved successfully',
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error) {
    console.error('Approve admin error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.rejectAdmin = async (req, res) => {
  try {
    const { pendingAdminId } = req.params;
    const { reason } = req.body;
    const superAdminId = req.user.id;
    
    const rejectedAdmin = await AuthService.rejectAdmin(pendingAdminId, superAdminId, reason);
    
    // Send rejection email
    try {
      await sendAdminRejectionEmail(rejectedAdmin.email, rejectedAdmin.username, reason);
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
    }
    
    res.status(200).json({ 
      message: 'Admin rejected successfully'
    });
  } catch (error) {
    console.error('Reject admin error:', error);
    res.status(400).json({ message: error.message });
  }
};