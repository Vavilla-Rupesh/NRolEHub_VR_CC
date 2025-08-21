// const sharp = require('sharp');

// async function overlayTextOnImage(imageBuffer, name, eventName, certificateDate, coordinates, certificateId, rank = null, teamName = null, studentDetails = null) {
//   try {
//     if (!Buffer.isBuffer(imageBuffer)) {
//       throw new Error('Invalid image buffer provided');
//     }

//     // Get image dimensions
//     const metadata = await sharp(imageBuffer).metadata();
//     const { width, height } = metadata;

//     // Convert year and semester to Roman numerals
//     const toRoman = (num) => {
//       const romanNumerals = {
//         1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
//         6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X'
//       };
//       return romanNumerals[num] || num.toString();
//     };

//     // Create SVG with exact dimensions
//     const svgText = `
//       <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
//         <style>
//           .text { 
//             font-family: Arial; 
//             fill: black; 
//             dominant-baseline: middle;
//             text-anchor: middle;
//           }
//           .name { font-size: 48px; font-weight: bold; }
//           .event { font-size: 36px; }
//           .date, .college, .stream { font-size: 24px; }
//           .id { font-size: 16px; font-family: monospace; }
//           .rank { font-size: 36px; font-weight: bold; fill: #4F46E5; }
//           .details { font-size: 18px; }
//           .team { font-size: 24px; font-weight: bold; }
//         </style>
//         ${Object.entries(coordinates).map(([key, value]) => {
//           if (!value) return '';
          
//           let className = '';
//           let text = '';
          
//           switch (key) {
//             case 'name':
//               className = 'name';
//               text = name;
//               break;
//             case 'event':
//               className = 'event';
//               text = eventName;
//               break;
//             case 'date':
//               className = 'date';
//               text = certificateDate;
//               break;
//             case 'certificateId':
//               className = 'id';
//               text = certificateId;
//               break;
//             case 'rank':
//               if (rank) {
//                 className = 'rank';
//                 text = rank;
//               }
//               break;
//             case 'teamName':
//               if (teamName) {
//                 className = 'team';
//                 text = teamName;
//               }
//               break;
//             case 'rollNumber':
//               if (studentDetails?.rollNumber) {
//                 className = 'details';
//                 text = studentDetails.rollNumber;
//               }
//               break;
//             case 'year':
//               if (studentDetails?.year) {
//                 className = 'details';
//                 text = toRoman(studentDetails.year)
//               }
//               break;
//               case 'sem':
//                 if (studentDetails?.semester) {
//                   className = 'details';
//                   text = toRoman(studentDetails.semester);
//                 }
//                 break;
//                 case 'stream':
//                   if (studentDetails?.stream) {
//                     className = 'details';
//                     text = toRoman(studentDetails.stream);
//                   }
//                   break;
//             case 'college':
//               if (studentDetails?.collegeName) {
//                 className = 'details';
//                 text = studentDetails.collegeName;
//               }
//               break;
//           }

//           if (!text) return '';

//           return `
//             <text 
//               x="${value.x}" 
//               y="${value.y}" 
//               class="text ${className}"
//             >${text}</text>
//           `;
//         }).join('')}
//       </svg>
//     `;

//     // Create a buffer from the SVG
//     const svgBuffer = Buffer.from(svgText);

//     // Composite the SVG onto the image
//     const outputBuffer = await sharp(imageBuffer)
//       .composite([{
//         input: svgBuffer,
//         top: 0,
//         left: 0,
//         blend: 'over'
//       }])
//       .jpeg({ quality: 90 })
//       .toBuffer();

//     return outputBuffer;
//   } catch (error) {
//     console.error('Error in overlayTextOnImage:', error);
//     throw error;
//   }
// }

// module.exports = overlayTextOnImage;


// const sharp = require('sharp');

// async function overlayTextOnImage(imageBuffer, name, eventName, certificateDate, coordinates, certificateId, rank = null, teamName = null) {
//   try {
//     if (!Buffer.isBuffer(imageBuffer)) {
//       throw new Error('Invalid image buffer provided');
//     }

//     // Get image dimensions
//     const metadata = await sharp(imageBuffer).metadata();
//     const { width, height } = metadata;

//     // Create SVG with exact dimensions
//     const svgText = `
//       <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
//         <style>
//           .text { 
//             font-family: Arial; 
//             fill: black; 
//             dominant-baseline: middle;
//             text-anchor: middle;
//           }
//           .name { font-size: 48px; font-weight: bold; }
//           .event { font-size: 36px; }
//           .date { font-size: 24px; }
//           .id { font-size: 16px; font-family: monospace; }
//           .rank { font-size: 36px; font-weight: bold; fill: #4F46E5; }
//           .teamName { font-size: 36px; font-weight: bold; fill: #000000; }
//         </style>
//         ${Object.entries(coordinates).map(([key, value]) => {
//           if (!value) return '';
          
//           let className = '';
//           let text = '';
          
//           switch (key) {
//             case 'name':
//               className = 'name';
//               text = name;
//               break;
//             case 'event':
//               className = 'event';
//               text = eventName;
//               break;
//             case 'date':
//               className = 'date';
//               text = certificateDate;
//               break;
//             case 'certificateId':
//               className = 'id';
//               text = certificateId;
//               break;
//             case 'rank':
//               if (rank) {
//                 className = 'rank';
//                 text = rank;
//               }
//               break;
//             case 'teamName':
//               if (teamName) {
//                 className = 'teamName';
//                 text = teamName;  // Adding the team name text
//               }
//               break;
//           }

//           if (!text) return '';

//           return `
//             <text 
//               x="${value.x}" 
//               y="${value.y}" 
//               class="text ${className}"
//             >${text}</text>
//           `;
//         }).join('')}
//       </svg>
//     `;

