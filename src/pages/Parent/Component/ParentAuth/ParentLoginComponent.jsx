// ParentLoginForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, KeyRound, Eye, EyeOff } from "lucide-react";

const ParentLoginComponent = () => {
   const [formData, setFormData] = useState({
      username: "",
      password: "",
      otp: "",
   });
   const [showPassword, setShowPassword] = useState(false);
   const navigate = useNavigate();
   const [errors, setErrors] = useState({});

   const handleChange = (e) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
   };

   const validate = () => {
      const newErrors = {};
      if (!formData.username.trim())
         newErrors.username = "Username is required.";
      if (!formData.password) newErrors.password = "Password is required.";
      if (!formData.otp) newErrors.otp = "OTP is required.";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleGetOtp = async () => {
      if (!formData.username.trim() || !formData.password.trim()) {
         setErrors({
            username: !formData.username.trim() ? "Enter your username" : "",
            password: !formData.password.trim() ? "Enter your password" : "",
         });
         return;
      }

      const fd = new FormData();
      fd.append("parentName", formData.username);
      fd.append("parentPassword", formData.password);

      try {
         const resp = await axios.post(
            `https://localhost:7013/api/Parent/generateOTP`,
            fd,
            {
               withCredentials: true,
               headers: {
                  "Content-Type": "multipart/form-data",
               },
            }
         );
         console.log("OTP sent:", resp.data);
         alert("OTP sent to your email!");
      } catch (error) {
         console.error("OTP error:", error.response?.data || error.message);
         alert("Failed to send OTP.");
      }
   };

   const handleLogin = async () => {
      if (validate()) {
         const fd = new FormData();
         fd.append("parentName", formData.username.toString());
         fd.append("parentPassword", formData.password.toString());
         fd.append("otp", formData.otp.toString());

         try {
            const resp = await axios.post(
               `https://localhost:7013/api/Parent/auth/parent/login`,
               fd,
               {
                  withCredentials: true,
                  headers: {
                     "Content-Type": "multipart/form-data",
                  },
               }
            );

            localStorage.setItem("parentId", resp.data.parentId);
            if (resp.data) {
               navigate("/parent/tracking");
            }
         } catch (error) {
            console.error(
               "Login error:",
               error.response?.data || error.message
            );
            alert(error.response?.data?.message || "Login failed");
         }
      }
   };

   return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
         <div className="w-full max-w-md bg-white rounded-xl border border-gray-100 p-4">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
               Parent Login
            </h2>

            {/* Username */}
            <div className="mb-5">
               <label className="block mb-2 font-medium text-gray-700">
                  Username
               </label>
               <div className="flex items-center border border-gray-200 rounded-lg px-2 py-3 focus-within:border-blue-400 transition-colors">
                  <Mail className="text-gray-400 mr-3" size={20} />
                  <span className="w-4"></span>
                  <input
                     type="text"
                     name="username"
                     value={formData.username}
                     placeholder="Enter your username"
                     className="w-full outline-none text-gray-700 placeholder-gray-400"
                     onChange={handleChange}
                  />
               </div>
               {errors.username && (
                  <p className="text-red-500 text-sm mt-2">{errors.username}</p>
               )}
            </div>

            {/* Password with toggle */}
            <div className="mb-5">
               <label className="block mb-2 font-medium text-gray-700">
                  Password
               </label>
               <div className="flex items-center border border-gray-200 rounded-lg px-2 py-3 focus-within:border-blue-400 transition-colors">
                  <Lock className="text-gray-400 mr-3" size={20} />
                  <span className="w-4"></span>
                  <input
                     type={showPassword ? "text" : "password"}
                     name="password"
                     value={formData.password}
                     placeholder="Enter your password"
                     className="w-full outline-none text-gray-700 placeholder-gray-400"
                     onChange={handleChange}
                  />
                  <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  >
                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
               </div>
               {errors.password && (
                  <p className="text-red-500 text-sm mt-2">{errors.password}</p>
               )}
            </div>

            {/* OTP */}
            <div className="mb-6">
               <label className="block mb-2 font-medium text-gray-700">
                  OTP
               </label>
               <div className="flex items-center border border-gray-200 rounded-lg px-2 py-3 focus-within:border-blue-400 transition-colors">
                  <KeyRound className="text-gray-400 mr-3" size={20} />
                  <span className="w-4"></span>
                  <input
                     type="text"
                     name="otp"
                     value={formData.otp}
                     placeholder="Enter OTP"
                     className="w-full outline-none text-gray-700 placeholder-gray-400"
                     onChange={handleChange}
                  />
               </div>
               {errors.otp && (
                  <p className="text-red-500 text-sm mt-2">{errors.otp}</p>
               )}
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-8 p-4">
               <button
                  onClick={handleGetOtp}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors font-medium"
               >
                  Get OTP
               </button>
               <button
                  onClick={handleLogin}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors font-medium"
               >
                  Login
               </button>
            </div>
         </div>
      </div>
   );
};

export default ParentLoginComponent;
