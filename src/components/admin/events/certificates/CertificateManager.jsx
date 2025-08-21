// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Upload, Eye, Check, AlertCircle, Trophy, CheckCircle, Ban } from 'lucide-react';
// import { useCertificates } from '../../../../lib/hooks/useCertificates';
// import CertificatePreview from './CertificatePreview';
// import { cn } from '../../../../lib/utils';
// import LoadingSpinner from '../../../shared/LoadingSpinner';
// import toast from 'react-hot-toast';

// export default function CertificateManager() {
//   const { eventId, subEventId } = useParams();
//   const { generateCertificates, loading, eligibleStudents, meritStudents, certificateStatus } = useCertificates(
//     parseInt(eventId), 
//     parseInt(subEventId)
//   );
//   const [activeTemplate, setActiveTemplate] = useState('participation');
//   const [showPreview, setShowPreview] = useState(false);
//   const [templates, setTemplates] = useState({
//     participation: {
//       file: null,
//       preview: null,
//       positions: null,
//       dimensions: null
//     },
//     merit: {
//       file: null,
//       preview: null,
//       positions: null,
//       dimensions: null
//     }
//   });

//   const handleTemplateUpload = (e, type) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
//       toast.error('Please upload a JPEG or PNG image');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = () => {
//       // Create an image to get dimensions
//       const img = new Image();
//       img.onload = () => {
//         setTemplates(prev => ({
//           ...prev,
//           [type]: {
//             ...prev[type],
//             file: file,
//             preview: reader.result,
//             dimensions: {
//               width: img.naturalWidth,
//               height: img.naturalHeight
//             }
//           }
//         }));
//       };
//       img.src = reader.result;
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleGenerate = async () => {
//     const template = templates[activeTemplate];
//     if (!template.file || !template.positions || !template.dimensions) {
//       toast.error('Please complete template setup first');
//       return;
//     }

//     const students = activeTemplate === 'merit' ? meritStudents : eligibleStudents;
//     if (students.length === 0) {
//       toast.error(`No ${activeTemplate === 'merit' ? 'merit' : 'eligible'} students found`);
//       return;
//     }

//     const formData = new FormData();
//     formData.append('templateType', activeTemplate);
//     formData.append('pdfFileInput', template.file);
//     formData.append('event_id', eventId);
//     formData.append('subevent_id', subEventId);
//     formData.append('imageWidth', template.dimensions.width);
//     formData.append('imageHeight', template.dimensions.height);
    
//     // Add positions with original image coordinates
//     Object.entries(template.positions).forEach(([key, value]) => {
//       formData.append(`${key}X`, value.x);
//       formData.append(`${key}Y`, value.y);
//     });

//     try {
//       await generateCertificates(formData);
//       toast.success('Certificates generated successfully');
//     } catch (error) {
//       toast.error('Failed to generate certificates');
//     }
//   };

//   const handleUpdatePositions = (newPositions) => {
//     setTemplates(prev => ({
//       ...prev,
//       [activeTemplate]: {
//         ...prev[activeTemplate],
//         positions: newPositions
//       }
//     }));
//     setShowPreview(false);
//   };

//   const isTemplateGenerated = (type) => certificateStatus[type];
//   const isCurrentTemplateGenerated = isTemplateGenerated(activeTemplate);
//   const canGenerate = !isCurrentTemplateGenerated && 
//                      templates[activeTemplate].file && 
//                      templates[activeTemplate].positions;

//   const getCertificateStatusMessage = () => {
//     const { participation, merit } = certificateStatus;
    
//     if (participation && merit) {
//       return {
//         type: 'success',
//         message: 'Both participation and merit certificates have been generated successfully.',
//         icon: CheckCircle
//       };
//     } else if (participation && !merit) {
//       return {
//         type: 'warning',
//         message: 'Participation certificates have been generated. Merit certificates are pending.',
//         icon: AlertCircle
//       };
//     } else if (!participation && merit) {
//       return {
//         type: 'warning',
//         message: 'Merit certificates have been generated. Participation certificates are pending.',
//         icon: AlertCircle
//       };
//     }
//     return null;
//   };

//   const statusMessage = getCertificateStatusMessage();

//   return (
//     <div className="min-h-screen from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-4 md:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
//         {/* Header */}
//         <div className="text-center mb-8 animate-fade-in">
//           <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
//             Certificate Manager
//           </h1>
//           <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base">
//             Generate professional certificates with ease
//           </p>
//         </div>

//         {/* Template Selection Buttons */}
//         <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
//           <button
//             onClick={() => setActiveTemplate('participation')}
//             className={cn(
//               "group relative overflow-hidden rounded-2xl px-6 py-4 text-sm md:text-base font-semibold transition-all duration-500 transform hover:scale-105 flex-1",
//               "shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20",
//               activeTemplate === 'participation' 
//                 ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-blue-500/30' 
//                 : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-white/90 dark:hover:bg-slate-700/90',
//               isTemplateGenerated('participation') && "opacity-75 cursor-not-allowed"
//             )}
//             disabled={isTemplateGenerated('participation')}
//           >
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//             <div className="relative flex items-center justify-center space-x-2">
//               <Check className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:rotate-12" />
//               <span>Participation Certificates</span>
//               {isTemplateGenerated('participation') && (
//                 <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-400 animate-pulse" />
//               )}
//             </div>
//             <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
//           </button>
          
//           <button
//             onClick={() => setActiveTemplate('merit')}
//             className={cn(
//               "group relative overflow-hidden rounded-2xl px-6 py-4 text-sm md:text-base font-semibold transition-all duration-500 transform hover:scale-105 flex-1",
//               "shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20",
//               activeTemplate === 'merit' 
//                 ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-amber-500/30' 
//                 : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-white/90 dark:hover:bg-slate-700/90',
//               isTemplateGenerated('merit') && "opacity-75 cursor-not-allowed"
//             )}
//             disabled={isTemplateGenerated('merit')}
//           >
//             <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//             <div className="relative flex items-center justify-center space-x-2">
//               <Trophy className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:rotate-12" />
//               <span>Merit Certificates</span>
//               {isTemplateGenerated('merit') && (
//                 <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-400 animate-pulse" />
//               )}
//             </div>
//             <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-400 to-red-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
//           </button>
//         </div>

//         {/* Certificate Status Message */}
//         {statusMessage && (
//           <div className={cn(
//             "rounded-2xl p-4 md:p-6 backdrop-blur-sm border transition-all duration-500 animate-slide-down",
//             "shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
//             statusMessage.type === 'success' 
//               ? "bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-green-900/20 border-green-200 dark:border-green-700/50"
//               : "bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-amber-900/20 border-amber-200 dark:border-amber-700/50"
//           )}>
//             <div className="flex items-start space-x-3">
//               <div className={cn(
//                 "flex-shrink-0 p-2 rounded-full",
//                 statusMessage.type === 'success' 
//                   ? "bg-green-100 dark:bg-green-800/30" 
//                   : "bg-amber-100 dark:bg-amber-800/30"
//               )}>
//                 <statusMessage.icon className={cn(
//                   "h-5 w-5 md:h-6 md:w-6",
//                   statusMessage.type === 'success' ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
//                 )} />
//               </div>
//               <p className={cn(
//                 "text-sm md:text-base leading-relaxed",
//                 statusMessage.type === 'success' 
//                   ? "text-green-800 dark:text-green-200"
//                   : "text-amber-800 dark:text-amber-200"
//               )}>
//                 {statusMessage.message}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Current Template Status */}
//         {isCurrentTemplateGenerated && (
//           <div className="bg-gradient-to-r from-slate-100 via-gray-100 to-slate-100 dark:from-slate-800/50 dark:via-gray-800/50 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 md:p-6 backdrop-blur-sm shadow-lg animate-slide-down">
//             <div className="flex items-start space-x-3">
//               <div className="flex-shrink-0 p-2 rounded-full bg-slate-200 dark:bg-slate-700">
//                 <Ban className="h-5 w-5 md:h-6 md:w-6 text-slate-600 dark:text-slate-400" />
//               </div>
//               <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
//                 {activeTemplate === 'merit' ? 'Merit' : 'Participation'} certificates have already been generated for this event.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Student Count Info */}
//         <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-700/50 rounded-2xl p-4 md:p-6 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300">
//           <div className="flex items-start space-x-3">
//             <div className="flex-shrink-0 p-2 rounded-full bg-blue-100 dark:bg-blue-800/30">
//               <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
//             </div>
//             <div>
//               <p className="text-blue-800 dark:text-blue-200 text-sm md:text-base font-medium leading-relaxed">
//                 {activeTemplate === 'merit' ? (
//                   `${meritStudents.length} students eligible for merit certificates`
//                 ) : (
//                   `${eligibleStudents.length} students eligible for participation certificates`
//                 )}
//               </p>
//               <p className="text-blue-600 dark:text-blue-300 text-xs md:text-sm mt-1">
//                 Ready to generate high-quality certificates
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Template Upload Card */}
//         <div className={cn(
//           "bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-3xl transform hover:scale-[1.01]",
//           isCurrentTemplateGenerated && "opacity-50 pointer-events-none grayscale"
//         )}>
//           <div className="p-6 md:p-8">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 space-y-4 sm:space-y-0">
//               <div className="space-y-2">
//                 <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
//                   Template Upload
//                 </h3>
//                 <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
//                   Upload a professional template for {activeTemplate} certificates
//                 </p>
//               </div>
//               {templates[activeTemplate].file && (
//                 <button
//                   onClick={() => setShowPreview(true)}
//                   className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={isCurrentTemplateGenerated}
//                 >
//                   <div className="flex items-center space-x-2">
//                     <Eye className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:scale-110" />
//                     <span className="text-sm md:text-base">Preview & Position</span>
//                   </div>
//                 </button>
//               )}
//             </div>

