import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
   Container,
   Typography,
   Box,
   Paper,
   Grid,
   FormControl,
   InputLabel,
   Select,
   MenuItem,
   Button,
   TableContainer,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   TextField,
   Chip,
   Checkbox,
} from "@mui/material";
const TeacherUpdateMarks = () => {
   const Id = localStorage.getItem("userid"); // Get teacher ID from localStorage
   const [data, setData] = React.useState([]);
   const [year, setYear] = useState(0); // Default to year 3
   const [subject, setSubject] = useState("Please select subject"); // Default to DotNet
   const [subjectChoice, setSubjectChoice] = useState([]);
   const [editMode, setEditMode] = useState(null); // Track which student's marks are being edited
   const [updatedMarks, setUpdatedMarks] = useState({}); // Track updated marks
   const [selectedFile, setSelectedFile] = useState(null);
   const [sendToParents, setSendToParents] = useState({}); // Store values per student

   useEffect(() => {
      fetchSubjects();
   }, []);

   //fetch all subjects teached by the teacher
   const fetchSubjects = async () => {
      const response = await axios.get(
         `https://localhost:7013/api/Teacher/subjects?TeacherId=${Id}`,
         { withCredentials: true }
      );
      setSubjectChoice(response.data);
      console.log(response, "get subjects......");
   };

   //Fetch data based on year and subject
   const handleGo = async () => {
      try {
         if (subject == "Please select subject" || subject == "") {
            toast.error("Please select a subject");
         }
         if (year == 0) {
            toast.error("Please select a year");
         }

         // Construct the API URL with query parameters
         const resp = await axios.get(
            `https://localhost:7013/api/Teacher/studentsBySubjectName?Id=${Id}&Name=${subject}&Year=${year}`,

            { withCredentials: true }
         );
         setData(resp.data);
      } catch (error) {
         console.error("Error fetching data:", error);
      }
   };

   // Set up for editing a student's marks
   const handleEdit = (studentId, currentMarks) => {
      setEditMode(studentId); // Enable edit mode for the student
      setUpdatedMarks({ ...updatedMarks, [studentId]: currentMarks }); // Pre-fill the marks
   };

   // Handle saving the updated marks
   const handleSave = async (studentId, subjectId) => {
      const marksToUpdate = updatedMarks[studentId]; // Get the marks to be updated

      if (marksToUpdate === undefined || marksToUpdate === null) {
         toast.error("Please enter valid marks.");
         return;
      }

      try {
         // Send a PUT request to update the marks for the specific student
         await axios.put(
            `https://localhost:7013/api/Teacher/editStudentsMarks?SubjectId=${subjectId}`,
            marksToUpdate,
            {
               withCredentials: true,
               headers: {
                  "Content-Type": "application/json",
               },
            }
         );

         // Update the local state to reflect the changes in the UI
         setData((prevData) =>
            prevData.map((student) =>
               student.studentId === studentId
                  ? { ...student, marks: marksToUpdate }
                  : student
            )
         );

         toast.success("Marks updated successfully.");
      } catch (error) {
         console.error("Error updating marks:", error);
         toast.error("Failed to update marks.");
      }

      // Disable edit mode after saving
      setEditMode(null);
      setUpdatedMarks({}); // Clear updated marks state
   };

   // Handle mark change for a student
   const handleMarksChange = (e, studentId) => {
      setUpdatedMarks({ ...updatedMarks, [studentId]: e.target.value }); // Update the marks for the specific student
   };

   const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
   };

   const handleUpload = async (subjectId, studentId) => {
      if (!selectedFile) {
         toast.error("Please select a file to upload.");
         return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("subjectId", subjectId.toString());
      formData.append(
         "sendToParents",
         sendToParents[studentId] ? "true" : "false"
      );
      try {
         const response = await axios.post(
            `https://localhost:7013/api/Teacher/upload/result?SubjectId=${subjectId}`,
            formData,
            {
               headers: { "Content-Type": "multipart/form-data" },
               withCredentials: true,
            }
         );

         toast.success("File uploaded successfully.");
      } catch (error) {
         console.log(error.response?.data?.message);
         toast.error(error.response?.data?.message || "Upload failed");
         console.error("Error uploading file:", error);
         toast.error("File upload failed.");
      }
   };

   return (
      <Container sx={{ py: 6 }}>
         <Typography
            variant="h3"
            textAlign="center"
            color="primary.main"
            fontWeight="700"
            gutterBottom
            sx={{
               mb: 5,
               background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
               backgroundClip: "text",
               textFillColor: "transparent",
               textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
         >
            🎯 Update Student Marks
         </Typography>

         <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: "100%" }}>
               {/* Selection Panel */}
               <Paper
                  elevation={6}
                  sx={{
                     p: 4,
                     mb: 4,
                     borderRadius: 2,
                     background:
                        "linear-gradient(to right bottom, #ffffff, #f8f9fa)",
                     boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
                  }}
               >
                  <Typography
                     variant="h5"
                     textAlign="center"
                     color="success.main"
                     fontWeight="600"
                     sx={{ mb: 4 }}
                  >
                     Select Year & Subject
                  </Typography>
                  <Grid container spacing={4}>
                     <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                           <InputLabel>📅 Year</InputLabel>
                           <Select
                              value={year}
                              onChange={(e) => setYear(e.target.value)}
                              label="Year"
                              sx={{
                                 "& .MuiOutlinedInput-notchedOutline": {
                                    borderRadius: 2,
                                 },
                              }}
                           >
                              <MenuItem value="">Select Year</MenuItem>
                              <MenuItem value="1">1st Year</MenuItem>
                              <MenuItem value="2">2nd Year</MenuItem>
                              <MenuItem value="3">3rd Year</MenuItem>
                           </Select>
                        </FormControl>
                     </Grid>
                     <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                           <InputLabel>📖 Subject</InputLabel>
                           <Select
                              value={subject}
                              onChange={(e) => setSubject(e.target.value)}
                              label="Subject"
                              sx={{
                                 "& .MuiOutlinedInput-notchedOutline": {
                                    borderRadius: 2,
                                 },
                              }}
                           >
                              <MenuItem value="">Select Subject</MenuItem>
                              {subjectChoice.map((subjectItem, index) => (
                                 <MenuItem key={index} value={subjectItem}>
                                    {subjectItem}
                                 </MenuItem>
                              ))}
                           </Select>
                        </FormControl>
                     </Grid>
                     <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{ display: "flex", alignItems: "flex-end" }}
                     >
                        <Button
                           variant="contained"
                           color="success"
                           fullWidth
                           size="large"
                           onClick={handleGo}
                           sx={{
                              py: 2,
                              borderRadius: 2,
                              boxShadow: "0 4px 14px 0 rgba(0,200,83,0.39)",
                              "&:hover": {
                                 transform: "translateY(-2px)",
                                 boxShadow: "0 6px 20px rgba(0,200,83,0.45)",
                              },
                           }}
                        >
                           🚀 Fetch Data
                        </Button>
                     </Grid>
                  </Grid>
               </Paper>

               {/* Student Data Table */}
               <Paper
                  elevation={6}
                  sx={{
                     p: 4,
                     borderRadius: 2,
                     background:
                        "linear-gradient(to right bottom, #ffffff, #f8f9fa)",
                     boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
                  }}
               >
                  <Typography
                     variant="h5"
                     textAlign="center"
                     color="text.primary"
                     fontWeight="600"
                     sx={{ mb: 4 }}
                  >
                     🎓 Student Data
                  </Typography>
                  {data.length > 0 ? (
                     <TableContainer>
                        <Table>
                           <TableHead>
                              <TableRow
                                 sx={{
                                    bgcolor: "primary.main",
                                    "& th": {
                                       color: "white",
                                       fontWeight: 600,
                                       fontSize: "1rem",
                                       py: 2,
                                    },
                                 }}
                              >
                                 <TableCell>👤 Student Name</TableCell>
                                 <TableCell>📊 Marks</TableCell>
                                 <TableCell>📅 Attendance</TableCell>
                                 <TableCell>📆 Year</TableCell>
                                 <TableCell>⚙️ Actions</TableCell>
                                 <TableCell>⚙️ Send To Parents</TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {data.map((student) => (
                                 <TableRow
                                    key={student.studentId}
                                    sx={{
                                       "&:hover": {
                                          bgcolor: "action.hover",
                                       },
                                       transition: "background-color 0.2s",
                                    }}
                                 >
                                    <TableCell sx={{ fontWeight: 600 }}>
                                       {student.name}
                                    </TableCell>
                                    <TableCell>
                                       {editMode === student.studentId ? (
                                          <TextField
                                             type="text"
                                             value={
                                                updatedMarks[
                                                   student.studentId
                                                ] || student.marks
                                             }
                                             onChange={(e) =>
                                                handleMarksChange(
                                                   e,
                                                   student.studentId
                                                )
                                             }
                                             sx={{
                                                width: "180px",
                                             }}
                                          />
                                       ) : (
                                          <Chip
                                             label={student.marks}
                                             color="primary"
                                             sx={{
                                                fontSize: "1rem",
                                                py: 2,
                                                px: 1,
                                             }}
                                          />
                                       )}
                                    </TableCell>
                                    <TableCell>
                                       <Chip
                                          label={
                                             student.attendance !== null
                                                ? student.attendance
                                                : "N/A"
                                          }
                                          color="info"
                                          sx={{
                                             fontSize: "1rem",
                                             py: 2,
                                             px: 1,
                                          }}
                                       />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                       {student.year}
                                    </TableCell>
                                    <TableCell>
                                       {editMode === student.studentId ? (
                                          <Button
                                             variant="contained"
                                             color="success"
                                             size="medium"
                                             onClick={() =>
                                                handleSave(
                                                   student.studentId,
                                                   student.subjectId
                                                )
                                             }
                                             sx={{
                                                mr: 1,
                                                borderRadius: 2,
                                                boxShadow:
                                                   "0 2px 8px rgba(0,200,83,0.35)",
                                             }}
                                          >
                                             ✅ Save
                                          </Button>
                                       ) : (
                                          <Box
                                             sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 2,
                                             }}
                                          >
                                             <Button
                                                variant="contained"
                                                color="primary"
                                                size="medium"
                                                onClick={() =>
                                                   handleEdit(
                                                      student.studentId,
                                                      student.marks
                                                   )
                                                }
                                                sx={{
                                                   borderRadius: 2,
                                                   boxShadow:
                                                      "0 2px 8px rgba(25,118,210,0.35)",
                                                }}
                                             >
                                                ✏️ Edit
                                             </Button>
                                             <input
                                                type="file"
                                                onChange={handleFileChange}
                                                style={{
                                                   margin: "10px 0",
                                                   padding: "8px",
                                                   border: "1px solid #e0e0e0",
                                                   borderRadius: "8px",
                                                   width: "100%",
                                                }}
                                             />
                                             <Button
                                                variant="contained"
                                                color="warning"
                                                size="medium"
                                                onClick={() =>
                                                   handleUpload(
                                                      student.subjectId,
                                                      student.studentId
                                                   )
                                                }
                                                fullWidth
                                                sx={{
                                                   borderRadius: 2,
                                                   boxShadow:
                                                      "0 2px 8px rgba(237,108,2,0.35)",
                                                }}
                                             >
                                                📤 Upload Notebook
                                             </Button>
                                          </Box>
                                       )}
                                    </TableCell>
                                    <TableCell>
                                       <Box
                                          sx={{
                                             display: "flex",
                                             alignItems: "center",
                                             gap: 1,
                                          }}
                                       >
                                          <Checkbox
                                             checked={
                                                sendToParents[
                                                   student.studentId
                                                ] || false
                                             }
                                             onChange={(e) =>
                                                setSendToParents((prev) => ({
                                                   ...prev,
                                                   [student.studentId]:
                                                      e.target.checked,
                                                }))
                                             }
                                             sx={{
                                                "& .MuiSvgIcon-root": {
                                                   fontSize: 28,
                                                },
                                             }}
                                          />
                                          <Typography
                                             sx={{
                                                fontWeight: 500,
                                             }}
                                          >
                                             Notify Parents
                                          </Typography>
                                       </Box>
                                    </TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     </TableContainer>
                  ) : (
                     <Typography
                        color="text.secondary"
                        textAlign="center"
                        sx={{ py: 4, fontSize: "1.1rem" }}
                     >
                        ⚠️ No data available for the selected year and subject.
                     </Typography>
                  )}
               </Paper>
            </Box>
         </Box>
      </Container>
   );
};

