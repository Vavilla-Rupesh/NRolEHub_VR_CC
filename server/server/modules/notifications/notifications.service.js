const Notification = require('./notifications.model');
const { getEmailTemplate } = require('../../utils/emailTemplates');
const nodemailer = require('nodemailer');
const studentRegistrations = require('../events/studentRegistration.model')

exports.createNotification = async (notificationData) => {
  return Notification.create(notificationData);
};

exports.sendNotification = async (req) => {
  console.log(req.body);
  let successCount = 0;
  let failureCount = 0;

  const notification_id = req.body.notification_id
  const text = await Notification.findOne({ where: { id: notification_id , event_id: req.body.event_id, subevent_id: req.body.subevent_id} })
  console.log("Message: ", text.dataValues.message);
  const message = text.dataValues.message;

  const studentReg = await studentRegistrations.findAll({ where: { event_id: req.body.event_id, subevent_id: req.body.subevent_id, payment_status: 'paid'} });
  //send mail to each student

  for (i in studentReg) {
    try {
      const email = studentReg[i].dataValues.student_email; // Extract email
      const studentName = studentReg[i].dataValues.student_name;
      
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
        subject: '📢 Event Notification - NRolEHub',
        html: getEmailTemplate('event_notification', {
          studentName,
          message,
          subject: 'Event Notification'
        }),
      };

      await transporter.sendMail(mailOptions);
      console.log(`Professional notification sent to ${email}`);
      successCount++;
    } catch (error) {
      console.error(`Error sending notification to ${studentReg[i].dataValues.student_email}:`, error.message);
      failureCount++;
    }
  }

  await Notification.update({ status: 'sent' , sent_at : Date.now()}, { where: { id:notification_id}})
  return { successCount, failureCount };
};

// Enhanced notification service with professional templates
exports.sendProfessionalNotification = async (recipients, subject, message, type = 'event_notification') => {
  let successCount = 0;
  let failureCount = 0;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    });

    for (const recipient of recipients) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: recipient.email,
          subject: `📢 ${subject} - NRolEHub`,
          html: getEmailTemplate(type, {
            studentName: recipient.name || recipient.email.split('@')[0],
            message,
            subject,
            eventUrl: recipient.eventUrl
          }),
        };

        await transporter.sendMail(mailOptions);
        console.log(`Professional notification sent to ${recipient.email}`);
        successCount++;
      } catch (error) {
        console.error(`Error sending notification to ${recipient.email}:`, error.message);
        failureCount++;
      }
    }

    return { successCount, failureCount };
  } catch (error) {
    console.error('Bulk notification error:', error);
    throw error;
  }
};