//             <div className="relative">
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-2xl blur-xl"></div>
//               <label className="relative block w-full group cursor-pointer">
//                 <div className={cn(
//                   "relative flex flex-col items-center justify-center px-6 py-12 md:py-16 bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-800",
//                   "border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl",
//                   "transition-all duration-500 group-hover:border-blue-400 dark:group-hover:border-blue-500",
//                   "group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-indigo-50 dark:group-hover:from-blue-900/20 dark:group-hover:to-indigo-900/20",
//                   templates[activeTemplate].file && "border-solid border-green-400 dark:border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
//                 )}>
//                   <div className={cn(
//                     "flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-300",
//                     templates[activeTemplate].file 
//                       ? "bg-green-100 dark:bg-green-800/30" 
//                       : "bg-slate-100 dark:bg-slate-600 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30"
//                   )}>
//                     {templates[activeTemplate].file ? (
//                       <CheckCircle className="h-8 w-8 md:h-10 md:w-10 text-green-600 dark:text-green-400 animate-pulse" />
//                     ) : (
//                       <Upload className="h-8 w-8 md:h-10 md:w-10 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 group-hover:scale-110" />
//                     )}
//                   </div>
//                   <div className="mt-4 text-center space-y-2">
//                     <span className={cn(
//                       "block text-base md:text-lg font-semibold transition-colors duration-300",
//                       templates[activeTemplate].file 
//                         ? "text-green-700 dark:text-green-300" 
//                         : "text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
//                     )}>
//                       {templates[activeTemplate].file ? 
//                         'Template uploaded successfully!' : 
//                         'Click to upload template'
//                       }
//                     </span>
//                     <span className="block text-sm text-slate-500 dark:text-slate-400">
//                       {templates[activeTemplate].file ? 
//                         templates[activeTemplate].file.name : 
//                         'Supports JPEG and PNG formats'
//                       }
//                     </span>
//                   </div>
//                 </div>
//                 <input
//                   type="file"
//                   className="hidden"
//                   accept="image/jpeg,image/png"
//                   onChange={(e) => handleTemplateUpload(e, activeTemplate)}
//                   disabled={isCurrentTemplateGenerated}
//                 />
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Preview Modal */}
//         {showPreview && (
//           <CertificatePreview
//             template={templates[activeTemplate]}
//             onClose={() => setShowPreview(false)}
//             onUpdatePositions={handleUpdatePositions}
//             type={activeTemplate}
//           />
//         )}

