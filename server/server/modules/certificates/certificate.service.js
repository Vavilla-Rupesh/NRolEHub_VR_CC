// const Certificate = require('./certificate.model');
// const User = require('../auth/auth.model');
// const Event = require('../events/events.model');
// const Subevent = require('../events/subevents.model');
// const CertificateUploadHistory = require('./certificateUploadHistory.model');
// const overlayTextOnImage = require('../../utils/overlay');
// const fs = require('fs').promises;
// const path = require('path');
// const { sequelize } = require('../../config/dataBase');
// const { sendEmailWithAttachment } = require('../../utils/mailer');
// const StudentRegistration = require('../events/studentRegistration.model');
// const Leaderboard = require('../leaderboard/leaderboard.model');
// const { Op } = require('sequelize');

// function generateCertificateId(event, subevent, registration, rank = null) {
//   const timestamp = Date.now().toString(36);
//   const eventPrefix = event.event_name
//     .replace(/[^a-zA-Z0-9]/g, '')
//     .substr(0, 3)
//     .toUpperCase();
//   const subEventPrefix = subevent.title
//     .replace(/[^a-zA-Z0-9]/g, '')
//     .substr(0, 3)
//     .toUpperCase();
//   const regId = registration.id.toString().padStart(4, '0');
//   const rankSuffix = rank ? `-R${rank}` : '';
  
//   return `${eventPrefix}-${subEventPrefix}-${regId}${rankSuffix}-${timestamp}`;
// }

// function generateFileName(certificateId, studentName) {
//   const sanitizedName = studentName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
//   return `${certificateId}_${sanitizedName}.jpg`;
// }

// function getRankSuffix(rank) {
//   if (rank >= 11 && rank <= 13) return 'th';
//   const lastDigit = rank % 10;
//   switch (lastDigit) {
//     case 1: return 'st';
//     case 2: return 'nd';
//     case 3: return 'rd';
//     default: return 'th';
//   }
// }

// async function sendCertificateEmail(email, outputPath, name, eventName, isWinner = false) {
//   const certificateType = isWinner ? 'merit' : 'participation';
//   await sendEmailWithAttachment(
//     email, 
//     outputPath, 
//     name, 
//     eventName,
//     `Your ${certificateType} certificate for ${eventName}`
//   );
// }

// exports.getCertificatesByUser = async (userId) => {
//   try {
//     const certificates = await Certificate.findAll({
//       where: { user_id: userId },
//       include: [
//         {
//           model: Event,
//           attributes: ['event_name']
//         },
//         {
//           model: Subevent,
//           attributes: ['title']
//         }
//       ],
//       order: [['issued_at', 'DESC']]
//     });

//     return certificates;
//   } catch (error) {
//     console.error('Error fetching certificates:', error);
//     throw new Error('Failed to fetch certificates');
//   }
// };

// exports.getCertificate = async (userId, eventId, subEventId) => {
//   try {
//     const certificate = await Certificate.findOne({
//       where: {
//         user_id: userId,
//         event_id: eventId,
//         subevent_id: subEventId
//       },
//       include: [
//         {
//           model: Event,
//           attributes: ['event_name']
//         },
//         {
//           model: Subevent,
//           attributes: ['title']
//         }
//       ]
//     });

//     if (!certificate) {
//       throw new Error('Certificate not found');
//     }

//     return certificate;
//   } catch (error) {
//     console.error('Error fetching certificate:', error);
//     throw error;
//   }
// };

// exports.getCertificateStatus = async (eventId, subEventId) => {
//   try {
//     // Get all certificates for this event/subevent
//     const certificates = await Certificate.findAll({
//       where: {
//         event_id: eventId,
//         subevent_id: subEventId
//       },
//       attributes: ['id', 'user_id', 'certificate_id'],
//       include: [{
//         model: Leaderboard,
//         required: false,
//         where: {
//           event_id: eventId,
//           subevent_id: subEventId
//         },
//         attributes: ['rank']
//       }]
//     });

//     // Check if we have merit certificates (certificates for winners)
//     const meritCertificates = await Certificate.count({
//       where: {
//         event_id: eventId,
//         subevent_id: subEventId
//       },
//       include: [{
//         model: Leaderboard,
//         required: true,
//         where: {
//           event_id: eventId,
//           subevent_id: subEventId,
//           rank: { [Op.lte]: 3 }
//         }
//       }]
//     });

