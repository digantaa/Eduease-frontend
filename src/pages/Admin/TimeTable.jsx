import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";

const TimeTable = () => {
   const [formData, setFormData] = useState({
      subjectName: "",
      teacherName: "",
      timeStart: "",
      timeEnd: "",
      timeRelaxation: "00:05:00",
      year: "",
   });

   const subMap = {
      1: ["Mathematics", "Physics", "Chemistry"],

      3: ["Computer Science", "Mathematics", "Chemistry"],
   };

   const [teachers, setTeachers] = useState([]);
   const [subjects, setSubjects] = useState([]);

   //    const filteredTeachers = teachers.filter((t) => {
   //       t.year == formData.year;
   //    });

   const fetchTeachers = async () => {
      try {
         const response = await axios.get(
            "https://localhost:7013/api/Admin/allTeachers",

            {
               withCredentials: true,
            }
         );
         console.log("🚀 ~ fetchTeachers ~ response:", response);

         setTeachers(response.data);
      } catch (error) {
         console.error("Error fetching teachers:", error);
      }
   };

   useEffect(() => {
      fetchTeachers();
   }, []);

   const [isUpdating, setIsUpdating] = useState(false);
   const [showStartPicker, setShowStartPicker] = useState(false);
   const [showEndPicker, setShowEndPicker] = useState(false);

   const relaxationOptions = [
      { value: "00:02:00", label: "2 minutes" },
      { value: "00:05:00", label: "5 minutes" },
      { value: "00:10:00", label: "10 minutes" },
      { value: "00:15:00", label: "15 minutes" },
      { value: "00:20:00", label: "20 minutes" },
   ];

   // Generate hours and minutes for time picker
   const hours = Array.from({ length: 24 }, (_, i) =>
      i.toString().padStart(2, "0")
   );

   const minutes = Array.from({ length: 60 }, (_, i) =>
      i.toString().padStart(2, "0")
   );

   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const setTime = (timeField, hour, minute) => {
      setFormData({
         ...formData,
         [timeField]: `${hour}:${minute}:00`,
      });

      if (timeField === "timeStart") {
         setShowStartPicker(false);
      } else if (timeField === "timeEnd") {
         setShowEndPicker(false);
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = isUpdating
            ? await axios.put(
                 "https://localhost:7013/api/Admin/updateTimeTable",
                 formData,
                 {
                    withCredentials: true,
                 }
              )
            : await axios.post(
                 "https://localhost:7013/api/Admin/addTimeTable",
                 formData,
                 {
                    withCredentials: true,
                 }
              );
         alert(response.data.message);
      } catch (error) {
         alert("Error: " + (error.response?.data?.message || error.message));
      }
   };

   // Function to format time for display
   const formatTimeDisplay = (timeString) => {
      if (!timeString) return "Select time";
      const [hours, minutes] = timeString.split(":");
      return `${hours}:${minutes}`;
   };

   // Time picker component
   const TimePicker = ({ visible, onClose, onSelectTime, fieldName }) => {
      if (!visible) return null;

      // Extract current hour and minute for highlighting
      const currentValue =
         fieldName === "timeStart" ? formData.timeStart : formData.timeEnd;
      const [currentHour, currentMinute] = currentValue
         ? currentValue.split(":")
         : ["", ""];

      return (
         <div className="absolute mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div className="p-2 flex">
               {/* Hours column */}
               <div className="w-1/2 max-h-48 overflow-y-auto pr-1 border-r">
                  {hours.map((hour) => (
                     <div
                        key={`hour-${hour}`}
                        className={`cursor-pointer px-3 py-2 text-center rounded hover:bg-blue-100 ${
                           currentHour === hour ? "bg-blue-200" : ""
                        }`}
                        onClick={() =>
                           setTime(fieldName, hour, currentMinute || "00")
                        }
                     >
                        {hour}
                     </div>
                  ))}
               </div>

               {/* Minutes column */}
               <div className="w-1/2 max-h-48 overflow-y-auto pl-1">
                  {minutes.map((minute) => (
                     <div
                        key={`minute-${minute}`}
                        className={`cursor-pointer px-3 py-2 text-center rounded hover:bg-blue-100 ${
                           currentMinute === minute ? "bg-blue-200" : ""
                        }`}
                        onClick={() =>
                           setTime(fieldName, currentHour || "00", minute)
                        }
                     >
                        {minute}
                     </div>
                  ))}
               </div>
            </div>
            <div className="p-2 border-t border-gray-200">
               <button
                  onClick={onClose}
                  className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
               >
                  Close
               </button>
            </div>
         </div>
      );
   };

   return (
      <div className="mx-auto">
         <div className="max-w-4xl min-h-[90vh] flex flex-col justify-center mx-auto p-8  ">
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
               {isUpdating ? "Update TimeTable" : "Add New TimeTable"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700">
                        Teacher Name
                     </label>

                     <select
                        name="teacherName"
                        value={formData.teacherName}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                     >
                        <option value="">Select teacher</option>
                        {teachers.map((teacher) => (
                           <option key={teacher.id} value={teacher.name}>
                              {teacher.username}
                           </option>
                        ))}
                     </select>
                     {/* <input
                        type="text"
                        name="teacherName"
                        value={formData.teacherName}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Enter Subject ID"
                        required
                     /> */}
                  </div>
                  <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700">
                        Subject
                     </label>
                     <select
                        name="subjectName"
                        value={formData.subjectName}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                     >
                        <option value="" disabled>
                           Select Subject
                        </option>
                        {subMap[formData.year]?.map((subject) => (
                           <option key={subject} value={subject}>
                              {subject}
                           </option>
                        ))}
                     </select>
                     {/* <input
                        type="select"
                        name="subjectName"
                        value={formData.subjectName}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Enter Subject ID"
                        required
                     /> */}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700">
                        Start Time
                     </label>
                     <div className="relative">
                        <button
                           type="button"
                           onClick={() => setShowStartPicker(!showStartPicker)}
                           className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                           <div className="flex items-center">
                              <Clock size={18} className="text-gray-500 mr-2" />
                              <span
                                 className={`${
                                    !formData.timeStart
                                       ? "text-gray-400"
                                       : "text-black"
                                 }`}
                              >
                                 {formatTimeDisplay(formData.timeStart)}
                              </span>
                           </div>
                           {showStartPicker ? (
                              <ChevronUp size={20} />
                           ) : (
                              <ChevronDown size={20} />
                           )}
                        </button>

                        <TimePicker
                           visible={showStartPicker}
                           onClose={() => setShowStartPicker(false)}
                           onSelectTime={(hour, minute) =>
                              setTime("timeStart", hour, minute)
                           }
                           fieldName="timeStart"
                        />

                        {/* Hidden input for form submission */}
                        <input
                           type="hidden"
                           name="timeStart"
                           value={formData.timeStart}
                           required
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700">
                        End Time
                     </label>
                     <div className="relative">
                        <button
                           type="button"
                           onClick={() => setShowEndPicker(!showEndPicker)}
                           className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                           <div className="flex items-center">
                              <Clock size={18} className="text-gray-500 mr-2" />
                              <span
                                 className={`${
                                    !formData.timeEnd
                                       ? "text-gray-400"
                                       : "text-black"
                                 }`}
                              >
                                 {formatTimeDisplay(formData.timeEnd)}
                              </span>
                           </div>
                           {showEndPicker ? (
                              <ChevronUp size={20} />
                           ) : (
                              <ChevronDown size={20} />
                           )}
                        </button>

                        <TimePicker
                           visible={showEndPicker}
                           onClose={() => setShowEndPicker(false)}
                           onSelectTime={(hour, minute) =>
                              setTime("timeEnd", hour, minute)
                           }
                           fieldName="timeEnd"
                        />

                        {/* Hidden input for form submission */}
                        <input
                           type="hidden"
                           name="timeEnd"
                           value={formData.timeEnd}
                           required
                        />
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700">
                        Time Relaxation
                     </label>
                     <select
                        name="timeRelaxation"
                        value={formData.timeRelaxation}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                     >
                        {relaxationOptions.map((option) => (
                           <option key={option.value} value={option.value}>
                              {option.label}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700">
                        Year
                     </label>
                     <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Enter Year"
                        required
                     />
                  </div>
               </div>

               <div className="flex gap-4 justify-center mt-6">
                  <button
                     type="submit"
                     className="p-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition transform hover:scale-105"
                  >
                     {isUpdating ? "Update TimeTable" : "Add TimeTable"}
                  </button>
                  <button
                     type="button"
                     onClick={() => setIsUpdating(!isUpdating)}
                     className="p-2 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition transform hover:scale-105"
                  >
                     {isUpdating ? "Switch to Add" : "Switch to Update"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default TimeTable;
