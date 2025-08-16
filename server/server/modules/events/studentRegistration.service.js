const StudentRegistration = require("./studentRegistration.model");
const { sequelize } = require("../../config/dataBase");
const { getEmailTemplate } = require('../../utils/emailTemplates');
const nodemailer = require('nodemailer');
const receiptGenerator = require('../../utils/receiptGenerator');

exports.registerForEvent = async (registrationData) => {
  const transaction = await sequelize.transaction();

  try {
    // Check for any existing registration (paid, free, or pending)
    const existingRegistration = await StudentRegistration.findOne({
      where: {
        student_id: registrationData.student_id,
        event_id: registrationData.event_id,
        subevent_id: registrationData.subevent_id,
      },
      transaction,
    });

    if (existingRegistration) {
      // If there's a paid or free registration, prevent re-registration
      if (["paid", "free"].includes(existingRegistration.payment_status)) {
        throw new Error("Already registered for this event");
      }

      // If there's a pending registration, update it instead of creating new
      await existingRegistration.update(
        {
          student_name: registrationData.student_name,
          student_email: registrationData.student_email,
          event_name: registrationData.event_name,
          razorpay_order_id: registrationData.is_free
            ? null
            : existingRegistration.razorpay_order_id,
          razorpay_payment_id: registrationData.is_free
            ? null
            : existingRegistration.razorpay_payment_id,
          payment_status: registrationData.is_free ? "paid" : "pending",
        },
        { transaction }
      );

      // Send free event receipt email if it's a free event
      if (registrationData.is_free) {
        await this.sendFreeEventReceipt(existingRegistration, registrationData);
      }
      await transaction.commit();
      return existingRegistration;
    }

    // Create new registration if none exists
    const registration = await StudentRegistration.create(
      {
        ...registrationData,
        razorpay_order_id: registrationData.is_free
          ? null
          : registrationData.razorpay_order_id,
        razorpay_payment_id: registrationData.is_free
          ? null
          : registrationData.razorpay_payment_id,
        payment_status: registrationData.is_free ? "paid" : "pending",
      },
      { transaction }
    );

    // Send free event receipt email if it's a free event
    if (registrationData.is_free) {
      await this.sendFreeEventReceipt(registration, registrationData);
    }
    await transaction.commit();
    return registration;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.sendFreeEventReceipt = async (registration, registrationData) => {
  try {
    // Get event and subevent details
    const Event = require('./events.model');
    const Subevent = require('./subevents.model');
    
    const event = await Event.findByPk(registration.event_id);
    const subevent = await Subevent.findByPk(registration.subevent_id);
    
    // Prepare receipt data for free event
    const receiptData = {
      studentName: registration.student_name,
      studentEmail: registration.student_email,
      mainEventName: event?.event_name || registration.event_name,
      subEventName: subevent?.title || 'N/A',
      startDate: event?.start_date ? new Date(event.start_date).toLocaleDateString() : 'N/A',
      endDate: event?.end_date ? new Date(event.end_date).toLocaleDateString() : 'N/A',
      venue: event?.venue || 'N/A',
      amount: '0',
      paymentId: 'FREE-EVENT',
      registrationDate: new Date().toLocaleDateString(),
      isFree: true
    };
    
    // Generate PDF receipt for free event
    const receiptFilename = `free_receipt_${registration.id}_${Date.now()}.pdf`;
    const receiptPath = await receiptGenerator.saveReceiptPDF(receiptData, receiptFilename);
    
    // Create download URL for the receipt
    const downloadUrl = `${process.env.PAYMENT_CALLBACK_URL?.replace('/api/payments/testing', '') || 'http://localhost:8080'}/receipts/${receiptFilename}`;
    
    // Send email with receipt
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: registration.student_email,
      subject: '🎉 Free Event Registration Confirmation - NRolEHub',
      html: getEmailTemplate('free_registration', {
        studentName: registration.student_name,
        subEventName: subevent?.title || 'N/A',
        mainEventName: event?.event_name || registration.event_name,
        startDate: event?.start_date ? new Date(event.start_date).toLocaleDateString() : 'N/A',
        endDate: event?.end_date ? new Date(event.end_date).toLocaleDateString() : 'N/A',
        venue: event?.venue || 'N/A',
        registrationDate: new Date().toLocaleDateString(),
        subject: 'Free Event Registration Confirmation',
        isFree: true,
        downloadUrl: downloadUrl
      }),
      attachments: [{
        filename: `registration_receipt_${registration.student_name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        path: receiptPath,
        contentType: 'application/pdf'
      }]
    };
    await transporter.sendMail(mailOptions);
    console.log(`Free event receipt sent to ${registration.student_email}`);
  } catch (emailError) {
    console.error('Failed to send free event receipt email:', emailError);
  }
};
exports.getRegistrationsByStudent = async (studentId) => {
  const registrations = await StudentRegistration.findAll({
    where: {
      student_id: studentId,
      payment_status: ["paid"], // Include both free and paid
    },
  });
  
  // Enhance registrations with subevent details
  const Event = require('./events.model');
  const Subevent = require('./subevents.model');
  
  const enhancedRegistrations = await Promise.all(
    registrations.map(async (reg) => {
      try {
        const subevent = await Subevent.findByPk(reg.subevent_id);
        return {
          ...reg.toJSON(),
          subevent_title: subevent?.title || 'Sub Event'
        };
      } catch (error) {
        console.error('Failed to fetch subevent details:', error);
        return {
          ...reg.toJSON(),
          subevent_title: 'Sub Event'
        };
      }
    })
  );
  
  return enhancedRegistrations;
};