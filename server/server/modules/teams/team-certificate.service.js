// const TeamCertificate = require('./team-certificate.model');
// const Team = require('./team.model');
// const TeamMember = require('./team-member.model');
// const TeamLeaderboard = require('./team-leaderboard.model');
// const Event = require('../events/events.model');
// const Subevent = require('../events/subevents.model');
// const User = require('../auth/auth.model');
// const overlayTextOnImage = require('../../utils/overlay');
// const { sendEmailWithAttachment } = require('../../utils/mailer');
// const fs = require('fs').promises;
// const path = require('path');
// const { sequelize } = require('../../config/dataBase');

// function generateCertificateId(team, member, event, subevent, rank = null) {
//   const timestamp = Date.now().toString(36);
//   const eventPrefix = event.event_name.replace(/[^a-zA-Z0-9]/g, '').substr(0, 3).toUpperCase();
//   const subEventPrefix = subevent.title.replace(/[^a-zA-Z0-9]/g, '').substr(0, 3).toUpperCase();
//   const teamId = team.id.toString().padStart(4, '0');
//   const rankSuffix = rank ? `-R${rank}` : '';
//   return `TEAM-${eventPrefix}-${subEventPrefix}-${teamId}${rankSuffix}-${timestamp}`;
// }

// function generateFileName(certificateId, teamName, memberName) {
//   const sanitizedTeam = (teamName || 'unknown').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
//   const sanitizedMember = memberName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
//   return `${certificateId}_${sanitizedTeam}_${sanitizedMember}.jpg`;
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

// exports.generateTeamCertificates = async (inputs) => {
//   const event_id = parseInt(inputs.body.event_id);
//   const subevent_id = parseInt(inputs.body.subevent_id);
//   const templateType = inputs.body.templateType || 'participation';
//   let transaction;

//   try {
//     if (!inputs.files || !inputs.files.pdfFileInput) {
//       throw new Error('Missing template image');
//     }

//     const coordinates = {
//       teamName: { x: parseInt(inputs.body.teamNameX), y: parseInt(inputs.body.teamNameY) },
//       name: { x: parseInt(inputs.body.nameX), y: parseInt(inputs.body.nameY) },
//       event: { x: parseInt(inputs.body.eventX), y: parseInt(inputs.body.eventY) },
//       date: { x: parseInt(inputs.body.dateX), y: parseInt(inputs.body.dateY) },
//       certificateId: { x: parseInt(inputs.body.certificateIdX), y: parseInt(inputs.body.certificateIdY) },
//       rollNumber: { x: parseInt(inputs.body.rollNumberX), y: parseInt(inputs.body.rollNumberY) },
//       year: { x: parseInt(inputs.body.yearX), y: parseInt(inputs.body.yearY) },
//       sem: { x: parseInt(inputs.body.semX), y: parseInt(inputs.body.semY) },
//       stream: { x: parseInt(inputs.body.streamX), y: parseInt(inputs.body.streamY) },
//       college: { x: parseInt(inputs.body.collegeX), y: parseInt(inputs.body.collegeY) },
//       rank: inputs.body.rankX && inputs.body.rankY ? { x: parseInt(inputs.body.rankX), y: parseInt(inputs.body.rankY) } : null
//     };

//     const templateImageBuffer = await fs.readFile(inputs.files.pdfFileInput[0].path);
//     transaction = await sequelize.transaction();

//     const event = await Event.findByPk(event_id);
//     const subevent = await Subevent.findByPk(subevent_id);
//     if (!event || !subevent) throw new Error('Event or subevent not found');

//     let teams = [];
    
//     if (templateType === 'merit') {
//       // For merit certificates - get teams from leaderboard with proper team data
//       const leaderboard = await TeamLeaderboard.findAll({
//         where: { event_id, subevent_id },
//         order: [['rank', 'ASC']],
//         include: [{
//           model: Team,
//           attributes: ['id', 'name', 'leader_id'], // Make sure to include name attribute
//           include: [{
//             model: TeamMember,
//             where: { status: 'accepted' },
//             include: [{ 
//               model: User, 
//               as: 'student',
//               attributes: ['id', 'username', 'email', 'roll_number', 'year', 'semester', 'college_name', 'stream']
//             }]
//           }]
//         }]
//       });

