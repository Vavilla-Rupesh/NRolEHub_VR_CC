// const Leaderboard = require('./leaderboard.model');
// const User = require('../auth/auth.model');
// const { sequelize } = require('../../config/dataBase');

// exports.getLeaderboardByEvent = async (eventId) => {
//   try {
//     const leaderboard = await Leaderboard.findAll({
//       where: { event_id: eventId },
//       include: [{
//         model: User,
//         as: 'student',
//         attributes: ['username', 'email']
//       }],
//       order: [['score', 'DESC']]
//     });

//     // Calculate ranks
//     let currentRank = 1;
//     let currentScore = null;
//     let offset = 0;

//     const rankedLeaderboard = leaderboard.map((entry, index) => {
//       if (entry.score !== currentScore) {
//         currentRank = index + 1;
//         currentScore = entry.score;
//         offset = 0;
//       } else {
//         offset++;
//       }

//       return {
//         id: entry.id,
//         event_id: entry.event_id,
//         subevent_id: entry.subevent_id,
//         student_id: entry.student_id,
//         student_name: entry.student?.username,
//         student_email: entry.student?.email,
//         score: entry.score,
//         rank: currentRank,
//         created_at: entry.created_at
//       };
//     });

//     return rankedLeaderboard;
//   } catch (error) {
//     console.error('Error fetching leaderboard:', error);
//     throw new Error('Failed to fetch leaderboard');
//   }
// };

// exports.declareWinners = async (eventId, subEventId, winners) => {
//   const transaction = await sequelize.transaction();

//   try {
//     // Validate winners data
//     if (!Array.isArray(winners) || winners.length === 0) {
//       throw new Error('Invalid winners data');
//     }

//     // Clear existing leaderboard entries for this specific event AND subevent
//     await Leaderboard.destroy({
//       where: {
//         event_id: eventId,
//         subevent_id: subEventId // This ensures we only clear entries for this specific subevent
//       },
//       transaction
//     });

//     // Create new leaderboard entries with the specific subevent_id
//     const leaderboardEntries = winners.map((winner, index) => ({
//       event_id: eventId,
//       subevent_id: subEventId, // Ensure subevent_id is included
//       student_id: winner.student_id,
//       score: winner.score,
//       rank: index + 1
//     }));

//     await Leaderboard.bulkCreate(leaderboardEntries, { transaction });
//     await transaction.commit();

//     // Return only the leaderboard for this specific subevent
//     const updatedLeaderboard = await Leaderboard.findAll({
//       where: {
//         event_id: eventId,
//         subevent_id: subEventId
//       },
//       include: [{
//         model: User,
//         as: 'student',
//         attributes: ['username', 'email']
//       }],
//       order: [['score', 'DESC']]
//     });

//     return updatedLeaderboard.map(entry => ({
//       id: entry.id,
//       event_id: entry.event_id,
//       subevent_id: entry.subevent_id,
//       student_id: entry.student_id,
//       student_name: entry.student?.username,
//       student_email: entry.student?.email,
//       score: entry.score,
//       rank: entry.rank,
//       created_at: entry.created_at
//     }));
//   } catch (error) {
//     await transaction.rollback();
//     console.error('Error declaring winners:', error);
//     throw new Error('Failed to declare winners');
//   }
// };

// const Leaderboard = require("./leaderboard.model");
// const User = require("../auth/auth.model");
// const { sequelize } = require("../../config/dataBase");

// exports.getLeaderboardByEvent = async (eventId) => {
//   try {
//     const leaderboard = await Leaderboard.findAll({
//       where: { event_id: eventId },
//       include: [
//         {
//           model: User,
//           as: "student",
//           attributes: ["username", "email"],
//         },
//       ],
//       order: [["score", "DESC"]],
//     });

//     // Calculate ranks
//     // Calculate ranks using dense ranking
//     let currentRank = 1;
//     let currentScore = null;

//     const rankedLeaderboard = [];
//     for (let i = 0; i < leaderboard.length; i++) {
//       const entry = leaderboard[i];
//       if (entry.score !== currentScore) {
//         currentScore = entry.score;
//         console.log("Current Score: ",currentScore,"Current Rank Before: ",currentRank);
//         currentRank = rankedLeaderboard.length + 1; // Dense ranking
//       }
//       console.log("Current Score: ",currentScore,"Current Rank After: ",currentRank);

//       rankedLeaderboard.push({
//         id: entry.id,
//         event_id: entry.event_id,
//         subevent_id: entry.subevent_id,
//         student_id: entry.student_id,
//         student_name: entry.student?.username,
//         student_email: entry.student?.email,
//         score: entry.score,
//         rank: currentRank,
//         created_at: entry.created_at,
//       });
//     }

//     return rankedLeaderboard;
//   } catch (error) {
//     console.error("Error fetching leaderboard:", error);
//     throw new Error("Failed to fetch leaderboard");
//   }
// };

