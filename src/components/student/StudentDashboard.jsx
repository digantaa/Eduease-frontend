import React, { useState, useEffect } from "react";
import {
   BookOpen,
   CalendarDays,
   User,
   GraduationCap,
   FileText,
   Code,
   CheckCircle,
   Clock,
   AlertCircle,
   Award,
   Calendar,
   ChevronRight,
   Book,
   BarChart2,
   Activity,
   PieChart as PieChartIcon,
   TrendingUp,
} from "lucide-react";
import axios from "axios";
import {
   PieChart,
   Pie,
   Cell,
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
   ResponsiveContainer,
   LineChart,
   Line,
   AreaChart,
   Area,
} from "recharts";

const StudentDashboard = ({ studentData }) => {
   const [data, setData] = useState(null);

   const userId = localStorage.getItem("userid");

   const fetchDashboard = async () => {
      try {
         const resp = await axios.get(
            `https://localhost:7013/api/Student/Dashboard?studentId=${userId}`,
            { withCredentials: true }
         );
         setData(resp.data);
         console.log("🚀 ~ fetchDashboard ~ resp:", resp);
      } catch (error) {
         console.error("Error fetching student data", error);
      }
   };

   useEffect(() => {
      fetchDashboard();
   }, []);

   if (!data) {
      return (
         <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="flex flex-col items-center space-y-4">
               <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
               <p className="text-gray-600 font-medium">
                  Loading your dashboard...
               </p>
            </div>
         </div>
      );
   }

   // Calculate mock test statistics
   const mockTests = data.mockTests || [];
   const completedTests = mockTests.filter(
      (test) => test.status === "Completed"
   );
   const pendingTests = mockTests.filter((test) => test.status === "Pending");

   const totalScore = completedTests.reduce((sum, test) => sum + test.score, 0);
   const totalPossibleScore = completedTests.reduce(
      (sum, test) => sum + test.totalMarks,
      0
   );
   const averagePercentage =
      totalPossibleScore > 0
         ? Math.round((totalScore / totalPossibleScore) * 100)
         : 0;

   // Helper function to get color based on percentage
   const getScoreColor = (percentage) => {
      if (percentage >= 75) return "text-emerald-600";
      if (percentage >= 50) return "text-amber-600";
      return "text-rose-600";
   };

   // Get progress bar color based on percentage
   const getProgressBarColor = (percentage) => {
      if (percentage >= 75) return "bg-emerald-600";
      if (percentage >= 50) return "bg-amber-500";
      return "bg-rose-500";
   };

   // Format attendance data for display
   const currentMonth = new Date().getMonth() + 1;
   const currentAttendance = data.attendanceSummary?.find(
      (record) => record.attendanceMonth === currentMonth
   );

   // Process coding progress data
   const codingProgress = {
      total: data.totalCodingQuestions || 0,
      completed: data.completedCodingQuestions || 0,
      attempted: data.attemptedCodingQuestions || 0,
      pending: data.pendingCodingQuestions || 0,
   };

   const codingCompletionPercentage =
      codingProgress.total > 0
         ? Math.round((codingProgress.completed / codingProgress.total) * 100)
         : 0;

   // Prepare chart data
   const pieChartData = [
      { name: "Completed", value: codingProgress.completed, color: "#10B981" },
      { name: "Attempted", value: codingProgress.attempted, color: "#F59E0B" },
      { name: "Pending", value: codingProgress.pending, color: "#EF4444" },
   ];

   const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

   // Subject performance data for bar chart
   const subjectPerformanceData = completedTests.reduce((acc, test) => {
      const percentage = Math.round((test.score / test.totalMarks) * 100);

      // Check if subject already exists in accumulator
      const existingSubject = acc.find((item) => item.subject === test.subject);

      if (existingSubject) {
         // Update existing subject with average percentage
         const totalPercentage =
            existingSubject.percentage * existingSubject.count + percentage;
         existingSubject.count += 1;
         existingSubject.percentage = Math.round(
            totalPercentage / existingSubject.count
         );
      } else {
         // Add new subject
         acc.push({
            subject: test.subject,
            percentage: percentage,
            count: 1,
         });
      }

      return acc;
   }, []);

   // Monthly attendance data for line chart
   const monthlyAttendanceData =
      data.attendanceSummary?.map((record) => ({
         month: new Date(2000, record.attendanceMonth - 1).toLocaleString(
            "default",
            { month: "short" }
         ),
         attendance: Math.round((record.totalPresents / 20) * 100),
      })) || [];

   // Mock data for area chart - GPA trend
   const gpaTrendData = [
      { month: "Jan", gpa: 3.6 },
      { month: "Feb", gpa: 3.7 },
      { month: "Mar", gpa: 3.5 },
      { month: "Apr", gpa: 3.8 },
      { month: "May", gpa: data.gpa },
   ];

   // Subject-wise attendance data
   const subjectAttendanceData = [
      { subject: "Mathematics", attendance: 85 },
      { subject: "Physics", attendance: 90 },
      { subject: "Chemistry", attendance: 78 },
      { subject: "Computer Science", attendance: 95 },
   ];

   // GPA by year data
   const semesterGpaData = [
      { semester: "Year 1", gpa: 3.7 },
      { semester: "Year 2", gpa: 3.5 },
      { semester: "Year 3", gpa: 3.8 },
      { semester: "Year 4", gpa: data.gpa },
   ];

   return (
      <>
         {/* Redesigned Student Dashboard with improved organization and hierarchy */}
         <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
               {/* Page Header */}
               <header className="bg-white p-6 rounded-lg  mb-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-center">
                     <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                           Welcome, {studentData.name}
                        </h1>
                        <p className="text-gray-600">
                           Advent University - BTech
                        </p>
                     </div>
                     <div className="mt-4 md:mt-0 flex space-x-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                           GPA: {data.gpa}
                        </span>
                        <span
                           className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              averagePercentage >= 75
                                 ? "bg-green-100 text-green-800"
                                 : averagePercentage >= 50
                                 ? "bg-yellow-100 text-yellow-800"
                                 : "bg-red-100 text-red-800"
                           }`}
                        >
                           Tests: {averagePercentage}%
                        </span>
                     </div>
                  </div>
               </header>

               {/* Dashboard Content */}
               <div className="space-y-6">
                  {/* Key Stats Row */}
                  <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-white rounded-lg p-6 flex items-center ">
                        <div className="rounded-full bg-blue-100 p-3 mr-4">
                           <Activity className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                           <p className="text-sm text-gray-500">Current GPA</p>
                           <p className="text-2xl font-bold">{data.gpa}</p>
                        </div>
                     </div>

                     <div className="bg-white rounded-lg p-6 flex items-center ">
                        <div className="rounded-full bg-green-100 p-3 mr-4">
                           <Award className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                           <p className="text-sm text-gray-500">Test Average</p>
                           <p className="text-2xl font-bold">
                              {averagePercentage}%
                           </p>
                        </div>
                     </div>

                     <div className="bg-white rounded-lg p-6 flex items-center ">
                        <div className="rounded-full bg-purple-100 p-3 mr-4">
                           <Calendar className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                           <p className="text-sm text-gray-500">Attendance</p>
                           <p className="text-2xl font-bold">
                              {currentAttendance?.totalPresents || 0}/20
                           </p>
                        </div>
                     </div>
                  </section>

                  {/* Primary Charts Section */}
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* GPA Trend Chart */}
                     <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-4 bg-[#1F2122] rounded-t-lg">
                           <h2 className="text-lg font-semibold flex gap-2 items-center text-white">
                              <TrendingUp className="h-5 w-5" />
                              GPA Trend
                           </h2>
                        </div>
                        <div className="p-4">
                           <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart
                                    data={gpaTrendData}
                                    margin={{
                                       top: 10,
                                       right: 30,
                                       left: 0,
                                       bottom: 0,
                                    }}
                                 >
                                    <defs>
                                       <linearGradient
                                          id="colorGpa"
                                          x1="0"
                                          y1="0"
                                          x2="0"
                                          y2="1"
                                       >
                                          <stop
                                             offset="5%"
                                             stopColor="#8884d8"
                                             stopOpacity={0.8}
                                          />
                                          <stop
                                             offset="95%"
                                             stopColor="#8884d8"
                                             stopOpacity={0}
                                          />
                                       </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis domain={[3, 4]} />
                                    <Tooltip />
                                    <Area
                                       type="monotone"
                                       dataKey="gpa"
                                       stroke="#8884d8"
                                       fillOpacity={1}
                                       fill="url(#colorGpa)"
                                    />
                                 </AreaChart>
                              </ResponsiveContainer>
                           </div>
                        </div>
                     </div>

                     {/* Subject Performance Bar Chart */}
                     <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-4 bg-[#1F2122] rounded-t-lg">
                           <h2 className="text-lg font-semibold text-white">
                              Subject Performance
                           </h2>
                        </div>
                        <div className="p-4">
                           <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                 <BarChart
                                    data={subjectPerformanceData}
                                    margin={{
                                       top: 5,
                                       right: 30,
                                       left: 20,
                                       bottom: 5,
                                    }}
                                 >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="subject" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                       dataKey="percentage"
                                       fill="#8884d8"
                                       name="Score %"
                                    />
                                 </BarChart>
                              </ResponsiveContainer>
                           </div>
                        </div>
                     </div>
                  </section>

                  {/* Academic Progress Section */}
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Mock Test Scores */}
                     <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-4 bg-[#1F2122] rounded-t-lg">
                           <h2 className="text-lg font-semibold text-white">
                              Mock Test Scores
                           </h2>
                        </div>
                        <div className="p-4">
                           <div className="space-y-4">
                              {mockTests.slice(0, 4).map((test, index) => (
                                 <div
                                    key={index}
                                    className="flex items-center justify-between"
                                 >
                                    <div className="flex items-center">
                                       <div
                                          className={`w-2 h-10 rounded-sm ${
                                             test.status === "Completed"
                                                ? "bg-indigo-600"
                                                : "bg-gray-300"
                                          }`}
                                       ></div>
                                       <div className="ml-3">
                                          <h4 className="text-sm font-medium">
                                             {test.subject}
                                          </h4>
                                          <p className="text-xs text-gray-500">
                                             Yr {test.year} • {test.teacherName}
                                          </p>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       {test.status === "Completed" ? (
                                          <div className="flex flex-col items-end">
                                             <p
                                                className={`text-sm font-medium ${
                                                   (test.score /
                                                      test.totalMarks) *
                                                      100 >=
                                                   75
                                                      ? "text-emerald-600"
                                                      : (test.score /
                                                           test.totalMarks) *
                                                           100 >=
                                                        50
                                                      ? "text-amber-600"
                                                      : "text-rose-600"
                                                }`}
                                             >
                                                {test.score}/{test.totalMarks}
                                             </p>
                                             <p className="text-xs text-gray-500">
                                                {Math.round(
                                                   (test.score /
                                                      test.totalMarks) *
                                                      100
                                                )}
                                                %
                                             </p>
                                          </div>
                                       ) : (
                                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                             Pending
                                          </span>
                                       )}
                                    </div>
                                 </div>
                              ))}
                           </div>
                           {mockTests.length > 4 && (
                              <div className="mt-4 text-center">
                                 <button className="text-sm text-indigo-600 font-medium flex items-center justify-center">
                                    View all {mockTests.length} tests
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                 </button>
                              </div>
                           )}
                        </div>
                     </div>

                     {/* Upcoming Tests */}
                     <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-4 bg-[#1F2122] rounded-t-lg">
                           <h2 className="text-lg font-semibold flex items-center text-white">
                              <FileText className="h-5 w-5 mr-2" />
                              Upcoming Tests
                           </h2>
                        </div>
                        <div className="p-4">
                           <div className="space-y-4">
                              {pendingTests.slice(0, 3).map((test, index) => (
                                 <div
                                    key={index}
                                    className="flex items-center justify-between"
                                 >
                                    <div className="flex items-center">
                                       <div className="rounded-full bg-indigo-100 p-2 mr-3">
                                          <Clock className="h-4 w-4 text-indigo-600" />
                                       </div>
                                       <div>
                                          <h4 className="text-sm font-medium">
                                             {test.subject}
                                          </h4>
                                          <p className="text-xs text-gray-500">
                                             {test.date} • {test.teacherName}
                                          </p>
                                       </div>
                                    </div>
                                    <div>
                                       <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                          {test.status}
                                       </span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                           {pendingTests.length === 0 && (
                              <div className="flex flex-col items-center justify-center py-8">
                                 <CheckCircle className="h-12 w-12 text-green-600 mb-2" />
                                 <p className="text-gray-500">
                                    No upcoming tests
                                 </p>
                              </div>
                           )}
                        </div>
                     </div>
                  </section>

                  {/* Attendance & Coding Section */}
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Attendance Charts */}
                     <div className="grid grid-cols-1 gap-6">
                        {/* Monthly Attendance */}
                        <div className="bg-white rounded-lg shadow-sm">
                           <div className="p-4 bg-[#1F2122] rounded-t-lg">
                              <h2 className="text-lg font-semibold flex items-center text-white">
                                 <CalendarDays className="h-5 w-5 mr-2" />
                                 Attendance Tracker
                              </h2>
                           </div>
                           <div className="p-4">
                              <div className="h-64">
                                 <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                 >
                                    <LineChart
                                       data={monthlyAttendanceData}
                                       margin={{
                                          top: 5,
                                          right: 30,
                                          left: 20,
                                          bottom: 5,
                                       }}
                                    >
                                       <CartesianGrid strokeDasharray="3 3" />
                                       <XAxis dataKey="month" />
                                       <YAxis domain={[0, 100]} />
                                       <Tooltip />
                                       <Legend />
                                       <Line
                                          type="monotone"
                                          dataKey="attendance"
                                          stroke="#8884d8"
                                          activeDot={{ r: 8 }}
                                          name="Attendance %"
                                       />
                                    </LineChart>
                                 </ResponsiveContainer>
                              </div>
                           </div>
                        </div>

                        {/* Subject-wise Attendance */}
                        <div className="bg-white rounded-lg shadow-sm">
                           <div className="p-4 bg-[#1F2122] rounded-t-lg">
                              <h2 className="text-lg font-semibold flex items-center text-white">
                                 <BarChart2 className="h-5 w-5 mr-2" />
                                 Subject-wise Attendance
                              </h2>
                           </div>
                           <div className="p-4">
                              <div className="h-64">
                                 <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                 >
                                    <BarChart
                                       data={subjectAttendanceData}
                                       margin={{
                                          top: 5,
                                          right: 30,
                                          left: 20,
                                          bottom: 5,
                                       }}
                                       layout="vertical"
                                    >
                                       <CartesianGrid strokeDasharray="3 3" />
                                       <XAxis type="number" domain={[0, 100]} />
                                       <YAxis
                                          type="category"
                                          dataKey="subject"
                                       />
                                       <Tooltip />
                                       <Legend />
                                       <Bar
                                          dataKey="attendance"
                                          fill="#82ca9d"
                                          name="Attendance %"
                                       />
                                    </BarChart>
                                 </ResponsiveContainer>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Coding & GPA Section */}
                     <div className="grid grid-cols-1 gap-6">
                        {/* Coding Progress */}
                        <div className="bg-white rounded-lg shadow-sm">
                           <div className="p-4 bg-[#1F2122] rounded-t-lg">
                              <h2 className="text-lg font-semibold flex items-center text-white">
                                 <Code className="h-5 w-5 mr-2" />
                                 Coding Progress
                              </h2>
                           </div>
                           <div className="p-4">
                              <div className="mb-4">
                                 <div className="flex justify-between mb-1">
                                    <p className="text-sm font-medium">
                                       Completion Rate
                                    </p>
                                    <p className="text-sm font-medium">
                                       {codingCompletionPercentage}%
                                    </p>
                                 </div>
                                 <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                       className={`h-2 rounded-full ${getProgressBarColor(
                                          codingCompletionPercentage
                                       )}`}
                                       style={{
                                          width: `${codingCompletionPercentage}%`,
                                       }}
                                    ></div>
                                 </div>
                              </div>

                              <div className="mt-4">
                                 <div className="h-48">
                                    <ResponsiveContainer
                                       width="100%"
                                       height="100%"
                                    >
                                       <PieChart>
                                          <Pie
                                             data={pieChartData}
                                             cx="50%"
                                             cy="50%"
                                             labelLine={false}
                                             outerRadius={80}
                                             fill="#8884d8"
                                             dataKey="value"
                                             label={({ name, percent }) =>
                                                `${name} ${(
                                                   percent * 100
                                                ).toFixed(0)}%`
                                             }
                                          >
                                             {pieChartData.map(
                                                (entry, index) => (
                                                   <Cell
                                                      key={`cell-${index}`}
                                                      fill={
                                                         COLORS[
                                                            index %
                                                               COLORS.length
                                                         ]
                                                      }
                                                   />
                                                )
                                             )}
                                          </Pie>
                                          <Tooltip />
                                       </PieChart>
                                    </ResponsiveContainer>
                                 </div>
                              </div>

                              <div className="mt-4 flex justify-between text-sm">
                                 <div className="flex items-center">
                                    <span className="h-3 w-3 bg-emerald-500 rounded-full mr-1"></span>
                                    <span>
                                       Completed: {codingProgress.completed}
                                    </span>
                                 </div>
                                 <div className="flex items-center">
                                    <span className="h-3 w-3 bg-amber-500 rounded-full mr-1"></span>
                                    <span>
                                       Attempted: {codingProgress.attempted}
                                    </span>
                                 </div>
                                 <div className="flex items-center">
                                    <span className="h-3 w-3 bg-rose-500 rounded-full mr-1"></span>
                                    <span>
                                       Pending: {codingProgress.pending}
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Semester GPA */}
                        <div className="bg-white rounded-lg shadow-sm">
                           <div className="p-4 bg-[#1F2122] rounded-t-lg">
                              <h2 className="text-lg font-semibold flex items-center text-white">
                                 <GraduationCap className="h-5 w-5 mr-2" />
                                 Semester GPA
                              </h2>
                           </div>
                           <div className="p-4">
                              <div className="h-64">
                                 <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                 >
                                    <BarChart
                                       data={semesterGpaData}
                                       margin={{
                                          top: 5,
                                          right: 30,
                                          left: 20,
                                          bottom: 5,
                                       }}
                                    >
                                       <CartesianGrid strokeDasharray="3 3" />
                                       <XAxis dataKey="semester" />
                                       <YAxis domain={[3, 4]} />
                                       <Tooltip />
                                       <Legend />
                                       <Bar
                                          dataKey="gpa"
                                          fill="#8884d8"
                                          name="GPA"
                                       />
                                    </BarChart>
                                 </ResponsiveContainer>
                              </div>
                           </div>
                        </div>
                     </div>
                  </section>
               </div>
            </div>
         </div>
      </>
   );
};

export default StudentDashboard;