//     // Create a buffer from the SVG
//     const svgBuffer = Buffer.from(svgText);

//     // Composite the SVG onto the image
//     const outputBuffer = await sharp(imageBuffer)
//       .composite([{
//         input: svgBuffer,
//         top: 0,
//         left: 0,
//         blend: 'over'
//       }])
//       .jpeg({ quality: 90 })
//       .toBuffer();

//     return outputBuffer;
//   } catch (error) {
//     console.error('Error in overlayTextOnImage:', error);
//     throw error;
//   }
// }

// module.exports = overlayTextOnImage;
const sharp = require('sharp');

async function overlayTextOnImage(imageBuffer, name, eventName, certificateDate, coordinates, certificateId, rank = null, teamName = null, studentDetails = null) {
  try {
    if (!Buffer.isBuffer(imageBuffer)) {
      throw new Error('Invalid image buffer provided');
    }

    // Get image dimensions
    const metadata = await sharp(imageBuffer).metadata();
    const { width, height } = metadata;

    // Convert year and semester to Roman numerals
    const toRoman = (num) => {
      const romanNumerals = {
        1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
        6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X'
      };
      return romanNumerals[num] || num.toString();
    };

    // Create SVG with exact dimensions
   const svgText = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <style>
          /* Base text styling */
          .text { 
            font-family: 'Times New Roman', 'Georgia', serif; 
            fill: #1a1a1a; 
            dominant-baseline: middle;
            text-anchor: middle;
            letter-spacing: 0.5px;
          }
          
          /* Participant name - most prominent */
          .name { 
            font-size: 52px; 
            font-weight: bold; 
            font-family: 'Times New Roman', 'Georgia', serif;
            fill: #2c3e50;
            letter-spacing: 1px;
          }
          
          /* Event title - secondary prominence */
          .event { 
            font-size: 38px; 
            font-weight: 600;
            font-family: 'Arial', 'Helvetica', sans-serif;
            fill: #34495e;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          
          /* Achievement/Rank - highlighted */
          .rank { 
            font-size: 42px; 
            font-weight: bold; 
            font-family: 'Arial', 'Helvetica', sans-serif;
            fill: #e74c3c;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          /* Institution details */
          .college { 
            font-size: 26px; 
            font-weight: 500;
            font-family: 'Arial', 'Helvetica', sans-serif;
            fill: #2c3e50;
            font-style: italic;
          }
          
          /* Academic stream/department */
          .stream { 
            font-size: 22px; 
            font-weight: normal;
            font-family: 'Arial', 'Helvetica', sans-serif;
            fill: #7f8c8d;
          }
          
          /* Date information */
          .date { 
            font-size: 20px; 
            font-weight: 500;
            font-family: 'Arial', 'Helvetica', sans-serif;
            fill: #2c3e50;
          }
          
          /* Team name */
          .team { 
            font-size: 28px; 
            font-weight: bold;
            font-family: 'Arial', 'Helvetica', sans-serif;
            fill: #27ae60;
            letter-spacing: 0.5px;
          }
          
          /* Certificate ID */
          .id { 
            font-size: 14px; 
            font-family: 'Courier New', monospace;
            fill: #95a5a6;
            font-weight: normal;
            letter-spacing: 1px;
          }
          
          /* Additional details */
          .details { 
            font-size: 18px; 
            font-weight: normal;
            font-family: 'Arial', 'Helvetica', sans-serif;
            fill: #34495e;
          }
        </style>
        ${Object.entries(coordinates).map(([key, value]) => {
          if (!value) return '';
          
          let className = '';
          let text = '';
          
          switch (key) {
            case 'name':
              className = 'name';
              text = name;
              break;
            case 'event':
              className = 'event';
              text = eventName;
              break;
            case 'date':
              className = 'date';
              text = certificateDate;
              break;
            case 'certificateId':
              className = 'id';
              text = certificateId;
              break;
            case 'rank':
              if (rank) {
                className = 'rank';
                text = rank;
              }
              break;
            case 'teamName':
              if (teamName) {
                className = 'team';
                text = teamName || 'Unknown Team';  // Adding the team name text with fallback
              }
              break;
            case 'rollNumber':
              if (studentDetails?.rollNumber) {
                className = 'details';
                text = studentDetails.rollNumber;
              }
              break;
            case 'year':
              if (studentDetails?.year) {
                className = 'details';
                text = toRoman(studentDetails.year)
              }
              break;
              case 'sem':
                if (studentDetails?.semester) {
                  className = 'details';
                  text = toRoman(studentDetails.semester);
                }
                break;
                case 'stream':
                  if (studentDetails?.stream) {
                    className = 'details';
                    text = toRoman(studentDetails.stream);
                  }
                  break;
            case 'college':
              if (studentDetails?.collegeName) {
                className = 'details';
                text = studentDetails.collegeName;
              }
              break;
          }

          if (!text || text === 'undefined' || text === 'null') return '';

          return `
            <text 
              x="${value.x}" 
              y="${value.y}" 
              class="text ${className}"
            >${text.toString()}</text>
          `;
        }).join('')}
      </svg>
    `;

    // Create a buffer from the SVG
    const svgBuffer = Buffer.from(svgText);

    // Composite the SVG onto the image
    const outputBuffer = await sharp(imageBuffer)
      .composite([{
        input: svgBuffer,
        top: 0,
        left: 0,
        blend: 'over'
      }])
      .jpeg({ quality: 90 })
      .toBuffer();

    return outputBuffer;
  } catch (error) {
    console.error('Error in overlayTextOnImage:', error);
    throw error;
  }
}

module.exports = overlayTextOnImage;
