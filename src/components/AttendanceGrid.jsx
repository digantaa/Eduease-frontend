import React, { useRef, useEffect, useState } from "react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import axios from "axios";
import {
   Calendar,
   Loader,
   Info,
   Check,
   X,
   Filter,
   Clock,
   Book,
   Users,
} from "lucide-react";

const AttendanceGrid = () => {
   const tableRef = useRef(null);
   const [attendanceData, setAttendanceData] = useState([]);
   const [loading, setLoading] = useState(false);
   const userId = localStorage.getItem("userid");
   const [attendanceYear, setAttendanceYear] = useState("");
   const [attendanceMonth, setAttendanceMonth] = useState("");

   useEffect(() => {
      const fetchAttendance = async () => {
         setLoading(true);
         try {
            const response = await axios.get(
               `https://localhost:7013/api/Student/GetStudentAttendence?studentId=${userId}&attendanceYear=${attendanceYear}&attendanceMonth=${attendanceMonth}`,
               { withCredentials: true }
            );

            if (response.data) {
               setAttendanceData(formatAttendanceData(response.data));
            }
         } catch (error) {
            console.error("Error fetching attendance data:", error);
         } finally {
            setLoading(false);
         }
      };

      if (attendanceYear && attendanceMonth) {
         fetchAttendance();
      }
   }, [userId, attendanceYear, attendanceMonth]);

   useEffect(() => {
      if (!attendanceData.length) return;

      const hot = new Handsontable(tableRef.current, {
         data: attendanceData,
         colHeaders: [
            "Subject",
            ...Array.from({ length: 30 }, (_, i) => (i + 1).toString()),
         ],
         rowHeaders: true,
         stretchH: "all",
         height: 400,
         width: "100%",
         licenseKey: "non-commercial-and-evaluation",
         className: "font-sans",
         cells: function (row, col) {
            const cellProperties = {};
            if (col > 0) {
               cellProperties.className = "htCenter";
               if (this.instance.getData()[row][col] === "P") {
                  cellProperties.className +=
                     " bg-emerald-100 text-emerald-800";
               } else if (this.instance.getData()[row][col] === "A") {
                  cellProperties.className += " bg-red-100 text-red-800";
               }
            }
            return cellProperties;
         },
      });

      return () => hot.destroy();
   }, [attendanceData]);

   const formatAttendanceData = (data) => {
      const subjects = [
         ...new Set(
            data.map((entry) => entry.subjectName || "Unknown Subject")
         ),
      ];
      const attendanceMap = {};

      subjects.forEach((subject) => {
         attendanceMap[subject] = Array(30).fill("");
      });

      data.forEach(({ subjectName, attendanceDate, isPresent }) => {
         const subject = subjectName || "Unknown Subject";
         if (!attendanceDate) return;
         const day = new Date(attendanceDate).getDate();
         if (day >= 1 && day <= 30) {
            attendanceMap[subject][day - 1] = isPresent ? "P" : "A";
         }
      });

      return subjects.map((subject) => [subject, ...attendanceMap[subject]]);
   };

   const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
   ];

   return (
      <div className="max-w-7xl mx-auto">
         {/* Top Control Bar */}
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
               <div className="bg-indigo-100 p-2 rounded-full">
                  <Calendar className="text-indigo-600" size={24} />
               </div>
               <h2 className="text-2xl font-bold text-gray-900">
                  Attendance Tracker
               </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
               <div className="relative w-full sm:w-40">
                  <select
                     value={attendanceYear}
                     onChange={(e) => setAttendanceYear(e.target.value)}
                     className="w-full h-10 pl-4 pr-8 rounded-full bg-gray-100 border-0 text-gray-800 focus:ring-2 focus:ring-indigo-500 px-4"
                  >
                     <option value="">Year</option>
                     {[1, 2, 3, 4].map((year) => (
                        <option key={year} value={year.toString()}>
                           Year {year}
                        </option>
                     ))}
                  </select>
                  <div className="absolute right-3 top-2.5 pointer-events-none">
                     <Filter size={16} className="text-gray-500" />
                  </div>
               </div>

               <div className="relative w-full sm:w-48">
                  <select
                     value={attendanceMonth}
                     onChange={(e) => setAttendanceMonth(e.target.value)}
                     className="w-full h-10 pl-4 pr-8 rounded-full bg-gray-100 border-0 text-gray-800 focus:ring-2 focus:ring-indigo-500 px-4"
                  >
                     <option value="">Month</option>
                     {months.map((month, index) => (
                        <option key={index} value={(index + 1).toString()}>
                           {month}
                        </option>
                     ))}
                  </select>
                  <div className="absolute right-3 top-2.5 pointer-events-none">
                     <Filter size={16} className="text-gray-500" />
                  </div>
               </div>
            </div>
         </div>

         {/* Loading State */}
         {loading && (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
               <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Clock size={20} className="text-indigo-600" />
                  </div>
               </div>
               <p className="mt-4 text-gray-600 font-medium">
                  Processing records...
               </p>
            </div>
         )}

         {/* No Records State */}
         {!loading &&
            attendanceYear &&
            attendanceMonth &&
            attendanceData.length === 0 && (
               <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <div className="flex flex-col items-center py-10 text-center">
                     <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <Info size={28} className="text-blue-500" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No Records Found
                     </h3>
                     <p className="text-gray-600 max-w-md">
                        There are no attendance records available for{" "}
                        {months[parseInt(attendanceMonth) - 1]}, Year{" "}
                        {attendanceYear}.
                     </p>
                  </div>
               </div>
            )}

         {/* Records View */}
         {!loading && attendanceData.length > 0 && (
            <>
               {/* Stats Cards */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center">
                     <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mr-3">
                        <Calendar size={18} className="text-indigo-600" />
                     </div>
                     <div>
                        <p className="text-xs text-gray-500">Month</p>
                        <p className="text-lg font-bold text-gray-900">
                           {months[parseInt(attendanceMonth) - 1]}
                        </p>
                     </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center">
                     <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mr-3">
                        <Clock size={18} className="text-emerald-600" />
                     </div>
                     <div>
                        <p className="text-xs text-gray-500">Year</p>
                        <p className="text-lg font-bold text-gray-900">
                           Year {attendanceYear}
                        </p>
                     </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center">
                     <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mr-3">
                        <Book size={18} className="text-amber-600" />
                     </div>
                     <div>
                        <p className="text-xs text-gray-500">Subjects</p>
                        <p className="text-lg font-bold text-gray-900">
                           {attendanceData.length}
                        </p>
                     </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center">
                     <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mr-3">
                        <Users size={18} className="text-purple-600" />
                     </div>
                     <div>
                        <p className="text-xs text-gray-500">Total Days</p>
                        <p className="text-lg font-bold text-gray-900">30</p>
                     </div>
                  </div>
               </div>

               {/* Table with Tabs */}
               <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                     <h3 className="font-medium text-gray-900">
                        Attendance Details
                     </h3>

                     <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-full">
                        <button className="px-4 py-1 text-sm rounded-full bg-indigo-600 text-white">
                           List View
                        </button>
                        <button className="px-4 py-1 text-sm rounded-full text-gray-700">
                           Calendar View
                        </button>
                     </div>
                  </div>

                  <div className="px-6 py-4">
                     <div ref={tableRef} className="w-full overflow-x-auto" />
                  </div>
               </div>

               {/* Legend */}
               <div className="mt-6 flex flex-wrap gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center">
                     <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center mr-2">
                        <Check size={16} className="text-white" />
                     </div>
                     <span className="text-gray-700">Present</span>
                  </div>
                  <div className="flex items-center">
                     <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center mr-2">
                        <X size={16} className="text-white" />
                     </div>
                     <span className="text-gray-700">Absent</span>
                  </div>
                  <div className="flex items-center">
                     <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                        <span className="text-gray-600 text-xs">N/A</span>
                     </div>
                     <span className="text-gray-700">No Record</span>
                  </div>
               </div>
            </>
         )}
      </div>
   );
   //    return
   //     (
   //       <div className="max-w-7xl mx-auto bg-white rounded-lg border border-gray-100 overflow-hidden">
   //          {/* Header */}
   //          <div className="bg-indigo-600 px-6 py-5">
   //             <div className="flex items-center gap-3">
   //                <Calendar className="text-white" size={22} />
   //                <h2 className="text-xl font-medium text-white">
   //                   Attendance Records
   //                </h2>
   //             </div>
   //          </div>

   //          {/* Content */}
   //          <div className="p-6">
   //             {/* Filters */}
   //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
   //                {/* Year Select */}
   //                <div>
   //                   <label className="block text-sm font-medium text-gray-900 mb-2">
   //                      Select Year
   //                   </label>
   //                   <div className="relative">
   //                      <select
   //                         value={attendanceYear}
   //                         onChange={(e) => setAttendanceYear(e.target.value)}
   //                         className="w-full rounded-md border-0 ring-1 ring-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
   //                      >
   //                         <option value="">Select a year</option>
   //                         {[1, 2, 3, 4].map((year) => (
   //                            <option key={year} value={year.toString()}>
   //                               Year {year}
   //                            </option>
   //                         ))}
   //                      </select>
   //                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
   //                         <svg
   //                            className="w-5 h-5 text-gray-400"
   //                            fill="none"
   //                            stroke="currentColor"
   //                            viewBox="0 0 24 24"
   //                            xmlns="http://www.w3.org/2000/svg"
   //                         >
   //                            <path
   //                               strokeLinecap="round"
   //                               strokeLinejoin="round"
   //                               strokeWidth="2"
   //                               d="M19 9l-7 7-7-7"
   //                            ></path>
   //                         </svg>
   //                      </div>
   //                   </div>
   //                </div>

   //                {/* Month Select */}
   //                <div>
   //                   <label className="block text-sm font-medium text-gray-900 mb-2">
   //                      Select Month
   //                   </label>
   //                   <div className="relative">
   //                      <select
   //                         value={attendanceMonth}
   //                         onChange={(e) => setAttendanceMonth(e.target.value)}
   //                         className="w-full rounded-md border-0 ring-1 ring-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
   //                      >
   //                         <option value="">Select a month</option>
   //                         {months.map((month, index) => (
   //                            <option key={index} value={(index + 1).toString()}>
   //                               {month}
   //                            </option>
   //                         ))}
   //                      </select>
   //                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
   //                         <svg
   //                            className="w-5 h-5 text-gray-400"
   //                            fill="none"
   //                            stroke="currentColor"
   //                            viewBox="0 0 24 24"
   //                            xmlns="http://www.w3.org/2000/svg"
   //                         >
   //                            <path
   //                               strokeLinecap="round"
   //                               strokeLinejoin="round"
   //                               strokeWidth="2"
   //                               d="M19 9l-7 7-7-7"
   //                            ></path>
   //                         </svg>
   //                      </div>
   //                   </div>
   //                </div>
   //             </div>

   //             {/* Information States */}
   //             {loading ? (
   //                <div className="flex flex-col items-center justify-center h-80 bg-gray-50 rounded-md border border-gray-100">
   //                   <Loader
   //                      className="animate-spin text-indigo-600 mb-3"
   //                      size={36}
   //                   />
   //                   <p className="text-gray-600 font-medium">
   //                      Loading attendance data...
   //                   </p>
   //                </div>
   //             ) : attendanceYear &&
   //               attendanceMonth &&
   //               attendanceData.length === 0 ? (
   //                <div className="flex items-center p-5 bg-blue-50 rounded-md border border-blue-100 mb-6">
   //                   <Info
   //                      className="mr-3 text-blue-500 flex-shrink-0"
   //                      size={20}
   //                   />
   //                   <p className="text-blue-700">
   //                      No attendance records found for the selected period.
   //                   </p>
   //                </div>
   //             ) : (
   //                <div className="space-y-8">
   //                   {/* Attendance Summary Cards */}
   //                   {attendanceData.length > 0 && (
   //                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
   //                         <div className="bg-white p-5 rounded-md border-l-4 border border-l-emerald-500">
   //                            <h3 className="text-sm font-medium text-gray-500 mb-1">
   //                               Selected Month
   //                            </h3>
   //                            <p className="text-2xl font-bold text-gray-900">
   //                               {months[parseInt(attendanceMonth) - 1]}
   //                            </p>
   //                         </div>
   //                         <div className="bg-white p-5 rounded-md border-l-4 border border-l-indigo-500">
   //                            <h3 className="text-sm font-medium text-gray-500 mb-1">
   //                               Selected Year
   //                            </h3>
   //                            <p className="text-2xl font-bold text-gray-900">
   //                               Year {attendanceYear}
   //                            </p>
   //                         </div>
   //                         <div className="bg-white p-5 rounded-md border-l-4 border border-l-amber-500">
   //                            <h3 className="text-sm font-medium text-gray-500 mb-1">
   //                               Subjects
   //                            </h3>
   //                            <p className="text-2xl font-bold text-gray-900">
   //                               {attendanceData.length}
   //                            </p>
   //                         </div>
   //                         <div className="bg-white p-5 rounded-md border-l-4 border border-l-violet-500">
   //                            <h3 className="text-sm font-medium text-gray-500 mb-1">
   //                               Total Days
   //                            </h3>
   //                            <p className="text-2xl font-bold text-gray-900">
   //                               30
   //                            </p>
   //                         </div>
   //                      </div>
   //                   )}

   //                   {/* Table Container */}
   //                   <div className="border border-gray-200 rounded-md overflow-hidden">
   //                      <div ref={tableRef} className="w-full overflow-x-auto" />
   //                   </div>

   //                   {/* Legend */}
   //                   <div className="mt-6 p-5 bg-gray-50 rounded-md border border-gray-100">
   //                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
   //                         Legend
   //                      </h3>
   //                      <div className="flex flex-wrap gap-6">
   //                         <div className="flex items-center">
   //                            <div className="w-6 h-6 bg-emerald-50 rounded border border-emerald-200 flex items-center justify-center mr-2">
   //                               <Check size={14} className="text-emerald-600" />
   //                            </div>
   //                            <span className="text-gray-700">Present (P)</span>
   //                         </div>
   //                         <div className="flex items-center">
   //                            <div className="w-6 h-6 bg-red-50 rounded border border-red-200 flex items-center justify-center mr-2">
   //                               <X size={14} className="text-red-600" />
   //                            </div>
   //                            <span className="text-gray-700">Absent (A)</span>
   //                         </div>
   //                         <div className="flex items-center">
   //                            <div className="w-6 h-6 bg-white rounded border border-gray-200 flex items-center justify-center mr-2"></div>
   //                            <span className="text-gray-700">No Record</span>
   //                         </div>
   //                      </div>
   //                   </div>
   //                </div>
   //             )}
   //          </div>
   //       </div>
   //    );

   //    return (
   //       <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
   //          {/* Header */}
   //          <div className="bg-[#1F2122] px-6 py-4">
   //             <div className="flex items-center gap-3">
   //                <Calendar className="text-white" size={24} />
   //                <h2 className="text-xl font-bold text-white">
   //                   Attendance Records
   //                </h2>
   //             </div>
   //          </div>

   //          {/* Content */}
   //          <div className="p-6">
   //             {/* Filters */}
   //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
   //                {/* Year Select */}
   //                <div className="relative">
   //                   <label className="block text-sm font-medium text-gray-700 mb-1">
   //                      Select Year
   //                   </label>
   //                   <select
   //                      value={attendanceYear}
   //                      onChange={(e) => setAttendanceYear(e.target.value)}
   //                      className="w-full rounded-lg border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
   //                   >
   //                      <option value="">Select a year</option>
   //                      {[1, 2, 3, 4].map((year) => (
   //                         <option key={year} value={year.toString()}>
   //                            Year {year}
   //                         </option>
   //                      ))}
   //                   </select>
   //                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 pt-5">
   //                      <svg
   //                         className="w-5 h-5 text-gray-400"
   //                         fill="none"
   //                         stroke="currentColor"
   //                         viewBox="0 0 24 24"
   //                         xmlns="http://www.w3.org/2000/svg"
   //                      >
   //                         <path
   //                            strokeLinecap="round"
   //                            strokeLinejoin="round"
   //                            strokeWidth="2"
   //                            d="M19 9l-7 7-7-7"
   //                         ></path>
   //                      </svg>
   //                   </div>
   //                </div>

   //                {/* Month Select */}
   //                <div className="relative">
   //                   <label className="block text-sm font-medium text-gray-700 mb-1">
   //                      Select Month
   //                   </label>
   //                   <select
   //                      value={attendanceMonth}
   //                      onChange={(e) => setAttendanceMonth(e.target.value)}
   //                      className="w-full rounded-lg border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
   //                   >
   //                      <option value="">Select a month</option>
   //                      {months.map((month, index) => (
   //                         <option key={index} value={(index + 1).toString()}>
   //                            {month}
   //                         </option>
   //                      ))}
   //                   </select>
   //                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 pt-5">
   //                      <svg
   //                         className="w-5 h-5 text-gray-400"
   //                         fill="none"
   //                         stroke="currentColor"
   //                         viewBox="0 0 24 24"
   //                         xmlns="http://www.w3.org/2000/svg"
   //                      >
   //                         <path
   //                            strokeLinecap="round"
   //                            strokeLinejoin="round"
   //                            strokeWidth="2"
   //                            d="M19 9l-7 7-7-7"
   //                         ></path>
   //                      </svg>
   //                   </div>
   //                </div>
   //             </div>

   //             {/* Information States */}
   //             {loading ? (
   //                <div className="flex flex-col items-center justify-center h-80 bg-gray-50 rounded-lg border border-gray-200">
   //                   <Loader
   //                      className="animate-spin text-blue-600 mb-3"
   //                      size={36}
   //                   />
   //                   <p className="text-gray-600 font-medium">
   //                      Loading attendance data...
   //                   </p>
   //                </div>
   //             ) : attendanceYear &&
   //               attendanceMonth &&
   //               attendanceData.length === 0 ? (
   //                <div className="flex items-center p-4 bg-blue-50 text-blue-800 rounded-lg mb-6">
   //                   <Info className="mr-3 text-blue-500" size={20} />
   //                   <p>No attendance records found for the selected period.</p>
   //                </div>
   //             ) : (
   //                <div className="space-y-6">
   //                   {/* Attendance Summary Cards */}
   //                   {attendanceData.length > 0 && (
   //                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
   //                         <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-lg border border-emerald-200 shadow-sm">
   //                            <h3 className="text-sm font-medium text-emerald-800 mb-2">
   //                               Selected Month
   //                            </h3>
   //                            <p className="text-2xl font-bold text-emerald-700">
   //                               {months[parseInt(attendanceMonth) - 1]}
   //                            </p>
   //                         </div>
   //                         <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 shadow-sm">
   //                            <h3 className="text-sm font-medium text-blue-800 mb-2">
   //                               Selected Year
   //                            </h3>
   //                            <p className="text-2xl font-bold text-blue-700">
   //                               Year {attendanceYear}
   //                            </p>
   //                         </div>
   //                         <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 shadow-sm">
   //                            <h3 className="text-sm font-medium text-amber-800 mb-2">
   //                               Subjects
   //                            </h3>
   //                            <p className="text-2xl font-bold text-amber-700">
   //                               {attendanceData.length}
   //                            </p>
   //                         </div>
   //                         <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200 shadow-sm">
   //                            <h3 className="text-sm font-medium text-purple-800 mb-2">
   //                               Total Days
   //                            </h3>
   //                            <p className="text-2xl font-bold text-purple-700">
   //                               30
   //                            </p>
   //                         </div>
   //                      </div>
   //                   )}

   //                   {/* Table Container */}
   //                   <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
   //                      <div ref={tableRef} className="w-full overflow-x-auto" />
   //                   </div>

   //                   {/* Legend */}
   //                   <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
   //                      <h3 className="text-sm font-medium text-gray-700 mb-2">
   //                         Legend:
   //                      </h3>
   //                      <div className="flex flex-wrap gap-6">
   //                         <div className="flex items-center">
   //                            <div className="w-6 h-6 bg-emerald-100 rounded-md border border-emerald-200 flex items-center justify-center mr-2">
   //                               <Check size={14} className="text-emerald-700" />
   //                            </div>
   //                            <span className="text-gray-700">Present (P)</span>
   //                         </div>
   //                         <div className="flex items-center">
   //                            <div className="w-6 h-6 bg-red-100 rounded-md border border-red-200 flex items-center justify-center mr-2">
   //                               <X size={14} className="text-red-700" />
   //                            </div>
   //                            <span className="text-gray-700">Absent (A)</span>
   //                         </div>
   //                         <div className="flex items-center">
   //                            <div className="w-6 h-6 bg-white rounded-md border border-gray-300 flex items-center justify-center mr-2"></div>
   //                            <span className="text-gray-700">No Record</span>
   //                         </div>
   //                      </div>
   //                   </div>
   //                </div>
   //             )}
   //          </div>
   //       </div>
   //    );
};

export default AttendanceGrid;
