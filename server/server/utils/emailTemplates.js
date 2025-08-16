const getEmailTemplate = (type, data) => {
  const baseTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>NRolEHub - ${data.subject || 'Notification'}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8fafc;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
       .header {
          background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(135deg, #2c3e50, #3498db);

          padding: 30px 40px;
          text-align: center;
          color: white;
        }
        
        .logo {
          width: 120px;
          height: auto;
          margin-bottom: 15px;
          filter: brightness(0) invert(1);
        }
        
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        
        .header p {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
        }
        
        .content {
          padding: 40px;
        }
        
        .greeting {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 20px;
        }
        
        .message {
          font-size: 16px;
          line-height: 1.7;
          color: #4b5563;
          margin-bottom: 30px;
        }
        
        .highlight-box {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-left: 4px solid #4F46E5;
          padding: 20px;
          margin: 25px 0;
          border-radius: 8px;
        }
        
        .highlight-box h3 {
          color: #1e40af;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        
        .highlight-box p {
          color: #1e3a8a;
          margin: 0;
        }
        
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          color: white;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }
        
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
        }
        
        .footer {
          background-color: #f8fafc;
          padding: 30px 40px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        
        .footer p {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 15px;
        }
        
        .social-links {
          margin: 20px 0;
        }
        
        .social-links a {
          display: inline-block;
          margin: 0 10px;
          color: #4F46E5;
          text-decoration: none;
          font-weight: 500;
        }
        
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
          margin: 25px 0;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 25px 0;
        }
        
        .info-item {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          border-left: 3px solid #4F46E5;
        }
        
        .info-item strong {
          color: #1f2937;
          display: block;
          margin-bottom: 5px;
        }
        
        .info-item span {
          color: #6b7280;
        }
        
        @media (max-width: 600px) {
          .email-container {
            margin: 10px;
            border-radius: 8px;
          }
          
          .header, .content, .footer {
            padding: 20px;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <img src="https://cdn.jsdelivr.net/gh/Vavilla-Rupesh/NRolEHub_Test@main/public/logo.png?v=2&w=120&h=60&fit=crop&crop=center" alt="NRolEHub Logo" class="logo">
          <h1>NRolEHub</h1>
          <p>Narayana Engineering College Event Management</p>
        </div>
        
        <div class="content">
          ${getTemplateContent(type, data)}
        </div>
        
        <div class="footer">
          <p>This email was sent from NRolEHub - Narayana Engineering College</p>
          <div class="social-links">
            <a href="mailto:support@nrolehub.com">Support</a>
            <a href="https://nrolehub.com">Website</a>
          </div>
          <div class="divider"></div>
          <p style="font-size: 12px; color: #9ca3af;">
            © ${new Date().getFullYear()} NRolEHub. All rights reserved.<br>
            Narayana Engineering College, Nellore
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return baseTemplate;
};

const getTemplateContent = (type, data) => {
  switch (type) {
    case 'certificate':
      return `
        <div class="greeting">Dear ${data.name},</div>
        <div class="message">
          Congratulations! Your certificate for <strong>${data.eventName}</strong> is now ready.
        </div>
        
        <div class="highlight-box">
          <h3>🎉 Certificate Details</h3>
          <div class="info-grid">
            <div class="info-item">
              <strong>Event:</strong>
              <span>${data.eventName}</span>
            </div>
            <div class="info-item">
              <strong>Participant:</strong>
              <span>${data.name}</span>
            </div>
          </div>
        </div>
        
        <div class="message">
          Your certificate has been attached to this email. You can download and print it for your records.
          This certificate validates your participation and achievement in our event.
        </div>
        
        <div class="message">
          Thank you for being part of NRolEHub and contributing to the success of our events!
        </div>
      `;

    case 'otp':
      return `
        <div class="greeting">Hello,</div>
        <div class="message">
          You have requested to reset your password for your NRolEHub account.
        </div>
        
        <div class="highlight-box">
          <h3>🔐 Your OTP Code</h3>
          <p style="font-size: 32px; font-weight: bold; color: #4F46E5; text-align: center; margin: 20px 0; letter-spacing: 8px;">
            ${data.otp}
          </p>
          <p style="text-align: center; margin: 0;">
            This OTP is valid for 10 minutes only
          </p>
        </div>
        
        <div class="message">
          Enter this OTP in the password reset form to continue. If you didn't request this password reset, 
          please ignore this email and your password will remain unchanged.
        </div>
        
        <div class="message">
          For security reasons, never share this OTP with anyone.
        </div>
      `;

    case 'registration_otp':
      return `
        <div class="greeting">Welcome to NRolEHub!</div>
        <div class="message">
          Thank you for registering with NRolEHub. To complete your registration, please verify your email address.
        </div>
        
        <div class="highlight-box">
          <h3>📧 Email Verification</h3>
          <p style="font-size: 32px; font-weight: bold; color: #4F46E5; text-align: center; margin: 20px 0; letter-spacing: 8px;">
            ${data.otp}
          </p>
          <p style="text-align: center; margin: 0;">
            Enter this OTP to verify your email address
          </p>
        </div>
        
        <div class="message">
          This OTP is valid for 10 minutes. Once verified, you'll have full access to all NRolEHub features 
          including event registration, certificate downloads, and more.
        </div>
      `;

    case 'payment_receipt':
      return `
        <div class="greeting">Dear ${data.studentName},</div>
        <div class="message">
          Your registration for <strong>${data.subEventName}</strong> has been ${data.isFree ? 'confirmed' : 'processed'} successfully.
        </div>
        
        <div class="highlight-box">
          <h3>${data.isFree ? '🎉 Registration Confirmation' : '💳 Payment Confirmation'}</h3>
          <div class="info-grid">
            <div class="info-item">
              <strong>Main Event:</strong>
              <span>${data.mainEventName}</span>
            </div>
            <div class="info-item">
              <strong>Sub Event:</strong>
              <span>${data.subEventName}</span>
            </div>
            <div class="info-item">
              <strong>Registration Type:</strong>
              <span>${data.isFree ? 'FREE Event' : 'Paid Event'}</span>
            </div>
            <div class="info-item">
              <strong>Amount:</strong>
              <span>${data.isFree ? 'FREE' : `₹${data.amount}`}</span>
            </div>
            <div class="info-item">
              <strong>Event Duration:</strong>
              <span>${data.startDate} to ${data.endDate}</span>
            </div>
            <div class="info-item">
              <strong>Venue:</strong>
              <span>${data.venue}</span>
            </div>
            ${!data.isFree ? `
            <div class="info-item">
              <strong>Payment ID:</strong>
              <span>${data.paymentId}</span>
            </div>
            ` : ''}
            <div class="info-item">
              <strong>Registration Date:</strong>
              <span>${data.registrationDate}</span>
            </div>
          </div>
        </div>
        
        <div class="message">
          Your registration is now confirmed. ${data.isFree ? 'This is a free event, so no payment was required.' : 'Please keep this email and the attached receipt as proof of payment.'}
          You will receive further updates about the event via email.
        </div>
        
        ${!data.isFree ? `
        <div class="message">
          A printable payment receipt has been attached to this email for your records.
          You can also print this receipt directly from your email by clicking the print button below.
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" onclick="window.print()" class="button" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); margin-right: 10px;">🖨️ Print Receipt</a>
          <a href="${data.downloadUrl || '#'}" class="button" style="background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);">📄 Download PDF</a>
        </div>
        ` : ''}
      `;

    case 'free_registration':
      return `
        <div class="greeting">Dear ${data.studentName},</div>
        <div class="message">
          Congratulations! Your registration for <strong>${data.subEventName}</strong> has been confirmed successfully.
        </div>
        
        <div class="highlight-box">
          <h3>🎉 Registration Confirmed</h3>
          <div class="info-grid">
            <div class="info-item">
              <strong>Main Event:</strong>
              <span>${data.mainEventName}</span>
            </div>
            <div class="info-item">
              <strong>Sub Event:</strong>
              <span>${data.subEventName}</span>
            </div>
            <div class="info-item">
              <strong>Registration Type:</strong>
              <span>FREE Event</span>
            </div>
            <div class="info-item">
              <strong>Event Duration:</strong>
              <span>${data.startDate} to ${data.endDate}</span>
            </div>
            <div class="info-item">
              <strong>Venue:</strong>
              <span>${data.venue}</span>
            </div>
            <div class="info-item">
              <strong>Registration Date:</strong>
              <span>${new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div class="message">
          Your registration is now confirmed for this free event. You will receive further updates about the event via email.
          Please save this email as confirmation of your registration.
        </div>
        
        <div class="message">
          We look forward to your participation in this exciting event!
        </div>
      `;
    case 'admin_approval':
      return `
        <div class="greeting">Congratulations ${data.username}!</div>
        <div class="message">
          Your admin registration request has been approved by our super admin team.
        </div>
        
        <div class="highlight-box">
          <h3>🎉 Welcome to the Admin Team!</h3>
          <p>You now have administrative access to NRolEHub. You can:</p>
          <ul style="margin: 15px 0; padding-left: 20px; color: #1e3a8a;">
            <li>Create and manage events</li>
            <li>Monitor student registrations</li>
            <li>Generate certificates</li>
            <li>Manage attendance and leaderboards</li>
          </ul>
        </div>
        
        <div class="message">
          You can now login to the system using your registered credentials and start managing events.
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.loginUrl || 'https://nrolehub.com/login'}" class="button">Login to Admin Panel</a>
        </div>
      `;

    case 'admin_rejection':
      return `
        <div class="greeting">Dear ${data.username},</div>
        <div class="message">
          We regret to inform you that your admin registration request has been reviewed and cannot be approved at this time.
        </div>
        
        <div class="highlight-box">
          <h3>📋 Review Details</h3>
          ${data.reason ? `
            <div class="info-item">
              <strong>Reason:</strong>
              <span>${data.reason}</span>
            </div>
          ` : ''}
          <p style="margin-top: 15px;">
            If you believe this decision was made in error or if you have additional information to provide, 
            please contact our super admin team.
          </p>
        </div>
        
        <div class="message">
          Thank you for your interest in joining the NRolEHub admin team. We appreciate your enthusiasm 
          for contributing to our platform.
        </div>
      `;

    case 'complaint_resolution':
      return `
        <div class="greeting">Dear ${data.studentName},</div>
        <div class="message">
          Your complaint has been reviewed and resolved by our admin team.
        </div>
        
        <div class="highlight-box">
          <h3>✅ Complaint Resolution</h3>
          <div class="info-item">
            <strong>Your Complaint:</strong>
            <span style="font-style: italic;">"${data.complaintText}"</span>
          </div>
          <div class="info-item" style="margin-top: 15px;">
            <strong>Admin Response:</strong>
            <span>${data.adminResponse}</span>
          </div>
        </div>
        
        <div class="message">
          We hope this resolution addresses your concern. If you need further assistance, 
          please don't hesitate to contact our support team.
        </div>
        
        <div class="message">
          Thank you for helping us improve NRolEHub!
        </div>
      `;

    case 'event_notification':
      return `
        <div class="greeting">Dear ${data.studentName || 'Student'},</div>
        <div class="message">
          We have an important update regarding your registered event.
        </div>
        
        <div class="highlight-box">
          <h3>📢 Event Notification</h3>
          <p>${data.message}</p>
        </div>
        
        <div class="message">
          Please make note of this information and take any necessary actions. 
          For any questions, feel free to reach out to our support team.
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.eventUrl || '#'}" class="button">View Event Details</a>
        </div>
      `;

    case 'team_certificate':
      return `
        <div class="greeting">Dear ${data.memberName},</div>
        <div class="message">
          Congratulations! Your team certificate for <strong>${data.eventName}</strong> is now available.
        </div>
        
        <div class="highlight-box">
          <h3>🏆 Team Achievement</h3>
          <div class="info-grid">
            <div class="info-item">
              <strong>Team:</strong>
              <span>${data.teamName}</span>
            </div>
            <div class="info-item">
              <strong>Event:</strong>
              <span>${data.eventName}</span>
            </div>
            ${data.rank ? `
              <div class="info-item">
                <strong>Achievement:</strong>
                <span>${data.rank} Place</span>
              </div>
            ` : ''}
          </div>
        </div>
        
        <div class="message">
          Your team certificate has been attached to this email. This certificate recognizes your 
          collaborative effort and achievement as part of Team ${data.teamName}.
        </div>
        
        <div class="message">
          Congratulations on your teamwork and success!
        </div>
      `;

    default:
      return `
        <div class="greeting">Hello,</div>
        <div class="message">
          ${data.message || 'Thank you for using NRolEHub.'}
        </div>
      `;
  }
};

module.exports = { getEmailTemplate };