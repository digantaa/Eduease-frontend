import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import STUDENTPROFILEAPI from "../../utils/STUDENTPROFILEAPI";
import useStore from "../../store/store";
import {
   Bell,
   House,
   LibraryBig,
   Calendar,
   NotebookPen,
   Code,
   BookOpenText,
   Menu,
   X,
   LogOut,
} from "lucide-react";
// Components
import Notification from "../../components/student/Notification";
import StudentProfile from "../../components/student/StudentProfile";
import StudentResult from "../../components/student/StudentResult";
import StudentApplyLeave from "./StudentApplyLeave";
import AttendanceGrid from "../../components/AttendanceGrid";
import MockTests from "../../components/student/MockTests";
import Coding from "./Coding";
import StudentDashboard from "../../components/student/StudentDashboard";
import Sidebar from "../../components/student/SideBar";
import toast, { Toaster } from "react-hot-toast";
import { connection, startConnection } from "../../SignalRService";

function StudentHome() {
   const navigate = useNavigate();
   const [openSideBar, setOpenSideBar] = useState(true);
   const [studentData, setStudentData] = useState({
      name: "",
      imagePath: "",
      email: "",
      dateOfBirth: "",
      address: "",
      enrolledDate: "",
      phoneNumber: "",
   });
   const [activeIcon, setActiveIcon] = useState("dashboard");
   const [notifications, setNotifications] = useState([]);
   const [noNotificationsMessage, setNoNotificationsMessage] = useState("");
   const storeNotifications = useStore((state) => state.setNotifications);
   const [activeView, setActiveView] = useState("");
   const [tooltipVisible, setTooltipVisible] = useState(null);
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [userProfile, setUserProfile] = useState(null);
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const user = localStorage.getItem("user");
   const role = localStorage.getItem("role");
   const { signalConnection, setSignalConnection } = useStore.getState();

   useEffect(() => {
      const userProfileData = localStorage.getItem("userProfile");

      if (user) {
         setIsLoggedIn(true);
         try {
            setUserProfile(JSON.parse(userProfileData));
         } catch (error) {
            console.error("Error parsing user profile", error);
         }
      }
   }, [notifications, user]);

   // on user home page i need to establish the signalR connection
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
               "New Application received " + message.substring(0, 5) + "..."
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

   useEffect(() => {
      const fetchStudentData = async () => {
         try {
            const userId = localStorage.getItem("userid");
            if (userId) {
               const resp = await STUDENTPROFILEAPI(userId);

               if (resp) {
                  setStudentData(resp.studentInfo);
                  setNotifications(resp.notifications);
                  storeNotifications(resp.notifications.length);
                  setNoNotificationsMessage(
                     resp.notifications?.length === 0
                        ? "No notifications available"
                        : ""
                  );
               }
            }
         } catch (error) {
            console.error("Error fetching student data:", error);
         }
      };

      fetchStudentData();
   }, [storeNotifications]);

   // Handle marking notifications as read
   const handleMarkAsRead = useCallback(
      async (notificationId) => {
         try {
            const userId = localStorage.getItem("userid");
            if (userId) {
               const response = await axios.delete(
                  `https://localhost:7013/api/student/markasread/${notificationId}`,
                  {
                     headers: { "Content-Type": "application/json" },
                     data: { userId: userId },
                     withCredentials: true,
                  }
               );

               if (response.status === 200) {
                  setNotifications((prevNotifications) => {
                     const updatedNotifications = prevNotifications.filter(
                        (notif) => notif.id !== notificationId
                     );
                     storeNotifications(updatedNotifications.length);

                     if (updatedNotifications.length === 0) {
                        setNoNotificationsMessage("No notifications available");
                     }

                     return updatedNotifications;
                  });
               } else {
                  console.error("Error deleting notification");
               }
            }
         } catch (error) {
            console.error("Error deleting notification:", error);
         }
      },
      [notifications, storeNotifications]
   );

   // Helper function to switch views
   const switchView = (view) => {
      setActiveView(view);
   };

   // Navigation menu items with icons
   const menuItems = [
      {
         id: "dashboard",
         label: "Dashboard",
         icon: (
            <House
               size={`${activeIcon == "dashboard" ? 30 : 20}`}
               color={`${activeIcon == "dashboard" ? "blue" : "gray"}`}
            />
         ),
      },
      {
         id: "notifications",
         label: "Notifications",
         icon: (
            <Bell
               size={`${activeIcon == "notifications" ? 30 : 20}`}
               color={`${activeIcon == "notifications" ? "blue" : "gray"}`}
            />
         ),
         badge: notifications.length || null,
      },
      {
         id: "results",
         label: "Result",
         icon: (
            <LibraryBig
               size={`${activeIcon == "results" ? 30 : 20}`}
               color={`${activeIcon == "results" ? "blue" : "gray"}`}
            />
         ),
      },
      {
         id: "leave",
         label: "Apply For Leave",
         icon: (
            <Calendar
               size={`${activeIcon == "leave" ? 30 : 20}`}
               color={`${activeIcon == "leave" ? "blue" : "gray"}`}
            />
         ),
      },
      {
         id: "attendance",
         label: "Attendance",
         icon: (
            <NotebookPen
               size={`${activeIcon == "attendance" ? 30 : 20}`}
               color={`${activeIcon == "attendance" ? "blue" : "gray"}`}
            />
         ),
      },
      {
         id: "mockTest",
         label: "Mock Tests",
         icon: (
            <BookOpenText
               size={`${activeIcon == "mockTest" ? 30 : 20}`}
               color={`${activeIcon == "mockTest" ? "blue" : "gray"}`}
            />
         ),
      },
      {
         id: "codeEditor",
         label: "Code Editor",
         icon: (
            <Code
               size={`${activeIcon == "codeEditor" ? 30 : 20}`}
               color={`${activeIcon == "codeEditor" ? "blue" : "gray"}`}
            />
         ),
      },
      {
         id: "profile",
         label: "Profile",
         icon: (
            <img
               src={
                  studentData.imagePath
                     ? `https://localhost:7013/${studentData.imagePath.replace(
                          /\\/g,
                          "/"
                       )}`
                     : "https://via.placeholder.com/150"
               }
               alt={studentData.name || "Student Profile"}
               className="w-10 h-10 rounded-full border-4 border-white object-cover shadow-lg"
               style={{ borderRadius: "full" }}
            />
         ),
      },
      {
         id: "logout",
         label: "Logout",
         icon: (
            <LogOut
               size={`${activeIcon == "logout" ? 30 : 20}`}
               color={`${activeIcon == "logout" ? "blue" : "gray"}`}
            />
         ),
      },
   ];

   // Render content based on active view
   const renderContent = () => {
      switch (activeView) {
         case "dashboard":
            return <StudentDashboard studentData={studentData} />;
         case "notifications":
            return (
               <Notification
                  notifications={notifications}
                  noNotificationsMessage={noNotificationsMessage}
                  handleMarkAsRead={handleMarkAsRead}
               />
            );
         case "results":
            return <StudentResult />;
         case "leave":
            return <StudentApplyLeave />;
         case "attendance":
            return <AttendanceGrid />;
         case "mockTest":
            return <MockTests />;
         case "codeEditor":
            navigate("/student/coding");
         //return <Coding />;
         case "profile":
            return <StudentProfile studentData={studentData} />;
         case "logout": {
            (async () => {
               const userId = localStorage.getItem("userid");
               const resp = await axios.post(
                  `https://localhost:7013/api/Auth/Logout/${userId}`,
                  {},
                  { withCredentials: true } // Pass as third argument
               );

               if (signalConnection) {
                  await signalConnection.stop(); // Ensure stop completes
                  setSignalConnection(null);
               }

               toast.success(resp.data.message);
               setIsLoggedIn(false);

               const storedId = parseInt(localStorage.getItem("intervalId"));
               clearInterval(storedId);

               // Clear session cookies
               document.cookie =
                  "jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";
               document.cookie =
                  ".AspNetCore.Session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";

               localStorage.clear();

               // Delay navigation slightly to ensure cleanup
               setTimeout(() => navigate("/"), 100);
            })(); // Immediately Invoked Async Function Expression (IIFE)

            return null; // Prevents rendering after logout
         }

         default:
            return <StudentDashboard studentData={studentData} />;
      }
   };

   return (
      <div className="relative flex flex-col  min-h-screen">
         {/* <div className="min-h-[10vh]"></div> */}
         <div className="relative flex">
            {/* Icon-only Sidebar Navigation */}
            <Sidebar
               menuItems={menuItems}
               activeView={activeView}
               switchView={switchView}
               setActiveIcon={setActiveIcon}
            />
            {/* Main Content Area */}
            <div className="ml-16 flex-1 min-h-screen">
               {/* Content */}
               <div className="p-6">
                  <div className="mx-auto" style={{ padding: "100px 40px" }}>
                     {renderContent()}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default StudentHome;