export default TeacherUpdateMarks;
// ======================================================================================================================

//   <div className=" py-12">
//      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <div className="mb-8">
//            <h2 className="text-2xl font-bold text-gray-900">
//               Student Performance Dashboard
//            </h2>
//            <p className="mt-1 text-sm text-gray-500">
//               Update marks, attendance, and communicate with parents
//            </p>
//         </div>

//         {/* Filters Section */}
//         <div className=" p-6 rounded-lg mb-8">
//            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               <div className="md:col-span-1">
//                  <label
//                     htmlFor="year"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                  >
//                     Academic Year
//                  </label>
//                  <select
//                     id="year"
//                     value={year}
//                     onChange={(e) => setYear(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                  >
//                     <option value="">Select Year</option>
//                     <option value="1">1st Year</option>
//                     <option value="2">2nd Year</option>
//                     <option value="3">3rd Year</option>
//                  </select>
//               </div>

//               <div className="md:col-span-2">
//                  <label
//                     htmlFor="subject"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                  >
//                     Subject
//                  </label>
//                  <select
//                     id="subject"
//                     value={subject}
//                     onChange={(e) => setSubject(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md  focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                  >
//                     <option value="">Select Subject</option>
//                     {subjectChoice.map((subjectItem, index) => (
//                        <option key={index} value={subjectItem}>
//                           {subjectItem}
//                        </option>
//                     ))}
//                  </select>
//               </div>

