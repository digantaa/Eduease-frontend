// import React, { useState, useEffect } from "react";
// import { PieChart } from "@mui/x-charts/PieChart";
// import {
//    Card,
//    CardContent,
//    Typography,
//    Table,
//    TableBody,
//    TableCell,
//    TableContainer,
//    TableHead,
//    TableRow,
//    Select,
//    MenuItem,
//    CircularProgress,
// } from "@mui/material";
// import { BookOpen } from "lucide-react";

// const StudentResult = () => {
//    const [selectedYear, setSelectedYear] = useState(null);
//    const [studentData, setStudentData] = useState([]);
//    const [loading, setLoading] = useState(false);

//    useEffect(() => {
//       const fetchMarks = async () => {
//          if (selectedYear !== null) {
//             setLoading(true);
//             try {
//                const response = await fetch(
//                   `https://localhost:7013/api/Student/getMarks?studentId=${localStorage.getItem(
//                      "userid"
//                   )}&Year=${selectedYear}`,
//                   { credentials: "include" }
//                );
//                const data = await response.json();
//                setStudentData(data);
//             } catch (error) {
//                console.error("Error fetching student marks:", error);
//             } finally {
//                setLoading(false);
//             }
//          }
//       };

//       fetchMarks();
//    }, [selectedYear]);

//    const handleNoteBook = (resultPdf) => {
//       window.open(`https://localhost:7013/uploads/${resultPdf}`, "_blank");
//    };

//    const getGradeColor = (marks) => {
//       if (marks >= 90) return "text-green-600";
//       if (marks >= 80) return "text-blue-600";
//       if (marks >= 70) return "text-yellow-600";
//       return "text-red-600";
//    };

//    return (
//       <div className="min-h-[80vh] p-8">
//          <div className="max-w-7xl mx-auto gap-3">
//             <Typography
//                variant="h4"
//                className="text-center font-bold text-white mb-8"
//             >
//                Academic Performance Dashboard
//             </Typography>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                {/* Main Results Card */}
//                <div className="lg:col-span-2">
//                   <Card className="shadow-xl rounded-xl bg-white overflow-hidden">
//                      <CardContent className="p-6">
//                         {/* Year Selection */}
//                         <div className="flex justify-between items-center mb-8">
//                            <Typography variant="h6" className="text-gray-700">
//                               Student Marks Overview
//                            </Typography>
//                            <Select
//                               value={selectedYear || ""}
//                               onChange={(e) =>
//                                  setSelectedYear(Number(e.target.value))
//                               }
//                               className="min-w-[200px] bg-gray-50"
//                               displayEmpty
//                            >
//                               <MenuItem value="">Select Academic Year</MenuItem>
//                               <MenuItem value={1}>Year 1</MenuItem>
//                               <MenuItem value={2}>Year 2</MenuItem>
//                               <MenuItem value={3}>Year 3</MenuItem>
//                               <MenuItem value={4}>Year 4</MenuItem>
//                            </Select>
//                         </div>