//     // Check if we have participation certificates (certificates for non-winners)
//     const participationCertificates = await Certificate.count({
//       where: {
//         event_id: eventId,
//         subevent_id: subEventId
//       },
//       include: [{
//         model: Leaderboard,
//         required: false,
//         where: {
//           [Op.or]: [
//             { rank: { [Op.gt]: 3 } },
//             { rank: null }
//           ]
//         }
//       }]
//     });

//     return {
//       participation: participationCertificates > 0,
//       merit: meritCertificates > 0
//     };
//   } catch (error) {
//     console.error('Error checking certificate status:', error);
//     throw new Error('Failed to check certificate status');
//   }
// };

// exports.checkCertificates = async (eventId, subEventId) => {
//   try {
//     const certificates = await Certificate.findAll({
//       where: {
//         event_id: eventId,
//         subevent_id: subEventId
//       },
//       attributes: ['id', 'user_id', 'certificate_id'],
//       include: [{
//         model: Leaderboard,
//         required: false,
//         where: {
//           student_id: sequelize.col('Certificate.user_id'),
//           event_id: eventId,
//           subevent_id: subEventId
//         },
//         attributes: ['rank']
//       }]
//     });

//     return certificates.map(cert => ({
//       id: cert.id,
//       user_id: cert.user_id,
//       certificate_id: cert.certificate_id,
//       rank: cert.Leaderboard?.rank || null
//     }));
//   } catch (error) {
//     console.error('Error checking certificates:', error);
//     throw new Error('Failed to check certificates');
//   }
// };
// exports.generateBulkCertificates = async (inputs) => {
//   const event_id = parseInt(inputs.body.event_id);
//   const subevent_id = parseInt(inputs.body.subevent_id);
//   const templateType = inputs.body.templateType || 'participation';
//   const isTeamEvent = inputs.body.is_team_event === 'true';
//   let uploadHistory;
//   let transaction;

//   try {
//     if (!inputs.files || !inputs.files.pdfFileInput) {
//       throw new Error('Missing template image');
//     }

//     const coordinates = {
//       name: {
//         x: parseInt(inputs.body.nameX),
//         y: parseInt(inputs.body.nameY)
//       },
//       event: {
//         x: parseInt(inputs.body.eventX),
//         y: parseInt(inputs.body.eventY)
//       },
//       date: {
//         x: parseInt(inputs.body.dateX),
//         y: parseInt(inputs.body.dateY)
//       },
//       certificateId: {
//         x: parseInt(inputs.body.certificateIdX),
//         y: parseInt(inputs.body.certificateIdY)
//       },
//       rollNumber: {
//         x: parseInt(inputs.body.rollNumberX),
//         y: parseInt(inputs.body.rollNumberY)
//       },
//       year: {
//         x: parseInt(inputs.body.yearX),
//         y: parseInt(inputs.body.yearY)
//       },
//       sem: {
//         x: parseInt(inputs.body.semX),
//         y: parseInt(inputs.body.semY)
//       },
//       stream: {
//         x: parseInt(inputs.body.streamX),
//         y: parseInt(inputs.body.streamY)
//       },
//       college: {
//         x: parseInt(inputs.body.collegeX),
//         y: parseInt(inputs.body.collegeY)
//       },
//       rank: inputs.body.rankX && inputs.body.rankY ? {
//         x: parseInt(inputs.body.rankX),
//         y: parseInt(inputs.body.rankY)
//       } : null
//     };

//     const templateImageBuffer = await fs.readFile(inputs.files.pdfFileInput[0].path);
//     transaction = await sequelize.transaction();

//     const event = await Event.findByPk(event_id);
//     const subevent = await Subevent.findByPk(subevent_id);
    
//     if (!event || !subevent) {
//       throw new Error('Event or subevent not found');
//     }

//     // Check if this is a team event and delegate to team certificate service
//     if (isTeamEvent) {
//       const TeamCertificateService = require('../teams/team-certificate.service');
//       return await TeamCertificateService.generateTeamCertificates(inputs);
//     }

//     uploadHistory = await CertificateUploadHistory.create({
//       userId: inputs.user?.id || 1,
//       certificateId: Math.round(Math.random() * 100000),
//       uploadDate: new Date(),
//       uploadStatus: 'Processing',
//       uploadFileUrl: inputs.files.pdfFileInput[0].path,
//       uploadFileStatus: 'Pending',
//       uploadFileComment: `File uploaded for ${templateType} certificate generation`,
//     }, { transaction });

