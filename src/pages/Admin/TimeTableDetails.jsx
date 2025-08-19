import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import { Clock, ChevronDown, ChevronUp, Users, BookOpen } from "lucide-react";

const TimeTableDetails = () => {
   const [activeYear, setActiveYear] = useState(null);

   // Format time to more readable format (e.g., "10:00" instead of "10:00:00")
   const formatTime = (timeString) => {
      return timeString.substring(0, 5);
   };

   // Toggle year expansion
   const toggleYear = (year) => {
      setActiveYear(activeYear === year ? null : year);
   };

   // Map subject and teacher IDs to more readable names (in a real app, you'd fetch these)
   const getSubjectName = (subjectId) => {
      // This would ideally come from a lookup table or API
      const subjectMap = {
         "0bef9e52-b229-40c7-8908-02cb8f2a1414": "Mathematics",
         "19578419-532c-4bd0-82bc-a67a65464e66": "Physics",
         "045111c7-a4a5-4643-bea1-4d89bc478ac7": "Chemistry",
         "e9f2de97-ddfe-4ae3-b83d-45cac18b3c2d": "Biology",
         "de97e634-3d69-42b8-ac33-0973100e6998": "Computer Science",
         "087e7019-a7b1-44f2-b1e5-7c2760262108": "History",
         "c11f40a9-aa93-4912-b263-db5b657fdc23": "Geography",
         "945a25ef-7dc8-43af-ab0d-202187d06189": "Literature",
      };
      return subjectMap[subjectId] || "Unknown Subject";
   };

   const getTeacherName = (teacherId) => {
      // This would ideally come from a lookup table or API
      const teacherMap = {
         "b2ffa641-aec9-4b3e-aa56-cb23f1b55782": "Prof. Johnson",
         "2cadf1a4-927a-470a-8f18-4004aa669fe0": "Dr. Smith",
         "c162249b-66f3-472d-b63b-a23e7ae195a4": "Ms. Davis",
         "cfb122d0-b031-4d95-b476-e5b4b914c59b": "Mr. Wilson",
         "e1a0dc86-a37d-4766-bdf3-6abf2d078dc0": "Prof. Brown",
         "2e1679ef-9237-40cb-ad8a-8f9cd20901c9": "Dr. Miller",
         "ca461216-e508-4a05-a209-8a2237711407": "Ms. Taylor",
      };
      return teacherMap[teacherId] || "Unknown Teacher";
   };

   // Generate a color based on subject name (for consistency)
   const getSubjectColor = (subjectId) => {
      const colorMap = {
         "0bef9e52-b229-40c7-8908-02cb8f2a1414":
            "bg-blue-50 border-blue-200 text-blue-700",
         "19578419-532c-4bd0-82bc-a67a65464e66":
            "bg-purple-50 border-purple-200 text-purple-700",
         "045111c7-a4a5-4643-bea1-4d89bc478ac7":
            "bg-green-50 border-green-200 text-green-700",
         "e9f2de97-ddfe-4ae3-b83d-45cac18b3c2d":
            "bg-amber-50 border-amber-200 text-amber-700",
         "de97e634-3d69-42b8-ac33-0973100e6998":
            "bg-cyan-50 border-cyan-200 text-cyan-700",
         "087e7019-a7b1-44f2-b1e5-7c2760262108":
            "bg-red-50 border-red-200 text-red-700",
         "c11f40a9-aa93-4912-b263-db5b657fdc23":
            "bg-emerald-50 border-emerald-200 text-emerald-700",
         "945a25ef-7dc8-43af-ab0d-202187d06189":
            "bg-indigo-50 border-indigo-200 text-indigo-700",
      };
      return colorMap[subjectId] || "bg-gray-50 border-gray-200 text-gray-700";
   };

   // Sort timetables by start time
   const sortByTime = (timetables) => {
      return [...timetables].sort((a, b) => {
         return a.timeStart.localeCompare(b.timeStart);
      });
   };

   const [data, setData] = useState([]);
   const fetchTimeTableDetails = async () => {
      try {
         const response = await axios.get(
            "https://localhost:7013/api/Admin/getAllTimeTables",

            {
               withCredentials: true,
            }
         );
         console.log("🚀 ~ fetchTeachers ~ response:", response);
         setData(response.data.data);
      } catch (error) {
         console.error("Error fetching teachers:", error);
      }
   };

   useEffect(() => {
      fetchTimeTableDetails();
   }, []);

   return (
      <div className="max-w-4xl mx-auto p-4">
         <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
               Class Timetable
            </h1>
            <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium">
               {data.length} Academic Years
            </div>
         </div>

         <div className="space-y-4">
            {data.map((yearData) => (
               <div
                  key={yearData.year}
                  className="border border-gray-200 rounded-xl overflow-hidden"
               >
                  {/* Year header - clickable to expand/collapse */}
                  <button
                     onClick={() => toggleYear(yearData.year)}
                     className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                     <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-3 font-bold">
                           Y{yearData.year}
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                           Year {yearData.year}
                        </h2>
                     </div>
                     <div className="text-gray-500">
                        {activeYear === yearData.year ? (
                           <ChevronUp size={20} />
                        ) : (
                           <ChevronDown size={20} />
                        )}
                     </div>
                  </button>

                  {/* Timetable content - shown when expanded */}
                  {activeYear === yearData.year && (
                     <div className="divide-y divide-gray-100">
                        {sortByTime(yearData.timeTables).map((timeTable) => (
                           <div
                              key={timeTable.id}
                              className="p-4 hover:bg-gray-50 transition-colors"
                           >
                              <div className="flex flex-wrap items-center mb-3">
                                 {/* Time badge */}
                                 <div className="flex items-center mr-4 mb-2">
                                    <Clock
                                       size={16}
                                       className="text-gray-500 mr-1"
                                    />
                                    <span className="text-gray-700">
                                       {formatTime(timeTable.timeStart)} -{" "}
                                       {formatTime(timeTable.timeEnd)}
                                    </span>
                                 </div>

                                 {/* Subject badge */}
                                 <div
                                    className={`px-3 py-1 rounded-full text-sm font-medium border mr-4 mb-2 ${getSubjectColor(
                                       timeTable.subject
                                    )}`}
                                 >
                                    <div className="flex items-center">
                                       <BookOpen size={14} className="mr-1" />
                                       {getSubjectName(timeTable.subject)}
                                    </div>
                                 </div>
                              </div>

                              {/* Teacher info */}
                              <div className="flex items-center text-gray-600">
                                 <Users size={16} className="mr-2" />
                                 <span>
                                    {getTeacherName(timeTable.teacher)}
                                 </span>

                                 {/* Break time pill */}
                                 <div className="ml-auto text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                    {timeTable.timeRelaxation.substring(3, 8)}{" "}
                                    break after class
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            ))}
         </div>
      </div>
   );
};

export default TimeTableDetails;