//                         {/* Results Table */}
//                         {loading ? (
//                            <div className="flex justify-center items-center h-64">
//                               <CircularProgress />
//                            </div>
//                         ) : (
//                            <TableContainer className="shadow-sm rounded-lg">
//                               <Table>
//                                  <TableHead>
//                                     <TableRow className="bg-blue-50">
//                                        <TableCell className="font-semibold">
//                                           Subject
//                                        </TableCell>
//                                        <TableCell className="font-semibold">
//                                           Marks
//                                        </TableCell>
//                                        <TableCell className="font-semibold">
//                                           Notebook
//                                        </TableCell>
//                                     </TableRow>
//                                  </TableHead>
//                                  <TableBody>
//                                     {studentData.length > 0 ? (
//                                        studentData.map((item) => (
//                                           <TableRow
//                                              key={item.subjectId}
//                                              className="hover:bg-gray-50 transition-colors"
//                                           >
//                                              <TableCell className="font-medium">
//                                                 {item.subjectName}
//                                              </TableCell>
//                                              <TableCell>
//                                                 <span
//                                                    className={`font-semibold ${getGradeColor(
//                                                       item.marks
//                                                    )}`}
//                                                 >
//                                                    {item.marks}%
//                                                 </span>
//                                              </TableCell>
//                                              <TableCell>
//                                                 {item.resultPdf ? (
//                                                    <button
//                                                       onClick={() =>
//                                                          handleNoteBook(
//                                                             item.resultPdf
//                                                          )
//                                                       }
//                                                       className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//                                                    >
//                                                       <BookOpen size={16} />
//                                                       View Notebook
//                                                    </button>
//                                                 ) : (
//                                                    <span className="text-gray-400 italic">
//                                                       Not available
//                                                    </span>
//                                                 )}
//                                              </TableCell>
//                                           </TableRow>
//                                        ))
//                                     ) : (
//                                        <TableRow>
//                                           <TableCell
//                                              colSpan={3}
//                                              className="text-center text-gray-500 py-12"
//                                           >
//                                              {selectedYear === null
//                                                 ? "Please select an academic year to view results"
//                                                 : "No results available for this academic year"}
//                                           </TableCell>
//                                        </TableRow>
//                                     )}
//                                  </TableBody>
//                               </Table>
//                            </TableContainer>
//                         )}
//                      </CardContent>
//                   </Card>
//                </div>

//                {/* Performance Distribution Card */}
//                <div className="lg:col-span-1">
//                   <Card className="shadow-xl rounded-xl bg-white h-full">
//                      <CardContent className="p-6">
//                         <Typography variant="h6" className="text-gray-700 mb-6">
//                            Performance Distribution
//                         </Typography>
//                         {loading ? (
//                            <div className="flex justify-center items-center h-64">
//                               <CircularProgress />
//                            </div>
//                         ) : studentData.length > 0 ? (
//                            <div className="flex justify-center">
//                               <PieChart
//                                  series={[
//                                     {
//                                        data: studentData.map((item, index) => ({
//                                           id: index,
//                                           value: item.marks,
//                                           label: item.subjectName,
//                                        })),
//                                        highlightScope: {
//                                           faded: "global",
//                                           highlighted: "item",
//                                        },
//                                        faded: {
//                                           innerRadius: 30,
//                                           additionalRadius: -30,
//                                        },
//                                     },
//                                  ]}
//                                  width={400}
//                                  height={300}
//                               />
//                            </div>
//                         ) : (
//                            <div className="flex justify-center items-center h-64 text-gray-500 text-center">
//                               Select an academic year to view performance
//                               distribution
//                            </div>
//                         )}
//                      </CardContent>
//                   </Card>
//                </div>
//             </div>
//          </div>
//       </div>
//    );
// };

// export default StudentResult;




import React, { useState, useEffect } from "react";
import {
  BookOpen,
  ChevronDown,
  GraduationCap,
  CircleCheck,
  AlertCircle,
  BarChart3
} from "lucide-react";