//       // Map the leaderboard data correctly
//       teams = leaderboard.map(entry => {
//         const teamData = entry.Team.toJSON();
//         return {
//           id: teamData.id,
//           name: teamData.name || `Team ${teamData.id}`, // Ensure team name is properly mapped with fallback
//           TeamMembers: teamData.TeamMembers,
//           rank: entry.rank,
//           score: entry.score
//         };
//       });

//       console.log('Merit Teams Data:', teams.map(t => ({ id: t.id, name: t.name, rank: t.rank })));

//     } else {
//       // For participation certificates - get teams with attendance
//       const teamsWithAttendance = await Team.findAll({
//         where: { event_id, subevent_id },
//         attributes: ['id', 'name', 'leader_id'], // Make sure to include name attribute
//         include: [{
//           model: TeamMember,
//           where: { status: 'accepted' },
//           include: [{ 
//             model: User, 
//             as: 'student',
//             attributes: ['id', 'username', 'email', 'roll_number', 'year', 'semester', 'college_name', 'stream']
//           }]
//         }]
//       });

//       // Filter out teams that are already in leaderboard (merit winners)
//       const leaderboardTeams = await TeamLeaderboard.findAll({ 
//         where: { event_id, subevent_id },
//         attributes: ['team_id']
//       });
//       const leaderboardTeamIds = leaderboardTeams.map(t => t.team_id);

//       teams = teamsWithAttendance
//         .filter(team => !leaderboardTeamIds.includes(team.id))
//         .map(team => {
//           const teamData = team.toJSON();
//           return {
//             id: teamData.id,
//             name: teamData.name || `Team ${teamData.id}`, // Ensure team name is properly mapped with fallback
//             TeamMembers: teamData.TeamMembers
//           };
//         });

//       console.log('Participation Teams Data:', teams.map(t => ({ id: t.id, name: t.name })));
//     }

//     if (!teams.length) {
//       throw new Error(`No eligible teams found for ${templateType} certificates`);
//     }

//     const baseDir = path.join(process.cwd(), 'Records', 'Teams');
//     await fs.mkdir(baseDir, { recursive: true });

//     // Generate certificates for each team member
//     for (const team of teams) {
//       if (!team.TeamMembers?.length) {
//         console.warn(`Team ${team.id} (${team.name}) has no members, skipping`);
//         continue;
//       }

//       console.log(`Processing Team: ID=${team.id}, Name="${team.name}", Members=${team.TeamMembers.length}`);

//       const eventName = event.event_name;
//       const subEventName = subevent.title;
//       const combinedEventName = `${eventName} - ${subEventName}`;
//       const certificateDate = new Date().toLocaleDateString();
//       const outputDir = path.join(baseDir, eventName.replace(/[^a-zA-Z0-9]/g, '_'));
//       await fs.mkdir(outputDir, { recursive: true });

//       for (const member of team.TeamMembers) {
//         if (!member.student) {
//           console.warn(`Member ${member.id} has no student data, skipping`);
//           continue;
//         }

//         const teamName = team.name || 'Unknown Team';
//         console.log(`Generating certificate for Team ID: ${team.id}, Name: "${teamName}", Member: "${member.student.username}"`);

//         const certificateId = generateCertificateId(team, member, event, subevent, team.rank);
//         const fileName = generateFileName(certificateId, teamName, member.student.username);
//         const outputPath = path.join(outputDir, fileName);

//         // Ensure team name is not null/undefined - add debug logging
//         console.log(`Certificate generation params:`, {
//           studentName: member.student.username,
//           eventName: combinedEventName,
//           teamName: teamName,
//           certificateId: certificateId,
//           rank: team.rank ? `${team.rank}${getRankSuffix(team.rank)} Place` : null
//         });

