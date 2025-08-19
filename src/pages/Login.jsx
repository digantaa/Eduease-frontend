import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import useStore from "../store/store";

function Login() {
   const setRole = useStore((state) => state.setRole);
   const [formData, setFormData] = useState({
      Username: "",
      Password: "",
      RememberMe: false,
   });
   const [error, setError] = useState("");
   const navigate = useNavigate();
   const [currLocation, setCurrLocation] = useState({
      lat: null,
      lng: null,
   });

   const getCurrentPosition = () => {
      return new Promise((resolve, reject) => {
         navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
         });
      });
   };

   const updateLocation = async () => {
      try {
         const pos = await getCurrentPosition();
         const { latitude, longitude } = pos.coords;

         // Update your React state if you want for UI
         setCurrLocation({ lat: latitude, lng: longitude });

         console.log("Latitude:", latitude, "Longitude:", longitude);

         const location = {
            longitude: longitude.toString(), // 🚀 Use directly from pos
            latitude: latitude.toString(), // 🚀 Use directly from pos
            studentId: localStorage.getItem("userid"),
         };

         const resp = await axios.post(
            `https://localhost:7013/api/Student/UpdateLocation`,
            location,
            {
               withCredentials: true,
               headers: {
                  "Content-Type": "application/json",
               },
            }
         );
      } catch (error) {
         console.error(
            "Error updating location:",
            error.response?.data || error.message
         );
      }
   };

   const createInterval = () => {
      const intervalId = setInterval(() => {
         updateLocation(); // Call updateLocation every 2 seconds
      }, 10000);

      localStorage.setItem("intervalId", intervalId.toString()); // Store as string so it can be retrieved later
   };

   // useeffect for geolocation
   //    useEffect(() => {
   //       const intervalId = setInterval(() => {
   //          if (currLocation.lat && currLocation.lng) {
   //             updateLocation(); // Call updateLocation with the new coordinates
   //          }
   //          navigator.geolocation.getCurrentPosition(
   //             (pos) => {
   //                const { latitude, longitude } = pos.coords;
   //                setCurrLocation({ lat: latitude, lng: longitude });

   //                console.log("Latitude:", latitude, "Longitude:", longitude);
   //             },
   //             (err) => console.error("Geolocation error:", err),
   //             { enableHighAccuracy: true }
   //          );
   //       }, 2000);

   //       localStorage.setItem("intervalId", intervalId.toString()); // Store as string so it can be retrieved later
   //    }, []);

   // Handle input change
   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   // Handle checkbox change
   const handleCheckboxChange = () => {
      setFormData((prev) => ({
         ...prev,
         RememberMe: !prev.RememberMe,
      }));
   };

   // Handle form submission
   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!formData.Username || !formData.Password) {
         setError("All fields are required.");
         return;
      }

      const data = new FormData();
      data.append("UserName", formData.Username);
      data.append("Password", formData.Password);
      data.append("RememberMe", formData.RememberMe.toString()); // ✅ FIXED

      try {
         const response = await axios.post(
            "https://localhost:7013/api/Auth/Login",
            data,
            {
               withCredentials: true,
               headers: {
                  "Content-Type": "multipart/form-data",
               },
            }
         );

         localStorage.setItem("rememberMe", formData.RememberMe);
         localStorage.setItem("username", response.data.user.username);
         localStorage.setItem("role", response.data.user.role);
         localStorage.setItem("user", response.data.user.username);
         localStorage.setItem("userid", response.data.user.id);

         setRole(response.data.user.role);
         toast.success("Login Successful");

         const userRole = response.data.user.role;

         if (userRole === "Admin") navigate("/Admin/Home");
         else if (userRole === "Student") {
            await updateLocation();
            createInterval();
            navigate("/Student/Home");
         } else navigate("/Teacher/Home");
      } catch (error) {
         toast.error(error.response?.data?.message || "Login failed");
         setError(error.response?.data?.message || "Login failed");
      }
   };

   //    // useeffect to check the user's current location
   //    useEffect(() => {
   //       // Ensure location is updated only if valid data is available
   //       if (currLocation.lat && currLocation.lng) {
   //          updateLocation();
   //       }
   //    }, [currLocation]); // Only call updateLocation when currLocation changes

   return (
      <div className="flex min-h-screen">
         {/* Left Side Image */}
         <div className="w-1/2 bg-green-100 flex justify-center items-center">
            <img
               src="/public/studyvector.avif"
               alt="Study"
               className="w-[400px] object-contain"
            />
         </div>

         {/* Right Side Form */}
         <div className="w-1/2 bg-green-50 flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-4">
               <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                  Login
               </h2>

               {error && (
                  <p className="text-red-600 text-sm mb-4 text-center">
                     {error}
                  </p>
               )}

               <form onSubmit={handleSubmit} className="px-4 py-6">
                  <div className="mb-4">
                     <label
                        htmlFor="Username"
                        className="block text-sm font-medium text-gray-700"
                     >
                        Username
                     </label>
                     <input
                        id="Username"
                        name="Username"
                        type="text"
                        value={formData.Username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        required
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                     />
                  </div>

                  <div className="mb-4">
                     <label
                        htmlFor="Password"
                        className="block text-sm font-medium text-gray-700"
                     >
                        Password
                     </label>
                     <input
                        id="Password"
                        name="Password"
                        type="password"
                        value={formData.Password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                     />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                     <input
                        type="checkbox"
                        id="rememberMe"
                        className="w-4 h-4"
                        checked={formData.RememberMe}
                        onChange={handleCheckboxChange}
                     />
                     <label
                        htmlFor="rememberMe"
                        className="text-sm text-gray-700"
                     >
                        Remember Me
                     </label>
                  </div>

                  <button
                     type="submit"
                     className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                     Login
                  </button>

                  <div className="text-sm text-center mt-4 text-gray-600">
                     Don't have an account?{" "}
                     <a
                        href="/register"
                        className="text-black font-medium hover:underline"
                     >
                        Register here
                     </a>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
}

export default Login;