//         {/* Generate Button */}
//         <button
//           onClick={handleGenerate}
//           disabled={!canGenerate || loading}
//           className={cn(
//             "group relative w-full overflow-hidden rounded-2xl px-8 py-4 md:py-6 text-base md:text-lg font-bold transition-all duration-500 transform hover:scale-[1.02] shadow-2xl",
//             "disabled:cursor-not-allowed disabled:transform-none",
//             isCurrentTemplateGenerated 
//               ? "bg-gradient-to-r from-slate-400 to-slate-500 text-slate-200 shadow-slate-400/30" 
//               : canGenerate
//                 ? "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50"
//                 : "bg-gradient-to-r from-slate-400 to-slate-500 text-slate-300 shadow-slate-400/30"
//           )}
//         >
//           <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300"></div>
//           <div className="relative flex items-center justify-center space-x-2 md:space-x-3">
//             {loading ? (
//               <>
//                 <LoadingSpinner className="h-5 w-5 md:h-6 md:w-6" />
//                 <span>Generating Certificates...</span>
//               </>
//             ) : isCurrentTemplateGenerated ? (
//               <>
//                 <CheckCircle className="h-5 w-5 md:h-6 md:w-6" />
//                 <span>{activeTemplate === 'merit' ? 'Merit' : 'Participation'} Certificates Already Generated</span>
//               </>
//             ) : (
//               <>
//                 <Check className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:scale-110 group-disabled:scale-100" />
//                 <span>Generate {activeTemplate === 'merit' ? 'Merit' : 'Participation'} Certificates</span>
//               </>
//             )}
//           </div>
//           <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-white/40 to-white/20 transform scale-x-0 group-hover:scale-x-100 group-disabled:scale-x-0 transition-transform duration-500 origin-left"></div>
//         </button>
//       </div>
      
