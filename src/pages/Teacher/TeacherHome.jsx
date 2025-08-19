import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootswatch/dist/lux/bootstrap.min.css";
import axios from "axios";
import useStore from "../../store/store";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import TeacherUpdateMarks from "../../components/TeacherUpdateMarks";
import Notifications from "./Notifications";
import UpdateMarks from "./UpdateMarks";

import Attendance from "../../components/Teacher/Attendance";
import { connection, startConnection } from "../../SignalRService";
import Navigation from "../../components/Teacher/Navigation";
import TeacherProfile from "../../components/Teacher/TeacherProfile";
import UploadCodingQuestion from "../../components/Teacher/UploadCodingQuestion";
import UploadTestCases from "./UploadTestCases";
import UploadMockTest from "./UploadMockTest";

const TeacherHome = () => {
  const [teacher, setTeacher] = useState(null);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMarks, setShowMarks] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [showUploadMockTest, setShowUploadMockTest] = useState(false);
  const [showUploadCodingQuestion, setShowUploadCodingQuestion] =
    useState(false);
  const [showUploadTestCases, setShowUploadTestCases] = useState(false);
  const navigate = useNavigate();
  const setStoreNotifications = useStore((state) => state.setNotifications);
  const userId = localStorage.getItem("userid");

  // fetching the teacher notifications
  useEffect(() => {
    localStorage.setItem("noofnotifications", pendingApplications?.length);
    setStoreNotifications(pendingApplications?.length || 0);
  }, [pendingApplications]);

  // on teacher home page i need to establish the signalR connection
  useEffect(() => {
    //  connection is fully established before listening to events
    connection
      .start()
      .then(() => console.log("Connected to SignalR hub..."))
      .then(() => {
        setSignalConnection(connection);
      })
      .catch((err) => console.error("Error connecting to hub:", err));

    connection.on("updateNotificationCount", (count, role, message) => {
      if (role === "Student") {
        setNotifications(count);
        toast.success(
          "New Application received " + message.substring(0, 5) + "...",
        );
      } else {
        setNotifications(count);
        if (message == "Approved") {
          toast.success("Your application has been " + message);
        } else {
          toast.error("Your application has been " + message);
        }
      }
    });
  }, []);

  // fetching teacher information
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7013/api/teacher/${userId}`,
          { withCredentials: true },
        );
        const teacherData = response.data.teacherInfo;
        setTeacher({
          image: teacherData.image || "https://via.placeholder.com/150",
          username: teacherData.username,
          email: teacherData.email,
          address: teacherData.address || "Not Provided",
          mobile: teacherData.mobile || "Not Provided",
          year: teacherData.year || "Not Provided",
          semester:
            teacherData.semester !== null
              ? `Semester ${teacherData.semester}`
              : "Not Provided",
          subject: teacherData.subject || "Not Provided",
          subjects:
            Array.isArray(teacherData.subjects) &&
            teacherData.subjects.length > 0
              ? teacherData.subjects.join(", ")
              : "Not Specified",
        });
        setPendingApplications(response.data.applications || []);
      } catch (err) {
        if (err.response?.status === 400) {
          toast.error("You need to login first.");
          navigate("/Login");
        } else if (err.response?.status === 401) {
          toast.error("You are not authorized to use this page.");
          navigate("/Login");
        }
      }
    };
    fetchTeacher();
  }, []);

  return (
    <div className="relative flex flex-col  min-h-screen">
      {/* <div className="min-h-[10vh]"></div> */}
      <div className="relative flex">
        {/* Icon-only Sidebar Navigation */}
        <Navigation
          showHome={showHome}
          showAttendance={showAttendance}
          showMarks={showMarks}
          showNotifications={showNotifications}
          showUploadCodingQuestion={showUploadCodingQuestion}
          setShowHome={setShowHome}
          setShowAttendance={setShowAttendance}
          setShowMarks={setShowMarks}
          setShowNotifications={setShowNotifications}
          setShowUploadCodingQuestion={setShowUploadCodingQuestion}
          showUploadTestCases={showUploadTestCases}
          setShowUploadTestCases={setShowUploadTestCases}
          showUploadMockTest={showUploadMockTest}
          setShowUploadMockTest={setShowUploadMockTest}
        />
        {/* Main Content Area */}
        <div className="ml-16 flex-1 min-h-screen">
          {/* Content */}
          <div className="p-6">
            <div className="mx-auto" style={{ padding: "100px 40px" }}>
              {showHome && <TeacherProfile teacher={teacher} />}
              {showMarks && <UpdateMarks />}
              {showNotifications && <Notifications />}
              {showAttendance && <Attendance />}
              {showUploadCodingQuestion && <UploadCodingQuestion />}
              {showUploadTestCases && <UploadTestCases />}
              {showUploadMockTest && <UploadMockTest />}
            </div>
          </div>
        </div>
      </div>
    </div>

    // /----------------------------------

    //   <div className="relative max-h-[120vh] flex gap-[10vw] bg-white mx-auto mt-20 p-6 mb-16">
    //      <div className="relative">
    //         <Navigation
    //            showHome={showHome}
    //            showAttendance={showAttendance}
    //            showMarks={showMarks}
    //            showNotifications={showNotifications}
    //            setShowHome={setShowHome}
    //            setShowAttendance={setShowAttendance}
    //            setShowMarks={setShowMarks}
    //            setShowNotifications={setShowNotifications}
    //         />
    //      </div>

    //      {/* Conditional Components */}

    //      <div className="mt-6">
    //         {showHome && <TeacherProfile teacher={teacher} />}
    //         {showMarks && <UpdateMarks />}
    //         {showNotifications && <Notifications />}
    //         {showAttendance && <Attendance />}
    //      </div>
    //   </div>
  );
};

export default TeacherHome;
