const nodemailer = require('nodemailer');
const { getEmailTemplate } = require('./emailTemplates');

async function sendEmailWithAttachment(email, imagePath, name, eventName, contentType = 'image/jpeg') {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `🎓 Your Certificate - ${eventName}`,
            html: getEmailTemplate('certificate', {
                name,
                eventName,
                subject: `Your Certificate - ${eventName}`
            }),
            attachments: [
                {
                    filename: `certificate_${name}.jpg`,
                    path: imagePath,
                    contentType: contentType
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        console.log(`Certificate email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending certificate email to ${email}:`, error.message);
        throw error;
    }
}

const sendOTP = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '🔐 Password Reset OTP - NRolEHub',
            html: getEmailTemplate('otp', {
                otp,
                subject: 'Password Reset OTP'
            }),
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error(`Error sending OTP email to ${email}:`, error.message);
        throw error;
    }
};
const sendRegistrationOTP = async (email, otp, username) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '📧 Email Verification - NRolEHub Registration',
            html: getEmailTemplate('registration_otp', {
                otp,
                username,
                subject: 'Email Verification'
            }),
        };

        await transporter.sendMail(mailOptions);
        console.log(`Registration OTP sent to ${email}`);
    } catch (error) {
        console.error(`Error sending registration OTP to ${email}:`, error.message);
        throw error;
    }
};

const sendReceiptEmail = async (to, subject, htmlContent, attachments) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: `📧 ${subject} - NRolEHub`,
            html: getEmailTemplate('payment_receipt', {
                studentName: to.split('@')[0], // Extract name from email
                eventName: subject.includes('for') ? subject.split('for ')[1] : 'Event',
                amount: '0',
                paymentId: 'N/A', // You can pass actual payment ID
                subject
            }),
            attachments,
        };

        await transporter.sendMail(mailOptions);
        console.log('Receipt email sent successfully');
    } catch (error) {
        console.error('Error sending receipt email:', error.message);
        throw error;
    }
};

const sendNotificationMail = async (to, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: `📢 ${subject} - NRolEHub`,
            html: getEmailTemplate('event_notification', {
                studentName: to.split('@')[0],
                message: html || text,
                subject
            }),
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error.message);
        throw error;
    }
};

// New function to send bulk emails
const sendBulkEmails = async (recipients, subject, content, attachments = null) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            pool: true, // Use pooled connections
            maxConnections: 5, // Limit concurrent connections
            maxMessages: 100, // Limit messages per connection
        });

        const results = await Promise.all(
            recipients.map(async (recipient) => {
                try {
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: recipient.email,
                        subject,
                        html: content.replace('{name}', recipient.name || ''),
                        attachments,
                    };

                    await transporter.sendMail(mailOptions);
                    return { email: recipient.email, success: true };
                } catch (error) {
                    console.error(`Failed to send email to ${recipient.email}:`, error.message);
                    return { email: recipient.email, success: false, error: error.message };
                }
            })
        );

        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        return {
            totalSent: recipients.length,
            successful,
            failed,
            details: results
        };
    } catch (error) {
        console.error('Bulk email error:', error.message);
        throw error;
    }
};
const sendAdminApprovalEmail = async (email, username) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '🎉 Admin Registration Approved - NRolEHub',
            html: getEmailTemplate('admin_approval', {
                username,
                subject: 'Admin Registration Approved'
            }),
        };

        await transporter.sendMail(mailOptions);
        console.log(`Admin approval email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending admin approval email to ${email}:`, error.message);
        throw error;
    }
};

const sendAdminRejectionEmail = async (email, username, reason) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '📋 Admin Registration Update - NRolEHub',
            html: getEmailTemplate('admin_rejection', {
                username,
                reason,
                subject: 'Admin Registration Update'
            }),
        };

        await transporter.sendMail(mailOptions);
        console.log(`Admin rejection email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending admin rejection email to ${email}:`, error.message);
        throw error;
    }
};

const sendComplaintResolutionEmail = async (email, studentName, complaintText, adminResponse) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '✅ Complaint Resolved - NRolEHub Support',
            html: getEmailTemplate('complaint_resolution', {
                studentName,
                complaintText,
                adminResponse,
                subject: 'Complaint Resolved'
            }),
        };

        await transporter.sendMail(mailOptions);
        console.log(`Complaint resolution email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending complaint resolution email to ${email}:`, error.message);
        throw error;
    }
};

const sendTeamCertificateEmail = async (email, memberName, teamName, eventName, rank = null) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `🏆 Team Certificate Available - ${eventName}`,
            html: getEmailTemplate('team_certificate', {
                memberName,
                teamName,
                eventName,
                rank,
                subject: `Team Certificate - ${eventName}`
            }),
        };

        await transporter.sendMail(mailOptions);
        console.log(`Team certificate email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending team certificate email to ${email}:`, error.message);
        throw error;
    }
};

module.exports = {
    sendEmailWithAttachment,
    sendOTP,
    sendRegistrationOTP,
    sendBulkEmails,
    sendReceiptEmail,
    sendNotificationMail,
    sendAdminApprovalEmail,
    sendAdminRejectionEmail,
    sendComplaintResolutionEmail,
    sendTeamCertificateEmail
};