const StudentResult = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchMarks = async () => {
      if (selectedYear !== null) {
        setLoading(true);
        try {
          const response = await fetch(
            `https://localhost:7013/api/Student/getMarks?studentId=${localStorage.getItem(
              "userid"
            )}&Year=${selectedYear}`,
            { credentials: "include" }
          );
          const data = await response.json();
          setStudentData(data);
        } catch (error) {
          console.error("Error fetching student marks:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMarks();
  }, [selectedYear]);

  const handleNoteBook = (resultPdf) => {
    window.open(`https://localhost:7013/uploads/${resultPdf}`, "_blank");
  };

  const getGradeColor = (marks) => {
    if (marks >= 90) return "bg-emerald-100 text-emerald-700";
    if (marks >= 80) return "bg-blue-100 text-blue-700";
    if (marks >= 70) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  const getBadgeIcon = (marks) => {
    if (marks >= 90) return <CircleCheck className="w-4 h-4" />;
    if (marks >= 80) return <GraduationCap className="w-4 h-4" />;
    if (marks >= 70) return <BookOpen className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getOverallPerformance = () => {
    if (!studentData.length) return null;

    const average = studentData.reduce((sum, item) => sum + item.marks, 0) / studentData.length;

    let status = "Needs Improvement";
    let statusColor = "text-red-500";

    if (average >= 90) {
      status = "Excellent";
      statusColor = "text-emerald-500";
    } else if (average >= 80) {
      status = "Very Good";
      statusColor = "text-blue-500";
    } else if (average >= 70) {
      status = "Satisfactory";
      statusColor = "text-amber-500";
    }

    return {
      average: average.toFixed(1),
      status,
      statusColor
    };
  };

  const performance = getOverallPerformance();

  return (
    <div className="max-w-7xl mx-auto min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <GraduationCap className="mr-2 h-6 w-6 text-indigo-600" />
            Academic Dashboard
          </h1> */}

          {/* Year Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between w-48 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50"
            >
              <span className="text-slate-700">
                {selectedYear ? `Year ${selectedYear}` : "Select Year"}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg">
                <ul>
                  {[1, 2, 3, 4].map((year) => (
                    <li key={year}>
                      <button
                        onClick={() => {
                          setSelectedYear(year);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-slate-50 ${
                          selectedYear === year ? "bg-indigo-50 text-indigo-600" : "text-slate-700"
                        }`}
                      >
                        Year {year}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Results Panel */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center">
              <BarChart3 className="w-4 h-4 text-indigo-600 mr-2" />
              <h2 className="font-semibold text-slate-800">Performance Overview</h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {studentData.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left font-medium text-slate-600 px-4 py-3">Subject</th>
                        <th className="text-left font-medium text-slate-600 px-4 py-3">Marks</th>
                        <th className="text-left font-medium text-slate-600 px-4 py-3">Notebook</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentData.map((item, index) => (
                        <tr
                          key={item.subjectId}
                          className={`hover:bg-slate-50 ${index !== studentData.length - 1 ? 'border-b border-slate-100' : ''}`}
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-800">{item.subjectName}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(item.marks)}`}>
                                {getBadgeIcon(item.marks)}
                                {item.marks}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {item.resultPdf ? (
                              <button
                                onClick={() => handleNoteBook(item.resultPdf)}
                                className="inline-flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 text-sm"
                              >
                                <BookOpen className="w-3 h-3" />
                                View
                              </button>
                            ) : (
                              <span className="text-slate-400 text-sm">Not available</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <BookOpen className="h-10 w-10 text-slate-300 mb-3" />
                    <p className="text-slate-500">
                      {selectedYear === null
                        ? "Please select an academic year"
                        : "No results available for this year"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Performance Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center">
                <GraduationCap className="w-4 h-4 text-indigo-600 mr-2" />
                <h2 className="font-semibold text-slate-800">Performance Summary</h2>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="w-6 h-6 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
              ) : studentData.length > 0 && performance ? (
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Average Score</p>
                      <p className="text-2xl font-bold text-slate-800">{performance.average}%</p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg ${performance.statusColor.replace('text-', 'bg-').replace('-500', '-100')}`}>
                      <p className={`text-sm font-semibold ${performance.statusColor}`}>{performance.status}</p>
                    </div>
                  </div>

                  {/* Distribution bars */}
                  <div className="space-y-3 mt-4">
                    <p className="text-sm font-medium text-slate-600">Grade Distribution</p>

                    {studentData.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-600 truncate max-w-[180px]">{item.subjectName}</span>
                          <span className={`font-medium ${getGradeColor(item.marks).split(' ')[1]}`}>{item.marks}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div
                            className={`${getGradeColor(item.marks).split(' ')[0].replace('bg-', 'bg-').replace('-100', '-500')} h-1.5 rounded-full`}
                            style={{ width: `${item.marks}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <BarChart3 className="h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-slate-500 text-sm">Select a year to view summary</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResult;
