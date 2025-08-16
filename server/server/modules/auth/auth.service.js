const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./auth.model');
const TempUser = require('./temp-user.model');
const TempPasswordReset = require('./temp-password-reset.model');
const PendingAdmin = require('./pending-admin.model');
const { sequelize } = require('../../config/dataBase');

// Create super admins on startup
exports.createSuperAdmins = async () => {
  try {
    const superAdmins = [
      {
        email: process.env.SUPER_ADMIN_EMAIL_1,
        password: process.env.SUPER_ADMIN_PASSWORD_1,
        username: 'Super Admin 1'
      },
      {
        email: process.env.SUPER_ADMIN_EMAIL_2,
        password: process.env.SUPER_ADMIN_PASSWORD_2,
        username: 'Super Admin 2'
      }
    ];

    for (const adminData of superAdmins) {
      if (!adminData.email || !adminData.password) continue;

      const existingAdmin = await User.findOne({ where: { email: adminData.email } });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        await User.create({
          username: adminData.username,
          email: adminData.email,
          password: hashedPassword,
          role: 'super_admin',
          is_verified: true,
          is_approved: true
        });
        console.log(`Super admin created: ${adminData.email}`);
      }
    }
  } catch (error) {
    console.error('Error creating super admins:', error);
  }
};

exports.storeTempUser = async (userData) => {
  try {
    // For admin role, store in PendingAdmin table instead
    if (userData.role === 'admin') {
      // For admin role, still create temp user for OTP verification
      // The pending admin will be created after OTP verification
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create temp user data object
    const tempUserData = {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      otp: userData.otp.toString(),
      otp_expires: new Date(Date.now() + 10 * 60 * 1000) // OTP valid for 10 minutes
    };

    // Add student-specific fields only if role is student
    if (userData.role === 'student') {
      tempUserData.mobile_number = userData.mobile_number;
      tempUserData.roll_number = userData.roll_number;
      tempUserData.college_name = userData.college_name;
      tempUserData.stream = userData.stream;
      tempUserData.year = parseInt(userData.year);
      tempUserData.semester = parseInt(userData.semester);
    } else {
      // Set student-specific fields to null for admin users
      tempUserData.mobile_number = null;
      tempUserData.roll_number = null;
      tempUserData.college_name = null;
      tempUserData.stream = null;
      tempUserData.year = null;
      tempUserData.semester = null;
    }

    const tempUser = await TempUser.create(tempUserData);

    return {
      id: tempUser.id,
      email: tempUser.email
    };
  } catch (error) {
    console.error('Error storing temp user:', error);
    throw error;
  }
};

exports.resendOTP = async (tempId) => {
  try {
    const tempUser = await TempUser.findByPk(tempId);
    
    if (!tempUser) {
      throw new Error('Invalid temp ID or session expired');
    }

    // Check if too many requests (optional rate limiting)
    const timeSinceCreation = Date.now() - new Date(tempUser.created_at).getTime();
    if (timeSinceCreation < 30000) { // 30 seconds minimum between requests
      throw new Error('Please wait before requesting a new OTP');
    }

    // Generate new OTP
    const newOTP = Math.floor(100000 + Math.random() * 900000);
    
    // Update temp user with new OTP and extended expiry
    await tempUser.update({
      otp: newOTP.toString(),
      otp_expires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
    });

    // Send new OTP via email
    const { sendRegistrationOTP } = require('../../utils/mailer');
    await sendRegistrationOTP(tempUser.email, newOTP, tempUser.username);

    return {
      temp_id: tempUser.id,
      email: tempUser.email
    };
  } catch (error) {
    console.error('Error resending OTP:', error);
    throw error;
  }
};

exports.verifyOTPAndCreateUser = async (tempId, otp) => {
  try {
    const tempUser = await TempUser.findByPk(tempId);
    
    if (!tempUser) {
      throw new Error('Invalid verification attempt');
    }

    // Convert both OTPs to strings for comparison
    if (tempUser.otp !== otp.toString()) {
      throw new Error('Invalid OTP');
    }

    if (new Date() > tempUser.otp_expires) {
      throw new Error('OTP has expired');
    }

    // For admin role, create pending admin record instead of user
    if (tempUser.role === 'admin') {
      // Check if pending admin already exists
      const existingPendingAdmin = await PendingAdmin.findOne({
        where: { email: tempUser.email }
      });

      if (!existingPendingAdmin) {
        const hashedPassword = tempUser.password; // Already hashed
        
        await PendingAdmin.create({
          username: tempUser.username,
          email: tempUser.email,
          password: hashedPassword,
          status: 'pending'
        });
      }

      // Delete temporary user
      await tempUser.destroy();

      return {
        isPendingApproval: true,
        message: 'Admin registration submitted for approval. You will receive an email once reviewed.'
      };
    }

    // Create user data object
    const userData = {
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password, // Already hashed
      role: tempUser.role,
      is_verified: true
    };

    // Add student-specific fields only if role is student
    if (tempUser.role === 'student') {
      userData.mobile_number = tempUser.mobile_number;
      userData.roll_number = tempUser.roll_number;
      userData.college_name = tempUser.college_name;
      userData.stream = tempUser.stream;
      userData.year = tempUser.year;
      userData.semester = tempUser.semester;
    }

    // Create verified user
    const user = await User.create(userData);

    // Delete temporary user
    await tempUser.destroy();

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;
    
    return { user: userResponse, token };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

exports.login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    // Check if user is in pending admin table
    const pendingAdmin = await PendingAdmin.findOne({ where: { email } });
    if (pendingAdmin) {
      if (pendingAdmin.status === 'pending') {
        throw new Error('Your admin registration is pending approval');
      } else if (pendingAdmin.status === 'rejected') {
        throw new Error('Your admin registration was rejected');
      }
    }
    throw new Error('User not found');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid password');
  }

  // Check if admin is approved
  if (user.role === 'admin' && !user.is_approved) {
    throw new Error('Your account is not approved yet');
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  const userResponse = user.toJSON();
  delete userResponse.password;

  return { user: userResponse, token };
};

exports.getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

exports.storeTempPasswordReset = async (email, otp) => {
  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('No account found with this email');
    }

    // Create temp password reset record
    const tempReset = await TempPasswordReset.create({
      email,
      otp: otp.toString(),
      otp_expires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    return {
      id: tempReset.id,
      email: tempReset.email
    };
  } catch (error) {
    console.error('Error storing temp password reset:', error);
    throw error;
  }
};

exports.verifyPasswordResetOTP = async (tempId, otp) => {
  try {
    const tempReset = await TempPasswordReset.findByPk(tempId);
    
    if (!tempReset) {
      throw new Error('Invalid verification attempt');
    }

    if (tempReset.otp !== otp.toString()) {
      throw new Error('Invalid OTP');
    }

    if (new Date() > tempReset.otp_expires) {
      throw new Error('OTP has expired');
    }

    return true;
  } catch (error) {
    console.error('Error verifying password reset OTP:', error);
    throw error;
  }
};

exports.resetPassword = async (tempId, newPassword) => {
  const transaction = await sequelize.transaction();
  
  try {
    const tempReset = await TempPasswordReset.findByPk(tempId);
    if (!tempReset) {
      throw new Error('Invalid reset attempt');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await User.update(
      { password: hashedPassword },
      { 
        where: { email: tempReset.email },
        transaction
      }
    );

    // Delete temp reset record
    await tempReset.destroy({ transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.getPendingAdmins = async () => {
  try {
    return await PendingAdmin.findAll({
      where: { status: 'pending' },
      order: [['created_at', 'DESC']]
    });
  } catch (error) {
    throw new Error('Failed to fetch pending admins');
  }
};

exports.approveAdmin = async (pendingAdminId, superAdminId) => {
  const transaction = await sequelize.transaction();
  
  try {
    const pendingAdmin = await PendingAdmin.findByPk(pendingAdminId, { transaction });
    if (!pendingAdmin) {
      throw new Error('Pending admin not found');
    }

    if (pendingAdmin.status !== 'pending') {
      throw new Error('Admin request is no longer pending');
    }

    // Create the admin user
    const newAdmin = await User.create({
      username: pendingAdmin.username,
      email: pendingAdmin.email,
      password: pendingAdmin.password, // Already hashed
      role: 'admin',
      is_verified: true,
      is_approved: true,
      approved_by: superAdminId,
      approved_at: new Date()
    }, { transaction });

    // Update pending admin status
    await pendingAdmin.update({
      status: 'approved',
      approved_by: superAdminId,
      approved_at: new Date()
    }, { transaction });

    await transaction.commit();
    return newAdmin;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.rejectAdmin = async (pendingAdminId, superAdminId, reason) => {
  const transaction = await sequelize.transaction();
  
  try {
    const pendingAdmin = await PendingAdmin.findByPk(pendingAdminId, { transaction });
    if (!pendingAdmin) {
      throw new Error('Pending admin not found');
    }

    if (pendingAdmin.status !== 'pending') {
      throw new Error('Admin request is no longer pending');
    }

    await pendingAdmin.update({
      status: 'rejected',
      approved_by: superAdminId,
      approved_at: new Date(),
      rejection_reason: reason
    }, { transaction });

    await transaction.commit();
    return pendingAdmin;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};