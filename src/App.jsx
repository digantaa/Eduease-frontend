import React, { useEffect, useRef } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

// Layouts
import MainLayout from "./Layout/MainLayout";
import NoNavLayout from "./Layout/NoNavLayout";

// SignalR
import { connection, startConnection } from "./SignalRService";

// Store
import useStore from "./store/store";

// Common Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import AttendanceGrid from "./components/AttendanceGrid";
import Notification from "./components/student/Notification";
import CodeEditor from "./components/student/CodeEditor";

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Error from "./pages/Error";

// Admin Pages
import AdminHome from "./pages/Admin/AdminHome";
import GetAllStudents from "./pages/Admin/GetAllStudents";
import ManageTeachers from "./pages/Admin/ManageTeachers";
import ManageUsers from "./pages/Admin/ManageUsers";
import TimeTable from "./pages/Admin/TimeTable";
import TimeTableDetails from "./pages/Admin/TimeTableDetails";

// Student Pages
import StudentHome from "./pages/Student/StudentHome";
import StudentApplyLeave from "./pages/Student/StudentApplyLeave";
import TestPage from "./pages/Student/TestPage";
import Editor from "./pages/Student/Editor";
import Coding from "./pages/Student/Coding";

// Teacher Pages
import TeacherHome from "./pages/Teacher/TeacherHome";
import Notifications from "./pages/Teacher/Notifications";
import UpdateMarks from "./pages/Teacher/UpdateMarks";

// Parent Pages
import ParentLoginComponent from "./pages/Parent/Component/ParentAuth/ParentLoginComponent";
import ParentMapComponent from "./pages/Parent/Component/ParentMap/ParentMapComponent";
import ParentMapContainer from "./pages/Parent/Component/ParentMap/ParentMapContainer";
import UploadCodingQuestion from "./components/Teacher/UploadCodingQuestion";
import UploadTestCases from "./pages/Teacher/UploadTestCases";
import UploadMockTest from "./pages/Teacher/UploadMockTest";

// Custom styled container for page transitions
const PageContainer = styled(Box)(({ theme }) => ({}));

const App = () => {
  const intervalRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Start heartbeat when the app loads
    startHeartbeat();

    // Track user activity
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    window.addEventListener("click", resetInactivityTimer);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(inactivityTimerRef.current);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      window.removeEventListener("click", resetInactivityTimer);
    };
  }, []);

  const sendHeartbeat = async () => {
    console.log("inside heart beat");
    try {
      const userId = localStorage.getItem("userid");
      if (!userId) {
        console.warn("User ID is missing in localStorage.");
        return;
      }
      const resp = await axios.post(
        `https://localhost:7013/api/Session/heartbeat/${userId}`,
        {},
        {
          withCredentials: true,
        },
      );

      console.log("Heartbeat response:", resp.data);
    } catch (error) {
      console.log("executing this...hb fn in main.jsx");
      localStorage.clear();
      toast.error(error.response.data.message);
      document.cookie = "jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie =
        ".AspNetCore.Session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      navigate("/");
      console.error("Heartbeat error:", error);
    }
  };

  const startHeartbeat = () => {
    if (!intervalRef.current) {
      console.log("User is active. Starting heartbeat...");
      intervalRef.current = setInterval(sendHeartbeat, 1000);
    }
  };

  const stopHeartbeat = () => {
    if (intervalRef.current) {
      console.log("User is inactive. Stopping heartbeat...");
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimerRef.current);
    startHeartbeat();
    inactivityTimerRef.current = setTimeout(() => {
      stopHeartbeat();
    }, 1000); // 30 seconds of inactivity
  };

  return (
    <div className="relative w-screen min-h-max overflow-x-hidden ">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            border: "2px solid #000",
            borderRadius: "8px",
            boxShadow: "4px 4px 0px #000",
            background: "#fff",
            padding: "16px",
            color: "#000",
            fontFamily: "monospace",
          },
        }}
      />

      <PageContainer>
        <Routes>
          {/* Routes inside MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Admin/Home" element={<AdminHome />} />
            <Route path="/Admin/TimeTables" element={<TimeTableDetails />} />
            <Route path="/admin/allstudents" element={<GetAllStudents />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/add-time-table" element={<TimeTable />} />
            <Route path="/admin/teachers" element={<ManageTeachers />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/marks" element={<UpdateMarks />} />
            <Route path="/teacher/home" element={<TeacherHome />} />
            {/*<Route path="/teacher/mocktest" element={<UploadMockTest />} /> */}
            {/* <Route
              path="/teacher/upload/coding"
              element={<UploadCodingQuestion />}
            />
            <Route
              path="/teacher/upload/testcases"
              element={<UploadTestCases />}
            /> */}
            <Route path="/parent/auth" element={<ParentLoginComponent />} />
            <Route path="/parent/tracking" element={<ParentMapContainer />} />
            <Route path="*" element={<Error />} />
          </Route>
          {/* Routes inside MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/editor" element={<Editor />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/student/home" element={<StudentHome />} />
            <Route path="/student/coding" element={<Coding />} />
            <Route path="/student/leavyapply" element={<StudentApplyLeave />} />
          </Route>
        </Routes>
        <Chatbot />
      </PageContainer>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default App;