//     let students = [];
//     if (templateType === 'merit') {
//       const leaderboard = await Leaderboard.findAll({
//         where: { event_id, subevent_id },
//         order: [['rank', 'ASC']],
//       });

//       const registrations = await StudentRegistration.findAll({
//         where: {
//           event_id,
//           subevent_id,
//           student_id: leaderboard.map(entry => entry.student_id),
//           payment_status: 'paid',
//           attendance: true
//         }
//       });

//       students = leaderboard.map(entry => {
//         const registration = registrations.find(reg => reg.student_id === entry.student_id);
//         if (registration) {
//           return {
//             ...registration.toJSON(),
//             rank: entry.rank,
//             score: entry.score
//           };
//         }
//         return null;
//       }).filter(Boolean);
//     } else if (templateType === 'participation') {
//       const winners = await Leaderboard.findAll({
//         where: { event_id, subevent_id },
//         attributes: ['student_id']
//       });

//       const winnerIds = winners.map(winner => winner.student_id);

//       students = await StudentRegistration.findAll({
//         where: { 
//           event_id,
//           subevent_id,
//           payment_status: 'paid',
//           attendance: true,
//           student_id: { [Op.notIn]: winnerIds }
//         }
//       });
//     }

//     if (!students.length) {
//       throw new Error(`No eligible students found for ${templateType} certificates`);
//     }

//     const baseDir = path.join(process.cwd(), 'Records');
//     await fs.mkdir(baseDir, { recursive: true });

//     for (const student of students) {
//       try {
//         // Combine main event and sub-event names
//         const mainEventName = event.event_name;
//         const subEventName = subevent.title;
//         const combinedEventName = `${mainEventName} - ${subEventName}`;
        
//         const email = student.student_email;
//         const name = student.student_name;
//         const certificateDate = new Date().toLocaleDateString();

//         const studentDetails = await User.findByPk(student.student_id, {
//           attributes: ['roll_number', 'year', 'semester', 'college_name','stream']
//         });

//         if (!combinedEventName || !email || !name) {
//           console.error('Missing required data:', { combinedEventName, email, name });
//           continue;
//         }

//         const certificateId = generateCertificateId(event, subevent, student, student.rank);
//         const fileName = generateFileName(certificateId, name);
//         const outputDir = path.join(baseDir, mainEventName.replace(/[^a-zA-Z0-9]/g, '_'));
//         await fs.mkdir(outputDir, { recursive: true });
//         const outputPath = path.join(outputDir, fileName);

//         const certificateBuffer = await overlayTextOnImage(
//           templateImageBuffer,
//           name,
//           combinedEventName,
//           certificateDate,
//           coordinates,
//           certificateId,
//           student.rank ? `${student.rank}${getRankSuffix(student.rank)} Place` : null,
//           null,
//           {
//             rollNumber: studentDetails.roll_number,
//             year: studentDetails.year,
//             semester: studentDetails.semester,
//             collegeName: studentDetails.college_name,
//             stream:studentDetails.stream
//           }
//         );

//         if (!Buffer.isBuffer(certificateBuffer)) {
//           throw new Error('Invalid certificate buffer generated');
//         }

//         await fs.writeFile(outputPath, certificateBuffer);

//         await Certificate.create({
//           user_id: student.student_id,
//           event_id,
//           subevent_id,
//           certificate_url: outputPath,
//           certificate_id: certificateId,
//           rank: student.rank || null,
//           issued_at: new Date(),
//         }, { transaction });

//         const isWinner = templateType === 'merit' && student.rank;
//         await sendCertificateEmail(email, outputPath, name, combinedEventName, isWinner);
//       } catch (err) {
//         console.error('Error processing certificate:', err);
//       }
//     }

//     await uploadHistory.update({
//       uploadStatus: 'Completed',
//       uploadFileStatus: 'Completed',
//     }, { transaction });

//     await Subevent.update(
//       { certificate_Generated: true },
//       { where: { id: subevent_id }, transaction }
//     );

//     await transaction.commit();
    
