import React, { useEffect, useState } from "react";
import ALLTEACHERSAPI from "../../utils/ALLTEACHERSAPI";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipboardEdit, CheckCircle, AlertCircle } from "lucide-react";

const StudentApplyLeave = () => {
   const [leaveReason, setLeaveReason] = useState("");
   const [receivers, setReceivers] = useState([]);
   const [selectedTeacher, setSelectedTeacher] = useState("");
   const [senderId, setSenderId] = useState(localStorage.getItem("userid"));
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState("");
   const navigate = useNavigate();

   // Fetch teachers on component mount
   useEffect(() => {
      const FetchTeachers = async () => {
         try {
            const resp = await ALLTEACHERSAPI();
            console.log(resp);
            setReceivers(resp);
         } catch (error) {
            console.error("Error fetching teachers", error);
            setError("Could not fetch teachers. Please try again later.");
         }
      };

      FetchTeachers();
   }, []);

   // Handle form submission
   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!selectedTeacher) {
         setError("Please select a teacher to send the leave application.");
         return;
      }

      try {
         setIsSubmitting(true);
         setError("");
         console.log(senderId, selectedTeacher, leaveReason);

         const response = await axios.post(
            "https://localhost:7013/api/student/leavesubmission",
            {
               senderId,
               receiverId: selectedTeacher,
               leaveReason,
               senderName: localStorage.getItem("user"),
            },
            { withCredentials: true }
         );

         if (response.status === 200) {
            alert("Leave application submitted successfully!");
            navigate("/student/home");
         } else {
            setError("There was an issue submitting your leave application.");
         }
      } catch (error) {
         console.error("Error submitting leave application", error);
         setError("There was an error submitting your leave application.");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="max-w-4xl mx-auto px-4 py-8">
         <div className="bg-white rounded-xl  p-6 md:p-8">
            <div className="flex items-center justify-center gap-2 mb-6">
               <ClipboardEdit className="w-7 h-7 text-blue-600" />
               <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Apply for Leave
               </h2>
            </div>

            {error && (
               <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
               </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                  <label
                     htmlFor="leaveReason"
                     className="block text-sm font-medium text-gray-700"
                  >
                     Reason for Leave
                  </label>
                  <textarea
                     id="leaveReason"
                     value={leaveReason}
                     onChange={(e) => setLeaveReason(e.target.value)}
                     placeholder="Enter your leave reason..."
                     required
                     className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 min-h-32 text-gray-700"
                  />
               </div>

               <div className="space-y-2">
                  <label
                     htmlFor="teacher"
                     className="block text-sm font-medium text-gray-700"
                  >
                     Select Teacher
                  </label>
                  <select
                     id="teacher"
                     value={selectedTeacher}
                     onChange={(e) => setSelectedTeacher(e.target.value)}
                     required
                     className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-700 bg-white"
                  >
                     <option value="" disabled>
                        Select a teacher
                     </option>
                     {receivers?.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                           {teacher.username}
                        </option>
                     ))}
                  </select>
               </div>

               <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
               >
                  {isSubmitting ? (
                     <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white" />
                  ) : (
                     <CheckCircle className="w-5 h-5" />
                  )}
                  <span>
                     {isSubmitting ? "Submitting..." : "Submit Leave Request"}
                  </span>
               </button>
            </form>
         </div>
      </div>
   );
};

export default StudentApplyLeave;

// import React, { useEffect, useState } from "react";
// import ALLTEACHERSAPI from "../../utils/ALLTEACHERSAPI";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//    Box,
//    Container,
//    Paper,
//    Typography,
//    TextField,
//    MenuItem,
//    Button,
//    FormControl,
//    InputLabel,
//    Select,
// } from "@mui/material";
// import { CheckCircle, ClipboardEdit } from "lucide-react";
// const StudentApplyLeave = () => {
//    const [leaveReason, setLeaveReason] = useState("");
//    const [receivers, setReceivers] = useState([]);
//    const [selectedTeacher, setSelectedTeacher] = useState("");
//    const [senderId, setSenderId] = useState(localStorage.getItem("userid"));
//    const navigate = useNavigate();

//    // Fetch teachers on component mount
//    useEffect(() => {
//       const FetchTeachers = async () => {
//          try {
//             const resp = await ALLTEACHERSAPI();
//             console.log(resp);
//             setReceivers(resp);
//          } catch (error) {
//             console.error("Error fetching teachers", error);
//          }
//       };

//       FetchTeachers();
//    }, []);

//    // Handle form submission
//    const handleSubmit = async (e) => {
//       e.preventDefault();
//       if (!selectedTeacher) {
//          alert("Please select a teacher to send the leave application.");
//          return;
//       }

//       try {
//          console.log(senderId, selectedTeacher, leaveReason);
//          const response = await axios.post(
//             "https://localhost:7013/api/student/leavesubmission",
//             {
//                senderId,
//                receiverId: selectedTeacher,
//                leaveReason,
//                senderName: localStorage.getItem("user"),
//             },
//             { withCredentials: true }
//          );

//          if (response.status === 200) {
//             alert("Leave application submitted successfully!");
//             navigate("/student/home");
//          } else {
//             alert("There was an issue submitting your leave application.");
//          }
//       } catch (error) {
//          console.error("Error submitting leave application", error);
//          alert("There was an error submitting your leave application.");
//       }
//    };

//    return (
//       <div className="max-w-7xl mx-auto">
//          <div className="p-4">
//             <Box
//                sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 1,
//                   mb: 3,
//                }}
//             >
//                <ClipboardEdit size={28} />
//                <Typography
//                   variant="h4"
//                   component="h2"
//                   fontWeight="bold"
//                   textAlign="center"
//                   color="text.primary"
//                >
//                   Apply for Leave
//                </Typography>
//             </Box>

//             <Box
//                component="form"
//                onSubmit={handleSubmit}
//                sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 3,
//                }}
//             >
//                <TextField
//                   id="leaveReason"
//                   label="Reason for Leave"
//                   multiline
//                   rows={4}
//                   value={leaveReason}
//                   onChange={(e) => setLeaveReason(e.target.value)}
//                   placeholder="Enter your leave reason..."
//                   required
//                   fullWidth
//                   variant="outlined"
//                />

//                <FormControl fullWidth required>
//                   <InputLabel id="teacher-select-label">
//                      Select Teacher
//                   </InputLabel>
//                   <Select
//                      labelId="teacher-select-label"
//                      id="teacher"
//                      value={selectedTeacher}
//                      onChange={(e) => setSelectedTeacher(e.target.value)}
//                      label="Select Teacher"
//                   >
//                      <MenuItem value="" disabled>
//                         Select a teacher
//                      </MenuItem>
//                      {receivers?.map((teacher) => (
//                         <MenuItem key={teacher.id} value={teacher.id}>
//                            {teacher.username}
//                         </MenuItem>
//                      ))}
//                   </Select>
//                </FormControl>

//                <Button
//                   type="submit"
//                   variant="contained"
//                   size="large"
//                   startIcon={<CheckCircle />}
//                   sx={{
//                      py: 1.5,
//                      bgcolor: "black",
//                      "&:hover": {
//                         bgcolor: "#1F2122",
//                      },
//                      textTransform: "none",
//                   }}
//                >
//                   Submit Leave Request
//                </Button>
//             </Box>
//          </div>
//       </div>
//    );
// };

// export default StudentApplyLeave;
