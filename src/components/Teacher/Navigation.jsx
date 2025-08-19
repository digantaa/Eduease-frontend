import React, { useState, useEffect } from "react";
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
  SquareCode,
  Upload,
  LogOut,
} from "lucide-react";
import useStore from "../../Store/store";
import UploadCodingQuestion from "./UploadCodingQuestion";

const Navigation = ({
  setShowHome,
  setShowAttendance,
  setShowMarks,
  setShowNotifications,
  setShowUploadCodingQuestion,
  showHome,
  showAttendance,
  showMarks,
  showNotifications,
  showUploadCodingQuestion,
  showUploadTestCases,
  setShowUploadTestCases,
  showUploadMockTest,
  setShowUploadMockTest,
}) => {
  const [openSideBar, setOpenSideBar] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const { notifications, signalConnection, setSignalConnection } =
    useStore.getState();

  // Define menu items based on your navigation needs
  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: (
        <span className="text-xl">
          <House />
        </span>
      ),
      link: "/teacher/home",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: (
        <span className="text-xl">
          <Bell />
        </span>
      ),
      badge: notifications, // Example notification count
    },
    {
      id: "marks",
      label: "Marks",
      icon: (
        <span className="text-xl">
          <BookOpenText />
        </span>
      ),
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: (
        <span className="text-xl">
          <NotebookPen />
        </span>
      ),
    },
    {
      id: "uploadCodingQuestion",
      label: "question",
      icon: (
        <span className="text-xl">
          <Upload />
        </span>
      ),
    },
    {
      id: "uploadTestCases",
      label: "TestCases",
      icon: (
        <span className="text-xl">
          <SquareCode />
        </span>
      ),
    },
    {
      id: "uploadMockTest",
      label: "MockTest",
      icon: (
        <span className="text-xl">
          <Upload />
        </span>
      ),
    },
  ];

  // Function to switch views based on menu item selection
  const switchView = (id) => {
    if (id === "notifications") {
      setShowNotifications(true);
      setShowMarks(false);
      setShowAttendance(false);
      setShowHome(false);
      setShowUploadCodingQuestion(false);
      setShowUploadTestCases(false);
      setShowUploadMockTest(false);
    } else if (id === "marks") {
      setShowMarks(true);
      setShowNotifications(false);
      setShowAttendance(false);
      setShowHome(false);
      setShowUploadCodingQuestion(false);
      setShowUploadTestCases(false);
      setShowUploadMockTest(false);
    } else if (id === "attendance") {
      setShowAttendance(true);
      setShowMarks(false);
      setShowNotifications(false);
      setShowHome(false);
      setShowUploadTestCases(false);

      setShowUploadCodingQuestion(false);
      setShowUploadMockTest(false);
    } else if (id === "uploadCodingQuestion") {
      setShowUploadCodingQuestion(true);
      setShowAttendance(false);
      setShowMarks(false);
      setShowNotifications(false);
      setShowHome(false);
      setShowUploadTestCases(false);
      setShowUploadMockTest(false);
    } else if (id === "uploadTestCases") {
      setShowUploadTestCases(true);
      setShowUploadCodingQuestion(false);
      setShowAttendance(false);
      setShowMarks(false);
      setShowNotifications(false);
      setShowHome(false);
      setShowUploadMockTest(false);
    } else if (id === "uploadMockTest") {
      setShowUploadMockTest(true);
      setShowUploadTestCases(false);
      setShowUploadCodingQuestion(false);
      setShowAttendance(false);
      setShowMarks(false);
      setShowNotifications(false);
      setShowHome(false);
    } else {
      setShowHome(true);
      setShowMarks(false);
      setShowNotifications(false);
      setShowAttendance(false);
      setShowUploadCodingQuestion(false);
      setShowUploadTestCases(false);
      setShowUploadMockTest(false);
    }
  };

  // Determine which view is currently active
  const getActiveView = () => {
    if (showNotifications) return "notifications";
    if (showMarks) return "marks";
    if (showAttendance) return "attendance";
    if (showHome) return "home";
    if (showUploadCodingQuestion) return "upload coding question";
    if (showUploadTestCases) return "uploadTestCases";
    if (showUploadMockTest) return "uploadMockTest";
    return "home";
  };

  const activeView = getActiveView();

  return (
    <div className=" left-0 flex flex-col gap-8 z-50">
      {/* Sidebar Toggle Button */}
      <div
        className="p-2 w-[40px] h-[40px] rounded-full bg-gray-200 hover:bg-gray-300 px-auto py-auto cursor-pointer  transition-all duration-200"
        onClick={() => setOpenSideBar(!openSideBar)}
      >
        {openSideBar ? <X size={25} /> : <Menu size={25} />}
      </div>

      {/* Sidebar Container */}
      <div
        className={`${
          openSideBar ? "w-64" : "w-16"
        } flex flex-col gap-5 items-center py-20 h-screen transition-all duration-300 ease-in-out overflow-hidden`}
      >
        {menuItems.map((item) => (
          <div key={item.id} className="group w-full px-3">
            {item.id === "home" ? (
              <a
                href={item.link}
                className={`relative w-full z-10 h-12 flex gap-4 items-center rounded-xl transition-all duration-200 ${
                  activeView === item.id
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                } ${openSideBar ? "justify-start px-4" : "justify-center"}`}
                onMouseEnter={() => setTooltipVisible(item.id)}
                onMouseLeave={() => setTooltipVisible(null)}
              >
                <span
                  className={
                    activeView === item.id ? "text-blue-600" : "text-gray-500"
                  }
                >
                  {item.icon}
                </span>

                {openSideBar && (
                  <span
                    className={`truncate ${
                      activeView === item.id ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </a>
            ) : (
              <button
                className={`relative w-full z-10 h-12 flex gap-4 items-center rounded-xl transition-all duration-200 ${
                  activeView === item.id
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                } ${openSideBar ? "justify-start px-4" : "justify-center"}`}
                onClick={() => switchView(item.id)}
                onMouseEnter={() => setTooltipVisible(item.id)}
                onMouseLeave={() => setTooltipVisible(null)}
              >
                <span
                  className={
                    activeView === item.id ? "text-blue-600" : "text-gray-500"
                  }
                >
                  {item.icon}
                </span>

                {/* Badge notification */}
                {item.badge > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-5 px-1 flex items-center justify-center leading-none">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}

                {/* Label (only when sidebar is open) */}
                {openSideBar && (
                  <span
                    className={`truncate ${
                      activeView === item.id ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            )}

            {/* Tooltip (only when sidebar is closed) */}
            {!openSideBar && tooltipVisible === item.id && (
              <div className="absolute left-16 ml-2 bg-gray-800 text-white px-3 py-1 rounded-md text-sm z-50">
                {item.label}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