//               <div className="md:col-span-1 flex items-end">
//                  <button
//                     onClick={handleGo}
//                     className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md  transition duration-150 ease-in-out flex items-center justify-center"
//                  >
//                     <svg
//                        xmlns="http://www.w3.org/2000/svg"
//                        className="h-5 w-5 mr-2"
//                        fill="none"
//                        viewBox="0 0 24 24"
//                        stroke="currentColor"
//                     >
//                        <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M4 6h16M4 12h16m-7 6h7"
//                        />
//                     </svg>
//                     Fetch Data
//                  </button>
//               </div>
//            </div>
//         </div>

//         {/* Student Table */}
//         <div className="bg-white  overflow-hidden">
//            {data.length > 0 ? (
//               <div className="overflow-x-auto">
//                  <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                        <tr>
//                           <th
//                              scope="col"
//                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                           >
//                              Student Name
//                           </th>
//                           <th
//                              scope="col"
//                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                           >
//                              Marks
//                           </th>
//                           <th
//                              scope="col"
//                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                           >
//                              Attendance
//                           </th>
//                           <th
//                              scope="col"
//                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                           >
//                              Year
//                           </th>
//                           <th
//                              scope="col"
//                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                           >
//                              Actions
//                           </th>
//                           <th
//                              scope="col"
//                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                           >
//                              Upload Notebook
//                           </th>
//                           <th
//                              scope="col"
//                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                           >
//                              Notifications
//                           </th>
//                        </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                        {data.map((student, index) => (
//                           <tr
//                              key={student.studentId}
//                              className={
//                                 index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                              }
//                           >
//                              <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="flex items-center">
//                                    <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
//                                       <span className="text-gray-500 font-medium">
//                                          {student.name.charAt(0)}
//                                       </span>
//                                    </div>
//                                    <div className="ml-4">
//                                       <div className="text-sm text-gray-500">
//                                          ID: {index}
//                                       </div>
//                                       <div className="text-sm font-medium text-gray-900">
//                                          {student.name}
//                                       </div>
//                                    </div>
//                                 </div>
//                              </td>