//         const certificateBuffer = await overlayTextOnImage(
//           templateImageBuffer,
//           member.student.username, // Student name
//           combinedEventName, // Combined event name
//           certificateDate, // Certificate date
//           coordinates, // All coordinates
//           certificateId, // Certificate ID
//           team.rank ? `${team.rank}${getRankSuffix(team.rank)} Place` : null, // Rank text
//           teamName || `Team ${team.id}`, // Team name with guaranteed fallback
//           {
//             rollNumber: member.student.roll_number,
//             year: member.student.year,
//             semester: member.student.semester,
//             collegeName: member.student.college_name,
//             stream: member.student.stream
//           }
//         );

//         await fs.writeFile(outputPath, certificateBuffer);

//         // Create certificate record in database
//         await TeamCertificate.create({
//           team_id: team.id,
//           member_id: member.id,
//           event_id,
//           subevent_id,
//           certificate_url: outputPath,
//           certificate_id: certificateId,
//           rank: team.rank || null,
//           issued_at: new Date()
//         }, { transaction });

//         // Send email with certificate
//         try {
//           await sendEmailWithAttachment(
//             member.student.email,
//             outputPath,
//             member.student.username,
//             combinedEventName,
//             !!team.rank
//           );
//           console.log(`Email sent successfully to ${member.student.email}`);
//         } catch (emailErr) {
//           console.error(`Failed to send email to ${member.student.email}:`, emailErr);
//         }
//       }
//     }

//     await transaction.commit();
    
//     // Notify team members about certificate generation
//     // try {
//     //   const studentIds = team.TeamMembers.map(member => member.student_id);
//     //   const combinedEventName = `${event.event_name} - ${subevent.title}`;
      
//     //   await InWebNotificationService.notifyCertificateGenerated(
//     //     event_id, 
//     //     subevent_id, 
//     //     combinedEventName, 
//     //     studentIds
//     //   );
//     // } catch (notificationError) {
//     //   console.error('Failed to notify about team certificates:', notificationError);
//     // }
    
//     console.log('Team certificates generated successfully');
//     return { success: true, message: 'Team certificates generated successfully' };

//   } catch (err) {
//     console.error('Team certificate generation error:', err);
//     if (transaction) await transaction.rollback();
//     throw err;
//   }
// };


const TeamCertificate = require("./team-certificate.model");
const Team = require("./team.model");
const TeamMember = require("./team-member.model");
const TeamLeaderboard = require("./team-leaderboard.model");
const Event = require("../events/events.model");
const Subevent = require("../events/subevents.model");
const User = require("../auth/auth.model");
const overlayTextOnImage = require("../../utils/overlay");
const { sendEmailWithAttachment } = require("../../utils/mailer");
const fs = require("fs").promises;
const path = require("path");
const { sequelize } = require("../../config/dataBase");

function generateCertificateId(event, registration) {
  // Use the new format: iqac_reference + '-' + (student_registration_id + 1000)

  const iqacReference = event.iqac_reference;

  const registrationIdPlusThousand = registration.id + 1000;

  return `${iqacReference}-${registrationIdPlusThousand}`;
}

