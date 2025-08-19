import axios from "axios";
import { BookOpen, Calendar, Check, ClipboardCheck, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Paper,
  Table,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  Button,
  Checkbox,
  Alert,
} from "@mui/material";

const Attendance = () => {
  const [students, setStudents] = React.useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [message, setMessage] = useState("");
  const [attendanceYear, setAttendanceYear] = useState(1);
  const teacherId = localStorage.getItem("userid");

  // Fetch students when component loads
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7013/api/Teacher/subjectsByYear?Id=${teacherId}&Year=${attendanceYear}`,
          { withCredentials: true },
        );
        setStudents(response.data);
        console.log(response, "attendence upload response...........");
        // Set default attendance data with isPresent as false
        const initialAttendance = response.data.map((student) => ({
          studentId: student.studentId,
          subjectId: student.subjectId,
          isPresent: false,
          subjectName: student.subjectName,
          teacherId: teacherId,
          year: attendanceYear,
        }));
        setAttendanceData(initialAttendance);
      } catch (error) {
        toast.error(error?.response?.data);
        setMessage("Already uploaded attendance for today.");
      }
    };

    fetchStudents();
  }, [teacherId, attendanceYear]);

  // Handle checkbox change (toggling attendance)
  const handleCheckboxChange = (studentId, isPresent) => {
    setAttendanceData((prevData) => {
      // Update attendance data for the selected student
      return prevData.map((att) =>
        att.studentId === studentId
          ? { ...att, isPresent } // Toggle the present status
          : att,
      );
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (attendanceData.length === 0) {
      setMessage("No attendance data to submit.");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7013/api/Teacher/updateAttendance",
        attendanceData,
        { withCredentials: true },
      );
      setMessage(response.data); // Show success message
    } catch (error) {
      toast.error(error.response.data);
      setMessage("Failed to update attendance.");
    }
  };
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <select
        name="attendanceYear"
        id=""
        value={attendanceYear}
        onChange={(e) => setAttendanceYear(e.target.value)}
      >
        <option value="">---Select Year---</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <Paper elevation={2} className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Student Attendance
        </h2>

        {message && (
          <Alert severity="info" className="mb-6">
            {message}
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="font-medium text-slate-700">
                  Subject Name
                </TableCell>
                <TableCell className="font-medium text-slate-700">
                  Student Name
                </TableCell>
                <TableCell className="font-medium text-slate-700">
                  Attendance
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.studentId} className="hover:bg-slate-50">
                  <TableCell>{student.subjectName}</TableCell>
                  <TableCell>{student.studentName}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={attendanceData.some(
                        (att) =>
                          att.studentId === student.studentId && att.isPresent,
                      )}
                      onChange={(e) =>
                        handleCheckboxChange(
                          student.studentId,
                          e.target.checked,
                        )
                      }
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="mt-6 flex justify-end">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Attendance
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default Attendance;

// return (
//    <div className="w-full flex flex-col gap-[5vh] max-w-4xl mx-auto p-4  min-h-screen">
//       {/* Header with Year Selector */}
//       <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-[4vh]">
//          <div className="flex items-center gap-2">
//             <Calendar className="text-indigo-600 w-6 h-6" />
//             <h1 className="text-xl font-bold text-gray-800">
//                Attendance System
//             </h1>
//          </div>

//          <div className="relative w-full md:w-48">
//             <select
//                name="attendanceYear"
//                value={attendanceYear}
//                onChange={(e) => setAttendanceYear(e.target.value)}
//                className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 appearance-none"
//             >
//                <option value="">---Select Year---</option>
//                <option value="1">Year 1</option>
//                <option value="2">Year 2</option>
//                <option value="3">Year 3</option>
//                <option value="4">Year 4</option>
//             </select>
//             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                <svg
//                   className="h-5 w-5 text-gray-400"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                >
//                   <path
//                      strokeLinecap="round"
//                      strokeLinejoin="round"
//                      strokeWidth="2"
//                      d="M19 9l-7 7-7-7"
//                   />
//                </svg>
//             </div>
//          </div>
//       </div>

//       {/* Main Content Card */}
//       <div className="bg-white rounded-xl p-4 border border-gray-200 ">
//          {message && (
//             <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700 rounded">
//                <div className="flex">
//                   <div className="flex-shrink-0">
//                      <svg
//                         className="h-5 w-5 text-blue-400"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                      >
//                         <path
//                            fillRule="evenodd"
//                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
//                            clipRule="evenodd"
//                         />
//                      </svg>
//                   </div>
//                   <div className="ml-3">
//                      <p className="text-sm">{message}</p>
//                   </div>
//                </div>
//             </div>
//          )}

//          {/* Table Header */}
//          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 mb-2 border-b border-gray-200">
//             <div className="col-span-5 font-medium text-gray-600 flex items-center gap-2">
//                <BookOpen className="w-4 h-4" />
//                <span>Subject Name</span>
//             </div>
//             <div className="col-span-5 font-medium text-gray-600 flex items-center gap-2">
//                <User className="w-4 h-4" />
//                <span>Student Name</span>
//             </div>
//             <div className="col-span-2 font-medium text-gray-600 text-center">
//                Attendance
//             </div>
//          </div>

//          {/* Student Rows */}
//          <div className="space-y-2">
//             {students.map((student) => (
//                <div
//                   key={student.studentId}
//                   className="grid grid-cols-1 md:grid-cols-12 gap-4 py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition"
//                >
//                   {/* Mobile View Labels */}
//                   <div className="md:hidden space-y-2">
//                      <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                            <BookOpen className="w-4 h-4 text-gray-500" />
//                            <span className="text-sm font-medium text-gray-600">
//                               Subject:
//                            </span>
//                         </div>
//                         <span className="text-gray-800">
//                            {student.subjectName}
//                         </span>
//                      </div>
//                      <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                            <User className="w-4 h-4 text-gray-500" />
//                            <span className="text-sm font-medium text-gray-600">
//                               Student:
//                            </span>
//                         </div>
//                         <span className="text-gray-800">
//                            {student.studentName}
//                         </span>
//                      </div>
//                      <div className="flex items-center justify-between">
//                         <span className="text-sm font-medium text-gray-600">
//                            Present:
//                         </span>
//                         <label className="relative inline-flex items-center">
//                            <input
//                               type="checkbox"
//                               className="sr-only peer"
//                               checked={attendanceData.some(
//                                  (att) =>
//                                     att.studentId === student.studentId &&
//                                     att.isPresent
//                               )}
//                               onChange={(e) =>
//                                  handleCheckboxChange(
//                                     student.studentId,
//                                     e.target.checked
//                                  )
//                               }
//                            />
//                            <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-indigo-500 peer-focus:ring-2 peer-focus:ring-indigo-300"></div>
//                            <div className="absolute w-4 h-4 bg-white rounded-full left-0.5 top-0.5 peer-checked:left-5 transition-all"></div>
//                         </label>
//                      </div>
//                   </div>

//                   {/* Desktop View */}
//                   <div className="hidden md:block md:col-span-5">
//                      {student.subjectName}
//                   </div>
//                   <div className="hidden md:block md:col-span-5">
//                      {student.studentName}
//                   </div>
//                   <div className="hidden md:flex md:col-span-2 justify-center items-center">
//                      <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                            type="checkbox"
//                            className="sr-only peer"
//                            checked={attendanceData.some(
//                               (att) =>
//                                  att.studentId === student.studentId &&
//                                  att.isPresent
//                            )}
//                            onChange={(e) =>
//                               handleCheckboxChange(
//                                  student.studentId,
//                                  e.target.checked
//                               )
//                            }
//                         />
//                         <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-indigo-500 peer-focus:ring-2 peer-focus:ring-indigo-300"></div>
//                         <div className="absolute w-4 h-4 bg-white rounded-full left-0.5 top-0.5 peer-checked:left-5 transition-all"></div>
//                      </label>
//                   </div>
//                </div>
//             ))}
//          </div>

//          {/* Submit Button */}
//          <div className="mt-8 flex justify-end">
//             <button
//                onClick={handleSubmit}
//                className="flex items-center gap-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
//             >
//                <Check className="w-5 h-5" />
//                <span>Submit Attendance</span>
//             </button>
//          </div>
//       </div>
//    </div>
// );
