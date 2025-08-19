import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, LogOut, User, Bell, Settings, Lock } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import useStore from "../store/store";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  const { notifications, signalConnection, setSignalConnection } =
    useStore.getState();

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

  const handleLogout = async () => {
    try {
      const resp = await axios.post(
        `https://localhost:7013/api/Auth/Logout/${localStorage.getItem(
          "userid",
        )}`,
        {},
        { withCredentials: true },
      );

      setDropdownOpen(false);

      if (signalConnection) {
        signalConnection.stop();
        setSignalConnection(null);
      }

      toast.success(resp.data.message);
      setIsLoggedIn(false);

      document.cookie = "jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie =
        ".AspNetCore.Session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";

      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="w-full h-12 bg-[#1F2122] shadow-md">
      <div className="container mx-auto flex justify-between items-center h-12 px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-white font-bold text-2xl tracking-tight hover:text-blue-400 transition-colors"
          style={{ textDecoration: "none" }}
        >
         EduEase
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <NavItem
            to="/"
            icon={<Home className="w-5 h-5 text-white" />}
            label="Home"
          />
          <NavItem
            to="/privacy"
            icon={<Lock className="w-5 h-5 text-white" />}
            label="Privacy"
          />

          {/* Register (Only visible to Admin) */}
          {role === "Admin" && (
            <NavItem
              to="/register"
              icon={<Lock className="w-5 h-5 text-white" />}
              label="Register"
            />
          )}

          {/* Notifications */}
          {isLoggedIn && (
            <div className="relative">
              <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md flex items-center p-x-2">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-md w-5 h-5 flex items-center justify-center z-50">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Authentication Links */}
          {!isLoggedIn ? (
            <Link
              to="/login"
              className="text-white px-4 py-2 rounded-md transition-colors hover:bg-blue-700"
              style={{ textDecoration: "none" }}
            >
              Login
            </Link>
          ) : (
            <UserDropdown
              userProfile={userProfile}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
              handleLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </nav>
  );
}

/* Navigation Item Component */
const NavItem = ({ to, icon, label }) => (
  <Link
    to={to}
    className="text-gray-300 hover:bg-gray-700 hover:text-white py-2 rounded-md flex items-center space-x-2 px-3"
  >
    {icon}
    <span className="text-white">{label}</span>
  </Link>
);

/* User Dropdown Component */
const UserDropdown = ({
  userProfile,
  dropdownOpen,
  setDropdownOpen,
  handleLogout,
}) => (
  <div className="relative">
    <button
      onClick={() => setDropdownOpen(!dropdownOpen)}
      className="flex items-center space-x-2 text-white hover:bg-gray-700 px-3 py-2 rounded-md"
    >
      {userProfile?.profilePicture ? (
        <img
          src={`https://cdn-icons-png.flaticon.com/512/6858/6858504.png`}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <img
          src={`https://cdn-icons-png.flaticon.com/512/6858/6858504.png`}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
      )}
      <span>{userProfile?.name || "User"}</span>
    </button>

    {dropdownOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5">
        <div className="py-1">
          <DropdownItem
            to="/profile"
            icon={<User className="w-4 h-4" />}
            label="Profile"
            setDropdownOpen={setDropdownOpen}
          />
          <DropdownItem
            to="/settings"
            icon={<Settings className="w-4 h-4" />}
            label="Settings"
            setDropdownOpen={setDropdownOpen}
          />
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100 flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-black">Logout</span>
          </button>
        </div>
      </div>
    )}
  </div>
);

/* Dropdown Item Component */
const DropdownItem = ({ to, icon, label, setDropdownOpen }) => (
  <Link
    to={to}
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
    onClick={() => setDropdownOpen(false)}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default Navbar;