//       <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(-20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes slide-down {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-fade-in {
//           animation: fade-in 0.6s ease-out;
//         }
        
//         .animate-slide-down {
//           animation: slide-down 0.4s ease-out;
//         }
        
//         .shadow-3xl {
//           box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
//         }
//       `}</style>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Upload, Eye, Check, AlertCircle, Trophy, CheckCircle, Ban } from 'lucide-react';
import { useCertificates } from '../../../../lib/hooks/useCertificates';
import CertificatePreview from './CertificatePreview';
import { cn } from '../../../../lib/utils';
import LoadingSpinner from '../../../shared/LoadingSpinner';
import toast from 'react-hot-toast';
import api from '../../../../lib/api';

export default function CertificateManager() {
  const { eventId, subEventId } = useParams();
  const { generateCertificates, loading, eligibleStudents, meritStudents, certificateStatus } = useCertificates(
    parseInt(eventId), 
    parseInt(subEventId)
  );
  const [activeTemplate, setActiveTemplate] = useState('participation');
  const [showPreview, setShowPreview] = useState(false);
  const [isTeamEvent, setIsTeamEvent] = useState(false);
  const [templates, setTemplates] = useState({
    participation: {
      file: null,
      preview: null,
      positions: null,
      dimensions: null
    },
    merit: {
      file: null,
      preview: null,
      positions: null,
      dimensions: null
    }
  });

  // Check if this is a team event
  React.useEffect(() => {
    const checkEventType = async () => {
      try {
        const response = await api.get(`/subevents/${eventId}`);
        const subevent = response.data.subevents.find(se => se.id === parseInt(subEventId));
        setIsTeamEvent(subevent?.is_team_event || false);
      } catch (error) {
        console.error('Failed to check event type:', error);
      }
    };
    checkEventType();
  }, [eventId, subEventId]);

  const handleTemplateUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      toast.error('Please upload a JPEG or PNG image');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // Create an image to get dimensions
      const img = new Image();
      img.onload = () => {
        setTemplates(prev => ({
          ...prev,
          [type]: {
            ...prev[type],
            file: file,
            preview: reader.result,
            dimensions: {
              width: img.naturalWidth,
              height: img.naturalHeight
            }
          }
        }));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    const template = templates[activeTemplate];
    if (!template.file || !template.positions || !template.dimensions) {
      toast.error('Please complete template setup first');
      return;
    }

    const students = activeTemplate === 'merit' ? meritStudents : eligibleStudents;
    if (students.length === 0) {
      toast.error(`No ${activeTemplate === 'merit' ? 'merit' : 'eligible'} students found`);
      return;
    }

    const formData = new FormData();
    formData.append('templateType', activeTemplate);
    formData.append('pdfFileInput', template.file);
    formData.append('event_id', eventId);
    formData.append('subevent_id', subEventId);
    formData.append('imageWidth', template.dimensions.width);
    formData.append('imageHeight', template.dimensions.height);
    formData.append('is_team_event', isTeamEvent);
    
    // Add positions with original image coordinates
    Object.entries(template.positions).forEach(([key, value]) => {
      formData.append(`${key}X`, value.x);
      formData.append(`${key}Y`, value.y);
    });

    try {
      await generateCertificates(formData);
      toast.success('Certificates generated successfully');
    } catch (error) {
      toast.error('Failed to generate certificates');
    }
  };

  const handleUpdatePositions = (newPositions) => {
    setTemplates(prev => ({
      ...prev,
      [activeTemplate]: {
        ...prev[activeTemplate],
        positions: newPositions
      }
    }));
    setShowPreview(false);
  };

  const isTemplateGenerated = (type) => certificateStatus[type];
  const isCurrentTemplateGenerated = isTemplateGenerated(activeTemplate);
  const canGenerate = !isCurrentTemplateGenerated && 
                     templates[activeTemplate].file && 
                     templates[activeTemplate].positions;

  const getCertificateStatusMessage = () => {
    const { participation, merit } = certificateStatus;
    
    if (participation && merit) {
      return {
        type: 'success',
        message: 'Both participation and merit certificates have been generated successfully.',
        icon: CheckCircle
      };
    } else if (participation && !merit) {
      return {
        type: 'warning',
        message: 'Participation certificates have been generated. Merit certificates are pending.',
        icon: AlertCircle
      };
    } else if (!participation && merit) {
      return {
        type: 'warning',
        message: 'Merit certificates have been generated. Participation certificates are pending.',
        icon: AlertCircle
      };
    }
    return null;
  };

  const statusMessage = getCertificateStatusMessage();

  return (
    <div className="min-h-screen from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Certificate Manager
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base">
            Generate professional certificates with ease
          </p>
        </div>

        {/* Template Selection Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
          <button
            onClick={() => setActiveTemplate('participation')}
            className={cn(
              "group relative overflow-hidden rounded-2xl px-6 py-4 text-sm md:text-base font-semibold transition-all duration-500 transform hover:scale-105 flex-1",
              "shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20",
              activeTemplate === 'participation' 
                ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-blue-500/30' 
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-white/90 dark:hover:bg-slate-700/90',
              isTemplateGenerated('participation') && "opacity-75 cursor-not-allowed"
            )}
            disabled={isTemplateGenerated('participation')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center space-x-2">
              <Check className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:rotate-12" />
              <span>Participation Certificates</span>
              {isTemplateGenerated('participation') && (
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-400 animate-pulse" />
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
          
          <button
            onClick={() => setActiveTemplate('merit')}
            className={cn(
              "group relative overflow-hidden rounded-2xl px-6 py-4 text-sm md:text-base font-semibold transition-all duration-500 transform hover:scale-105 flex-1",
              "shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20",
              activeTemplate === 'merit' 
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-amber-500/30' 
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-white/90 dark:hover:bg-slate-700/90',
              isTemplateGenerated('merit') && "opacity-75 cursor-not-allowed"
            )}
            disabled={isTemplateGenerated('merit')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center space-x-2">
              <Trophy className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:rotate-12" />
              <span>Merit Certificates</span>
              {isTemplateGenerated('merit') && (
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-400 animate-pulse" />
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-400 to-red-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>

        {/* Certificate Status Message */}
        {statusMessage && (
          <div className={cn(
            "rounded-2xl p-4 md:p-6 backdrop-blur-sm border transition-all duration-500 animate-slide-down",
            "shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
            statusMessage.type === 'success' 
              ? "bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-green-900/20 border-green-200 dark:border-green-700/50"
              : "bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-amber-900/20 border-amber-200 dark:border-amber-700/50"
          )}>
            <div className="flex items-start space-x-3">
              <div className={cn(
                "flex-shrink-0 p-2 rounded-full",
                statusMessage.type === 'success' 
                  ? "bg-green-100 dark:bg-green-800/30" 
                  : "bg-amber-100 dark:bg-amber-800/30"
              )}>
                <statusMessage.icon className={cn(
                  "h-5 w-5 md:h-6 md:w-6",
                  statusMessage.type === 'success' ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                )} />
              </div>
              <p className={cn(
                "text-sm md:text-base leading-relaxed",
                statusMessage.type === 'success' 
                  ? "text-green-800 dark:text-green-200"
                  : "text-amber-800 dark:text-amber-200"
              )}>
                {statusMessage.message}
              </p>
            </div>
          </div>
        )}

        {/* Current Template Status */}
        {isCurrentTemplateGenerated && (
          <div className="bg-gradient-to-r from-slate-100 via-gray-100 to-slate-100 dark:from-slate-800/50 dark:via-gray-800/50 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 md:p-6 backdrop-blur-sm shadow-lg animate-slide-down">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 p-2 rounded-full bg-slate-200 dark:bg-slate-700">
                <Ban className="h-5 w-5 md:h-6 md:w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                {activeTemplate === 'merit' ? 'Merit' : 'Participation'} certificates have already been generated for this event.
              </p>
            </div>
          </div>
        )}

        {/* Student Count Info */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-700/50 rounded-2xl p-4 md:p-6 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 p-2 rounded-full bg-blue-100 dark:bg-blue-800/30">
              <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-blue-800 dark:text-blue-200 text-sm md:text-base font-medium leading-relaxed">
                {activeTemplate === 'merit' ? (
                  `${meritStudents.length} students eligible for merit certificates`
                ) : (
                  `${eligibleStudents.length} students eligible for participation certificates`
                )}
              </p>
              <p className="text-blue-600 dark:text-blue-300 text-xs md:text-sm mt-1">
                Ready to generate high-quality certificates
              </p>
            </div>
          </div>
        </div>

        {/* Template Upload Card */}
        <div className={cn(
          "bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-3xl transform hover:scale-[1.01]",
          isCurrentTemplateGenerated && "opacity-50 pointer-events-none grayscale"
        )}>
          <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 space-y-4 sm:space-y-0">
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Template Upload
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
                  Upload a professional template for {activeTemplate} certificates
                </p>
              </div>
              {templates[activeTemplate].file && (
                <button
                  onClick={() => setShowPreview(true)}
                  className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isCurrentTemplateGenerated}
                >
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:scale-110" />
                    <span className="text-sm md:text-base">Preview & Position</span>
                  </div>
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-2xl blur-xl"></div>
              <label className="relative block w-full group cursor-pointer">
                <div className={cn(
                  "relative flex flex-col items-center justify-center px-6 py-12 md:py-16 bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-800",
                  "border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl",
                  "transition-all duration-500 group-hover:border-blue-400 dark:group-hover:border-blue-500",
                  "group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-indigo-50 dark:group-hover:from-blue-900/20 dark:group-hover:to-indigo-900/20",
                  templates[activeTemplate].file && "border-solid border-green-400 dark:border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                )}>
                  <div className={cn(
                    "flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-300",
                    templates[activeTemplate].file 
                      ? "bg-green-100 dark:bg-green-800/30" 
                      : "bg-slate-100 dark:bg-slate-600 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30"
                  )}>
                    {templates[activeTemplate].file ? (
                      <CheckCircle className="h-8 w-8 md:h-10 md:w-10 text-green-600 dark:text-green-400 animate-pulse" />
                    ) : (
                      <Upload className="h-8 w-8 md:h-10 md:w-10 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 group-hover:scale-110" />
                    )}
                  </div>
                  <div className="mt-4 text-center space-y-2">
                    <span className={cn(
                      "block text-base md:text-lg font-semibold transition-colors duration-300",
                      templates[activeTemplate].file 
                        ? "text-green-700 dark:text-green-300" 
                        : "text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    )}>
                      {templates[activeTemplate].file ? 
                        'Template uploaded successfully!' : 
                        'Click to upload template'
                      }
                    </span>
                    <span className="block text-sm text-slate-500 dark:text-slate-400">
                      {templates[activeTemplate].file ? 
                        templates[activeTemplate].file.name : 
                        'Supports JPEG and PNG formats'
                      }
                    </span>
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png"
                  onChange={(e) => handleTemplateUpload(e, activeTemplate)}
                  disabled={isCurrentTemplateGenerated}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <CertificatePreview
            template={templates[activeTemplate]}
            onClose={() => setShowPreview(false)}
            onUpdatePositions={handleUpdatePositions}
            type={activeTemplate}
          />
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate || loading}
          className={cn(
            "group relative w-full overflow-hidden rounded-2xl px-8 py-4 md:py-6 text-base md:text-lg font-bold transition-all duration-500 transform hover:scale-[1.02] shadow-2xl",
            "disabled:cursor-not-allowed disabled:transform-none",
            isCurrentTemplateGenerated 
              ? "bg-gradient-to-r from-slate-400 to-slate-500 text-slate-200 shadow-slate-400/30" 
              : canGenerate
                ? "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50"
                : "bg-gradient-to-r from-slate-400 to-slate-500 text-slate-300 shadow-slate-400/30"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-center space-x-2 md:space-x-3">
            {loading ? (
              <>
                <LoadingSpinner className="h-5 w-5 md:h-6 md:w-6" />
                <span>Generating Certificates...</span>
              </>
            ) : isCurrentTemplateGenerated ? (
              <>
                <CheckCircle className="h-5 w-5 md:h-6 md:w-6" />
                <span>{activeTemplate === 'merit' ? 'Merit' : 'Participation'} Certificates Already Generated</span>
              </>
            ) : (
              <>
                <Check className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:scale-110 group-disabled:scale-100" />
                <span>Generate {activeTemplate === 'merit' ? 'Merit' : 'Participation'} Certificates</span>
              </>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-white/40 to-white/20 transform scale-x-0 group-hover:scale-x-100 group-disabled:scale-x-0 transition-transform duration-500 origin-left"></div>
        </button>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}