//     // Notify students about certificate generation
//     // try {
//     //   const studentIds = students.map(student => student.student_id);
//     //   const mainEventName = event.event_name;
//     //   const subEventName = subevent.title;
//     //   const combinedEventName = `${mainEventName} - ${subEventName}`;
      
//     //   await InWebNotificationService.notifyCertificateGenerated(
//     //     event_id, 
//     //     subevent_id, 
//     //     combinedEventName, 
//     //     studentIds
//     //   );
//     // } catch (notificationError) {
//     //   console.error('Failed to notify about certificates:', notificationError);
//     // }
    
//     return { success: true, message: 'Certificates generated successfully' };
//   } catch (err) {
//     console.error('Certificate generation error:', err);
//     if (transaction) {
//       await transaction.rollback();
//     }
//     throw err;
//   }
// }


const Certificate = require("./certificate.model");
const User = require("../auth/auth.model");
const Event = require("../events/events.model");
const Subevent = require("../events/subevents.model");
const CertificateUploadHistory = require("./certificateUploadHistory.model");
const overlayTextOnImage = require("../../utils/overlay");
const fs = require("fs").promises;
const path = require("path");
const { sequelize } = require("../../config/dataBase");
const { sendEmailWithAttachment } = require("../../utils/mailer");
const StudentRegistration = require("../events/studentRegistration.model");
const Leaderboard = require("../leaderboard/leaderboard.model");
const { Op } = require("sequelize");

function generateCertificateId(event, registration) {
  // Use the new format: iqac_reference + '-' + (student_registration_id + 1000)
  const iqacReference = event.iqac_reference;
  const registrationIdPlusThousand = registration.id + 1000;

  return `${iqacReference}-${registrationIdPlusThousand}`;
}

function generateFileName(certificateId, studentName) {
  const sanitizedName = studentName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
  return `${certificateId}_${sanitizedName}.jpg`;
}

function getRankSuffix(rank) {
  if (rank >= 11 && rank <= 13) return "th";
  const lastDigit = rank % 10;
  switch (lastDigit) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

async function sendCertificateEmail(
  email,
  outputPath,
  name,
  eventName,
  isWinner = false
) {
  const certificateType = isWinner ? "merit" : "participation";
  await sendEmailWithAttachment(
    email,
    outputPath,
    name,
    eventName,
    `Your ${certificateType} certificate for ${eventName}`
  );
}

exports.getCertificatesByUser = async (userId) => {
  try {
    const certificates = await Certificate.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Event,
          attributes: ["event_name"],
        },
        {
          model: Subevent,
          attributes: ["title"],
        },
      ],
      order: [["issued_at", "DESC"]],
    });

    return certificates;
  } catch (error) {
    console.error("Error fetching certificates:", error);
    throw new Error("Failed to fetch certificates");
  }
};

exports.getCertificate = async (userId, eventId, subEventId) => {
  try {
    const certificate = await Certificate.findOne({
      where: {
        user_id: userId,
        event_id: eventId,
        subevent_id: subEventId,
      },
      include: [
        {
          model: Event,
          attributes: ["event_name"],
        },
        {
          model: Subevent,
          attributes: ["title"],
        },
      ],
    });

    if (!certificate) {
      throw new Error("Certificate not found");
    }

    return certificate;
  } catch (error) {
    console.error("Error fetching certificate:", error);
    throw error;
  }
};

exports.getCertificateStatus = async (eventId, subEventId) => {
  try {
    // Get all certificates for this event/subevent
    const certificates = await Certificate.findAll({
      where: {
        event_id: eventId,
        subevent_id: subEventId,
      },
      attributes: ["id", "user_id", "certificate_id"],
      include: [
        {
          model: Leaderboard,
          required: false,
          where: {
            event_id: eventId,
            subevent_id: subEventId,
          },
          attributes: ["rank"],
        },
      ],
    });

    // Check if we have merit certificates (certificates for winners)
    const meritCertificates = await Certificate.count({
      where: {
        event_id: eventId,
        subevent_id: subEventId,
      },
      include: [
        {
          model: Leaderboard,
          required: true,
          where: {
            event_id: eventId,
            subevent_id: subEventId,
            rank: { [Op.lte]: 3 },
          },
        },
      ],
    });

    // Check if we have participation certificates (certificates for non-winners)
    const participationCertificates = await Certificate.count({
      where: {
        event_id: eventId,
        subevent_id: subEventId,
      },
      include: [
        {
          model: Leaderboard,
          required: false,
          where: {
            [Op.or]: [{ rank: { [Op.gt]: 3 } }, { rank: null }],
          },
        },
      ],
    });

    return {
      participation: participationCertificates > 0,
      merit: meritCertificates > 0,
    };
  } catch (error) {
    console.error("Error checking certificate status:", error);
    throw new Error("Failed to check certificate status");
  }
};