//                              <td className="px-6 py-4 whitespace-nowrap">
//                                 {editMode === student.studentId ? (
//                                    <input
//                                       type="text"
//                                       value={
//                                          updatedMarks[student.studentId] ||
//                                          student.marks
//                                       }
//                                       onChange={(e) =>
//                                          handleMarksChange(
//                                             e,
//                                             student.studentId
//                                          )
//                                       }
//                                       className="border border-gray-300 px-3 py-2 rounded-md  focus:ring-2 focus:ring-green-500 focus:border-green-500 w-24"
//                                    />
//                                 ) : (
//                                    <div className="text-sm text-gray-900 font-medium">
//                                       <span
//                                          className={`inline-flex items-center px-3 py-0.5 rounded-full ${
//                                             parseInt(student.marks) >= 70
//                                                ? "bg-green-100 text-green-800"
//                                                : parseInt(student.marks) >=
//                                                  40
//                                                ? "bg-yellow-100 text-yellow-800"
//                                                : "bg-red-100 text-red-800"
//                                          }`}
//                                       >
//                                          {student.marks}
//                                       </span>
//                                    </div>
//                                 )}
//                              </td>

//                              <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-gray-900">
//                                    {student.attendance !== null ? (
//                                       <span
//                                          className={`inline-flex items-center px-3 py-0.5 rounded-full ${
//                                             parseInt(student.attendance) >=
//                                             75
//                                                ? "bg-green-100 text-green-800"
//                                                : "bg-red-100 text-red-800"
//                                          }`}
//                                       >
//                                          {student.attendance}%
//                                       </span>
//                                    ) : (
//                                       <span className="text-gray-500">
//                                          N/A
//                                       </span>
//                                    )}
//                                 </div>
//                              </td>