// exports.declareWinners = async (eventId, subEventId, winners) => {
//   const transaction = await sequelize.transaction();

//   try {
//     // Validate winners data
//     if (!Array.isArray(winners) || winners.length === 0) {
//       throw new Error("Invalid winners data");
//     }

//     // Clear existing leaderboard entries for this specific event AND subevent
//     await Leaderboard.destroy({
//       where: {
//         event_id: eventId,
//         subevent_id: subEventId, // This ensures we only clear entries for this specific subevent
//       },
//       transaction,
//     });

//     // Create new leaderboard entries with the specific subevent_id
//     // Each winner gets their assigned rank (no automatic ranking calculation)

//     const leaderboardEntries = winners.map((winner, index) => ({
//       event_id: eventId,

//       subevent_id: subEventId, // Ensure subevent_id is included

//       student_id: winner.student_id,

//       score: winner.score,

//       rank: winner.position || index + 1, // Use provided position or fallback to index + 1
//     }));

//     await Leaderboard.bulkCreate(leaderboardEntries, { transaction });
//     await transaction.commit();

//     // Return only the leaderboard for this specific subevent
//     const updatedLeaderboard = await Leaderboard.findAll({
//       where: {
//         event_id: eventId,
//         subevent_id: subEventId,
//       },
//       include: [
//         {
//           model: User,
//           as: "student",
//           attributes: ["username", "email"],
//         },
//       ],
//       order: [["score", "DESC"]],
//     });

//     return updatedLeaderboard.map((entry) => ({
//       id: entry.id,
//       event_id: entry.event_id,
//       subevent_id: entry.subevent_id,
//       student_id: entry.student_id,
//       student_name: entry.student?.username,
//       student_email: entry.student?.email,
//       score: entry.score,
//       rank: entry.rank,
//       created_at: entry.created_at,
//     }));
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error declaring winners:", error);
//     throw new Error("Failed to declare winners");
//   }
// };
const Leaderboard = require("./leaderboard.model");
const User = require("../auth/auth.model");
const { sequelize } = require("../../config/dataBase");

exports.getLeaderboardByEvent = async (eventId) => {
  try {
    const leaderboard = await Leaderboard.findAll({
      where: { event_id: eventId },
      include: [
        {
          model: User,
          as: "student",
          attributes: ["username", "email"],
        },
      ],
      order: [["rank", "ASC"], ["score", "DESC"]], // Order by rank first, then score
    });

    // Use the rank stored in the database for both individual and team events
    const rankedLeaderboard = leaderboard.map(entry => ({
      id: entry.id,
      event_id: entry.event_id,
      subevent_id: entry.subevent_id,
      student_id: entry.student_id,
      student_name: entry.student?.username,
      student_email: entry.student?.email,
      score: entry.score,
      rank: entry.rank, // Always use the rank from database
      created_at: entry.created_at,
    }));

    return rankedLeaderboard;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw new Error("Failed to fetch leaderboard");
  }
};



exports.declareWinners = async (eventId, subEventId, winners) => {
  const transaction = await sequelize.transaction();

  try {
    // Validate winners data
    if (!Array.isArray(winners) || winners.length === 0) {
      throw new Error("Invalid winners data");
    }

    // Clear existing leaderboard entries for this specific event AND subevent
    await Leaderboard.destroy({
      where: {
        event_id: eventId,
        subevent_id: subEventId,
      },
      transaction,
    });

    // Create new leaderboard entries with the specific subevent_id
    const leaderboardEntries = winners.map((winner, index) => ({
      event_id: eventId,
      subevent_id: subEventId,
      student_id: winner.student_id,
      score: winner.score,
      rank: winner.position || winner.rank || index + 1, // Use provided position/rank or fallback
    }));

    await Leaderboard.bulkCreate(leaderboardEntries, { transaction });
    await transaction.commit();

    // Return only the leaderboard for this specific subevent
    const updatedLeaderboard = await Leaderboard.findAll({
      where: {
        event_id: eventId,
        subevent_id: subEventId,
      },
      include: [
        {
          model: User,
          as: "student",
          attributes: ["username", "email"],
        },
      ],
      order: [["rank", "ASC"], ["score", "DESC"]], // Order by rank first
    });

    return updatedLeaderboard.map((entry) => ({
      id: entry.id,
      event_id: entry.event_id,
      subevent_id: entry.subevent_id,
      student_id: entry.student_id,
      student_name: entry.student?.username,
      student_email: entry.student?.email,
      score: entry.score,
      rank: entry.rank, // Use the stored rank
      created_at: entry.created_at,
    }));
  } catch (error) {
    await transaction.rollback();
    console.error("Error declaring winners:", error);
    throw new Error("Failed to declare winners");
  }
};