function generateFileName(certificateId, teamName, memberName) {
  const sanitizedTeam = (teamName || "unknown")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .toLowerCase();
  const sanitizedMember = memberName
    .replace(/[^a-zA-Z0-9]/g, "_")
    .toLowerCase();
  return `${certificateId}_${sanitizedTeam}_${sanitizedMember}.jpg`;
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

exports.generateTeamCertificates = async (inputs) => {
  const event_id = parseInt(inputs.body.event_id);
  const subevent_id = parseInt(inputs.body.subevent_id);
  const templateType = inputs.body.templateType || "participation";
  let transaction;

  try {
    if (!inputs.files || !inputs.files.pdfFileInput) {
      throw new Error("Missing template image");
    }

    const coordinates = {
      teamName: {
        x: parseInt(inputs.body.teamNameX),
        y: parseInt(inputs.body.teamNameY),
      },
      name: { x: parseInt(inputs.body.nameX), y: parseInt(inputs.body.nameY) },
      event: {
        x: parseInt(inputs.body.eventX),
        y: parseInt(inputs.body.eventY),
      },
      date: { x: parseInt(inputs.body.dateX), y: parseInt(inputs.body.dateY) },
      certificateId: {
        x: parseInt(inputs.body.certificateIdX),
        y: parseInt(inputs.body.certificateIdY),
      },
      rollNumber: {
        x: parseInt(inputs.body.rollNumberX),
        y: parseInt(inputs.body.rollNumberY),
      },
      year: { x: parseInt(inputs.body.yearX), y: parseInt(inputs.body.yearY) },
      sem: { x: parseInt(inputs.body.semX), y: parseInt(inputs.body.semY) },
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
          ? { x: parseInt(inputs.body.rankX), y: parseInt(inputs.body.rankY) }
          : null,
    };

    const templateImageBuffer = await fs.readFile(
      inputs.files.pdfFileInput[0].path
    );
    transaction = await sequelize.transaction();

    const event = await Event.findByPk(event_id);
    const subevent = await Subevent.findByPk(subevent_id);
    if (!event || !subevent) throw new Error("Event or subevent not found");

    let teams = [];

    if (templateType === "merit") {
      // For merit certificates - get teams from leaderboard with proper team data
      const leaderboard = await TeamLeaderboard.findAll({
        where: { event_id, subevent_id },
        order: [["rank", "ASC"]],
        include: [
          {
            model: Team,
            attributes: ["id", "name", "leader_id"], // Make sure to include name attribute
            include: [
              {
                model: TeamMember,
                where: { status: "accepted" },
                include: [
                  {
                    model: User,
                    as: "student",
                    attributes: [
                      "id",
                      "username",
                      "email",
                      "roll_number",
                      "year",
                      "semester",
                      "college_name",
                      "stream",
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      // Map the leaderboard data correctly
      teams = leaderboard.map((entry) => {
        const teamData = entry.Team.toJSON();
        return {
          id: teamData.id,
          name: teamData.name || `Team ${teamData.id}`, // Ensure team name is properly mapped with fallback
          TeamMembers: teamData.TeamMembers,
          rank: entry.rank,
          score: entry.score,
        };
      });

      console.log(
        "Merit Teams Data:",
        teams.map((t) => ({ id: t.id, name: t.name, rank: t.rank }))
      );
    } else {
      // For participation certificates - get teams with attendance
      const teamsWithAttendance = await Team.findAll({
        where: { event_id, subevent_id },
        attributes: ["id", "name", "leader_id"], // Make sure to include name attribute
        include: [
          {
            model: TeamMember,
            where: { status: "accepted" },
            include: [
              {
                model: User,
                as: "student",
                attributes: [
                  "id",
                  "username",
                  "email",
                  "roll_number",
                  "year",
                  "semester",
                  "college_name",
                  "stream",
                ],
              },
            ],
          },
        ],
      });

      // Filter out teams that are already in leaderboard (merit winners)
      const leaderboardTeams = await TeamLeaderboard.findAll({
        where: { event_id, subevent_id },
        attributes: ["team_id"],
      });
      const leaderboardTeamIds = leaderboardTeams.map((t) => t.team_id);

      teams = teamsWithAttendance
        .filter((team) => !leaderboardTeamIds.includes(team.id))
        .map((team) => {
          const teamData = team.toJSON();
          return {
            id: teamData.id,
            name: teamData.name || `Team ${teamData.id}`, // Ensure team name is properly mapped with fallback
            TeamMembers: teamData.TeamMembers,
          };
        });

      console.log(
        "Participation Teams Data:",
        teams.map((t) => ({ id: t.id, name: t.name }))
      );
    }

    if (!teams.length) {
      throw new Error(
        `No eligible teams found for ${templateType} certificates`
      );
    }

    const baseDir = path.join(process.cwd(), "Records", "Teams");
    await fs.mkdir(baseDir, { recursive: true });

    // Generate certificates for each team member
    for (const team of teams) {
      if (!team.TeamMembers?.length) {
        console.warn(`Team ${team.id} (${team.name}) has no members, skipping`);
        continue;
      }

      console.log(
        `Processing Team: ID=${team.id}, Name="${team.name}", Members=${team.TeamMembers.length}`
      );

      const eventName = event.event_name;
      const subEventName = subevent.title;
      const combinedEventName = `${subEventName} - ${eventName}`;
      const certificateDate = new Date().toLocaleDateString();
      const outputDir = path.join(
        baseDir,
        eventName.replace(/[^a-zA-Z0-9]/g, "_")
      );
      await fs.mkdir(outputDir, { recursive: true });

      for (const member of team.TeamMembers) {
        if (!member.student) {
          console.warn(`Member ${member.id} has no student data, skipping`);
          continue;
        }

        const teamName = team.name || "Unknown Team";
        console.log(
          `Generating certificate for Team ID: ${team.id}, Name: "${teamName}", Member: "${member.student.username}"`
        );

        const StudentRegistration = require("../events/studentRegistration.model");

        const registration = await StudentRegistration.findOne({
          where: {
            student_id: member.student_id,

            event_id,

            subevent_id,

            payment_status: "paid",
          },
        });

        if (!registration) {
          console.warn(
            `No registration found for student ${member.student_id}, skipping certificate generation`
          );

          continue;
        }

        const certificateId = generateCertificateId(event, registration);
        const fileName = generateFileName(
          certificateId,
          teamName,
          member.student.username
        );
        const outputPath = path.join(outputDir, fileName);

        // Ensure team name is not null/undefined - add debug logging
        console.log(`Certificate generation params:`, {
          studentName: member.student.username,
          eventName: combinedEventName,
          teamName: teamName,
          certificateId: certificateId,
          rank: team.rank
            ? `${team.rank}${getRankSuffix(team.rank)} Place`
            : null,
        });

        const certificateBuffer = await overlayTextOnImage(
          templateImageBuffer,
          member.student.username, // Student name
          combinedEventName, // Combined event name
          certificateDate, // Certificate date
          coordinates, // All coordinates
          certificateId, // Certificate ID
          team.rank ? `${team.rank}${getRankSuffix(team.rank)} Place` : null, // Rank text
          teamName || `Team ${team.id}`, // Team name with guaranteed fallback
          {
            rollNumber: member.student.roll_number,
            year: member.student.year,
            semester: member.student.semester,
            collegeName: member.student.college_name,
            stream: member.student.stream,
          }
        );

        await fs.writeFile(outputPath, certificateBuffer);

        // Create certificate record in database
        await TeamCertificate.create(
          {
            team_id: team.id,
            member_id: member.id,
            event_id,
            subevent_id,
            certificate_url: outputPath,
            certificate_id: certificateId,
            rank: team.rank || null,
            issued_at: new Date(),
          },
          { transaction }
        );

        // Send email with certificate
        try {
          await sendEmailWithAttachment(
            member.student.email,
            outputPath,
            member.student.username,
            combinedEventName,
            !!team.rank
          );
          console.log(`Email sent successfully to ${member.student.email}`);
        } catch (emailErr) {
          console.error(
            `Failed to send email to ${member.student.email}:`,
            emailErr
          );
        }
      }
    }

    await transaction.commit();

    // Notify team members about certificate generation
    // try {
    //   const studentIds = team.TeamMembers.map(member => member.student_id);
    //   const combinedEventName = `${event.event_name} - ${subevent.title}`;

    //   await InWebNotificationService.notifyCertificateGenerated(
    //     event_id,
    //     subevent_id,
    //     combinedEventName,
    //     studentIds
    //   );
    // } catch (notificationError) {
    //   console.error('Failed to notify about team certificates:', notificationError);
    // }

    console.log("Team certificates generated successfully");
    return {
      success: true,
      message: "Team certificates generated successfully",
    };
  } catch (err) {
    console.error("Team certificate generation error:", err);
    if (transaction) await transaction.rollback();
    throw err;
  }
};