exports.checkCertificates = async (eventId, subEventId) => {
  try {
    const certificates = await Certificate.findAll({
      where: {
        event_id: eventId,
        subevent_id: subEventId,
      },
      attributes: ["id", "user_id", "certificate_id"],
      include: [
        {
          model: Leaderboard,
          required: false,
          where: {
            student_id: sequelize.col("Certificate.user_id"),
            event_id: eventId,
            subevent_id: subEventId,
          },
          attributes: ["rank"],
        },
      ],
    });

    return certificates.map((cert) => ({
      id: cert.id,
      user_id: cert.user_id,
      certificate_id: cert.certificate_id,
      rank: cert.Leaderboard?.rank || null,
    }));
  } catch (error) {
    console.error("Error checking certificates:", error);
    throw new Error("Failed to check certificates");
  }
};
exports.generateBulkCertificates = async (inputs) => {
  const event_id = parseInt(inputs.body.event_id);
  const subevent_id = parseInt(inputs.body.subevent_id);
  const templateType = inputs.body.templateType || "participation";
  const isTeamEvent = inputs.body.is_team_event === "true";
  let uploadHistory;
  let transaction;

  try {
    if (!inputs.files || !inputs.files.pdfFileInput) {
      throw new Error("Missing template image");
    }

    const coordinates = {
      name: {
        x: parseInt(inputs.body.nameX),
        y: parseInt(inputs.body.nameY),
      },
      event: {
        x: parseInt(inputs.body.eventX),
        y: parseInt(inputs.body.eventY),
      },
      date: {
        x: parseInt(inputs.body.dateX),
        y: parseInt(inputs.body.dateY),
      },
      certificateId: {
        x: parseInt(inputs.body.certificateIdX),
        y: parseInt(inputs.body.certificateIdY),
      },
      rollNumber: {
        x: parseInt(inputs.body.rollNumberX),
        y: parseInt(inputs.body.rollNumberY),
      },
      year: {
        x: parseInt(inputs.body.yearX),
        y: parseInt(inputs.body.yearY),
      },
      sem: {
        x: parseInt(inputs.body.semX),
        y: parseInt(inputs.body.semY),
      },
      stream: {
        x: parseInt(inputs.body.streamX),
        y: parseInt(inputs.body.streamY),
      },
      college: {
        x: parseInt(inputs.body.collegeX),
        y: parseInt(inputs.body.collegeY),
      },
      rank:
        inputs.body.rankX && inputs.body.rankY
          ? {
              x: parseInt(inputs.body.rankX),
              y: parseInt(inputs.body.rankY),
            }
          : null,
    };

    const templateImageBuffer = await fs.readFile(
      inputs.files.pdfFileInput[0].path
    );
    transaction = await sequelize.transaction();

    const event = await Event.findByPk(event_id);
    const subevent = await Subevent.findByPk(subevent_id);

    if (!event || !subevent) {
      throw new Error("Event or subevent not found");
    }

    // Check if this is a team event and delegate to team certificate service
    if (isTeamEvent) {
      const TeamCertificateService = require("../teams/team-certificate.service");
      return await TeamCertificateService.generateTeamCertificates(inputs);
    }

    uploadHistory = await CertificateUploadHistory.create(
      {
        userId: inputs.user?.id || 1,
        certificateId: Math.round(Math.random() * 100000),
        uploadDate: new Date(),
        uploadStatus: "Processing",
        uploadFileUrl: inputs.files.pdfFileInput[0].path,
        uploadFileStatus: "Pending",
        uploadFileComment: `File uploaded for ${templateType} certificate generation`,
      },
      { transaction }
    );

    let students = [];
    if (templateType === "merit") {
      const leaderboard = await Leaderboard.findAll({
        where: { event_id, subevent_id },
        order: [["rank", "ASC"]],
      });

      const registrations = await StudentRegistration.findAll({
        where: {
          event_id,
          subevent_id,
          student_id: leaderboard.map((entry) => entry.student_id),
          payment_status: "paid",
          attendance: true,
        },
      });

      students = leaderboard
        .map((entry) => {
          const registration = registrations.find(
            (reg) => reg.student_id === entry.student_id
          );
          if (registration) {
            return {
              ...registration.toJSON(),
              rank: entry.rank,
              score: entry.score,
            };
          }
          return null;
        })
        .filter(Boolean);
    } else if (templateType === "participation") {
      const winners = await Leaderboard.findAll({
        where: { event_id, subevent_id },
        attributes: ["student_id"],
      });

      const winnerIds = winners.map((winner) => winner.student_id);

      students = await StudentRegistration.findAll({
        where: {
          event_id,
          subevent_id,
          payment_status: "paid",
          attendance: true,
          student_id: { [Op.notIn]: winnerIds },
        },
      });
    }

    if (!students.length) {
      throw new Error(
        `No eligible students found for ${templateType} certificates`
      );
    }

    const baseDir = path.join(process.cwd(), "Records");
    await fs.mkdir(baseDir, { recursive: true });

    for (const student of students) {
      try {
        // Combine main event and sub-event names
        const mainEventName = event.event_name;
        const subEventName = subevent.title;
        const combinedEventName = `${subEventName} - ${mainEventName}`;

        const email = student.student_email;
        const name = student.student_name;
        const certificateDate = new Date().toLocaleDateString();

        const studentDetails = await User.findByPk(student.student_id, {
          attributes: [
            "roll_number",
            "year",
            "semester",
            "college_name",
            "stream",
          ],
        });

        if (!combinedEventName || !email || !name) {
          console.error("Missing required data:", {
            combinedEventName,
            email,
            name,
          });
          continue;
        }

        const certificateId = generateCertificateId(event, student);
        const fileName = generateFileName(certificateId, name);
        const outputDir = path.join(
          baseDir,
          mainEventName.replace(/[^a-zA-Z0-9]/g, "_")
        );
        await fs.mkdir(outputDir, { recursive: true });
        const outputPath = path.join(outputDir, fileName);

        const certificateBuffer = await overlayTextOnImage(
          templateImageBuffer,
          name,
          combinedEventName,
          certificateDate,
          coordinates,
          certificateId,
          student.rank
            ? `${student.rank}${getRankSuffix(student.rank)} Place`
            : null,
          null,
          {
            rollNumber: studentDetails.roll_number,
            year: studentDetails.year,
            semester: studentDetails.semester,
            collegeName: studentDetails.college_name,
            stream: studentDetails.stream,
          }
        );

        if (!Buffer.isBuffer(certificateBuffer)) {
          throw new Error("Invalid certificate buffer generated");
        }

        await fs.writeFile(outputPath, certificateBuffer);

        await Certificate.create(
          {
            user_id: student.student_id,
            event_id,
            subevent_id,
            certificate_url: outputPath,
            certificate_id: certificateId,
            rank: student.rank || null,
            issued_at: new Date(),
          },
          { transaction }
        );

        const isWinner = templateType === "merit" && student.rank;
        await sendCertificateEmail(
          email,
          outputPath,
          name,
          combinedEventName,
          isWinner
        );
      } catch (err) {
        console.error("Error processing certificate:", err);
      }
    }

    await uploadHistory.update(
      {
        uploadStatus: "Completed",
        uploadFileStatus: "Completed",
      },
      { transaction }
    );

    await Subevent.update(
      { certificate_Generated: true },
      { where: { id: subevent_id }, transaction }
    );

    await transaction.commit();

    // Notify students about certificate generation
    // try {
    //   const studentIds = students.map(student => student.student_id);
    //   const mainEventName = event.event_name;
    //   const subEventName = subevent.title;
    //   const combinedEventName = `${mainEventName} - ${subEventName}`;

    //   await InWebNotificationService.notifyCertificateGenerated(
    //     event_id,
    //     subevent_id,
    //     combinedEventName,
    //     studentIds
    //   );
    // } catch (notificationError) {
    //   console.error('Failed to notify about certificates:', notificationError);
    // }

    return { success: true, message: "Certificates generated successfully" };
  } catch (err) {
    console.error("Certificate generation error:", err);
    if (transaction) {
      await transaction.rollback();
    }
    throw err;
  }
};