//                              <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-gray-900">
//                                    Year {student.year}
//                                 </div>
//                              </td>

//                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                 {editMode === student.studentId ? (
//                                    <button
//                                       onClick={() =>
//                                          handleSave(
//                                             student.studentId,
//                                             student.subjectId
//                                          )
//                                       }
//                                       className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out"
//                                    >
//                                       Save
//                                    </button>
//                                 ) : (
//                                    <button
//                                       onClick={() =>
//                                          handleEdit(
//                                             student.studentId,
//                                             student.marks
//                                          )
//                                       }
//                                       className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out"
//                                    >
//                                       Edit
//                                    </button>
//                                 )}
//                              </td>

//                              <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="flex flex-col gap-2">
//                                    <div className="relative border border-gray-300 rounded-md">
//                                       <input
//                                          type="file"
//                                          onChange={handleFileChange}
//                                          className="opacity-0 absolute inset-0 w-full z-10 cursor-pointer"
//                                       />
//                                       <div className="py-2 px-4 text-sm text-gray-500 truncate flex items-center justify-between">
//                                          <span>Choose file</span>
//                                          <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             className="h-5 w-5"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             stroke="currentColor"
//                                          >
//                                             <path
//                                                strokeLinecap="round"
//                                                strokeLinejoin="round"
//                                                strokeWidth={2}
//                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                                             />
//                                          </svg>
//                                       </div>
//                                    </div>
//                                    <button
//                                       onClick={() =>
//                                          handleUpload(
//                                             student.subjectId,
//                                             student.studentId
//                                          )
//                                       }
//                                       className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-2 rounded-md transition duration-150 ease-in-out"
//                                    >
//                                       Upload
//                                    </button>
//                                 </div>
//                              </td>

//                              <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="flex items-center">
//                                    <input
//                                       id={`notify-${student.studentId}`}
//                                       type="checkbox"
//                                       checked={
//                                          sendToParents[student.studentId] ||
//                                          false
//                                       }
//                                       onChange={(e) =>
//                                          setSendToParents((prev) => ({
//                                             ...prev,
//                                             [student.studentId]:
//                                                e.target.checked,
//                                          }))
//                                       }
//                                       className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//                                    />
//                                    <label
//                                       htmlFor={`notify-${student.studentId}`}
//                                       className="mx-1 block text-sm text-gray-900"
//                                    >
//                                       Notify Parents
//                                    </label>
//                                 </div>
//                              </td>
//                           </tr>
//                        ))}
//                     </tbody>
//                  </table>
//               </div>
//            ) : (
//               <div className="py-12 text-center">
//                  <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="mx-auto h-12 w-12 text-gray-400"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                  >
//                     <path
//                        strokeLinecap="round"
//                        strokeLinejoin="round"
//                        strokeWidth={1}
//                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                     />
//                  </svg>
//                  <h3 className="mt-2 text-sm font-medium text-gray-900">
//                     No data available
//                  </h3>
//                  <p className="mt-1 text-sm text-gray-500">
//                     Please select a year and subject to view student data.
//                  </p>
//               </div>
//            )}
//         </div>
//      </div>
//   </div>
