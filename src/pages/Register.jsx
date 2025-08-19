// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import REGISTERAPI from "../utils/REGISTERAPI";
// import {
//     User,
//     Mail,
//     Lock,
//     Phone,
//     MapPin,
//     BookOpen,
//     GraduationCap,
//     Radio,
// } from "lucide-react";
// import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
// import RadioButtonCheckedOutlinedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";
// import toast from "react-hot-toast";
// import axios from "axios";
// function Register() {
//     const navigate = useNavigate();
//     const [formData, setFormData] = React.useState({
//         Username: "",
//         Email: "",
//         Password: "",
//         Mobile: "",
//         Role: "Student",
//         Year: "",
//         Subject: "", // For teachers
//         Image: null,
//         Address: "",
//         Replacing: false,
//     });
//     console.log("🚀 ~ Register ~ Replacing:", formData.Replacing);

//     const [error, setError] = useState({
//         Username: "",
//         Email: "",
//         Mobile: "",
//         Password: "",
//         image: "",
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleFileChange = (e) => {
//         setFormData({ ...formData, Image: e.target.files[0] });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const form = new FormData();
//         form.append("Username", formData.Username);
//         form.append("Email", formData.Email);
//         form.append("Password", formData.Password);
//         form.append("Mobile", formData.Mobile);
//         form.append("Role", formData.Role);
//         form.append("Year", formData.Year);
//         form.append("Address", formData.Address);
//         form.append("Replacing", formData.Replacing);

//         if (formData.Role === "Teacher")
//             form.append("Subject", formData.Subject);

//         if (formData.Image) {
//             form.append("Image", formData.Image);
//         }

//         try {
//             if (formData.Replacing === false) {
//                 const resp = await REGISTERAPI(form);
//                 if (resp.status === 200) {
//                     toast.success("Registered successfully");
//                     navigate("/login");
//                 }
//             } else {
//                 const resp = await axios.put(
//                     `https://localhost:7013/api/Admin/replaceTeacher`,
//                     { form },
//                     { withCredentials: true }
//                 );
//                 if (resp.status === 200) {
//                     toast.success("Registered successfully");
//                     navigate("/login");
//                 }
//             }
//         } catch (error) {
//             if (error.response.status == 401) {
//                 return toast.error("Not Authoruized Ask Admin");
//             }
//             toast.error(error.response?.data || "An error occurred");
//             const errors = error.response?.data?.errors || {};
//             setError({
//                 Username: errors.Username || "",
//                 Email: errors.Email || "",
//                 Mobile: errors.Mobile || "",
//                 Password: errors.Password || "",
//                 image: errors.image || "",
//             });
//         }
//     };
//     if (localStorage.getItem("role") !== "Admin") {
//         return (
//             <div className="flex items-center justify-center h-screen">
//                 <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
//                     <p className="font-semibold text-lg">Access Denied</p>
//                     <p className="text-sm">
//                         You are not authorized to register users. Please contact
//                         an admin.
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
//             <Radio
//                 value="Replacing"
//                 checked={formData.Replacing === false}
//                 onChange={handleChange}
//                 name="Replacing"
//             />
//             <label>Replacing</label>

//             <form onSubmit={handleSubmit} encType="multipart/form-data">
//                 {/* Name */}
//                 <div className="mb-4">
//                     <label
//                         htmlFor="Username"
//                         className="block text-gray-700 font-medium"
//                     >
//                         Name
//                     </label>
//                     <input
//                         type="text"
//                         id="Username"
//                         name="Username"
//                         value={formData.Username}
//                         onChange={handleChange}
//                         placeholder="Enter your name"
//                         className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-200"
//                         required
//                     />
//                     {error.Username && (
//                         <p className="text-red-500 text-sm mt-1">
//                             {error.Username}
//                         </p>
//                     )}
//                 </div>

//                 {/* Email */}
//                 <div className="mb-4">
//                     <label
//                         htmlFor="Email"
//                         className="block text-gray-700 font-medium"
//                     >
//                         Email
//                     </label>
//                     <input
//                         type="email"
//                         id="Email"
//                         name="Email"
//                         value={formData.Email}
//                         onChange={handleChange}
//                         placeholder="Enter your email"
//                         className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-200"
//                         required
//                     />
//                     {error.Email && (
//                         <p className="text-red-500 text-sm mt-1">
//                             {error.Email}
//                         </p>
//                     )}
//                 </div>

//                 {/* Password */}
//                 <div className="mb-4">
//                     <label
//                         htmlFor="Password"
//                         className="block text-gray-700 font-medium"
//                     >
//                         Password
//                     </label>
//                     <input
//                         type="password"
//                         id="Password"
//                         name="Password"
//                         value={formData.Password}
//                         onChange={handleChange}
//                         placeholder="Enter your password"
//                         className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-200"
//                         required
//                     />
//                     {error.Password && (
//                         <p className="text-red-500 text-sm mt-1">
//                             {error.Password}
//                         </p>
//                     )}
//                 </div>

//                 {/* Mobile Number */}
//                 <div className="mb-4">
//                     <label
//                         htmlFor="Mobile"
//                         className="block text-gray-700 font-medium"
//                     >
//                         Mobile Number
//                     </label>
//                     <input
//                         type="tel"
//                         id="Mobile"
//                         name="Mobile"
//                         value={formData.Mobile}
//                         onChange={handleChange}
//                         placeholder="Enter your mobile number"
//                         className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-200"
//                         required
//                     />
//                     {error.Mobile && (
//                         <p className="text-red-500 text-sm mt-1">
//                             {error.Mobile}
//                         </p>
//                     )}
//                 </div>

//                 {/* Address */}
//                 <div className="mb-4">
//                     <label
//                         htmlFor="Address"
//                         className="block text-gray-700 font-medium"
//                     >
//                         Address
//                     </label>
//                     <input
//                         type="text"
//                         id="Address"
//                         name="Address"
//                         value={formData.Address}
//                         onChange={handleChange}
//                         placeholder="123, Nyc USA"
//                         className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-200"
//                         required
//                     />
//                     {error.Address && (
//                         <p className="text-red-500 text-sm mt-1">
//                             {error.Address}
//                         </p>
//                     )}
//                 </div>

//                 {/* Role Selection */}
//                 <div className="mb-4">
//                     <label
//                         htmlFor="Role"
//                         className="block text-gray-700 font-medium"
//                     >
//                         Role
//                     </label>
//                     <select
//                         id="Role"
//                         name="Role"
//                         value={formData.Role}
//                         onChange={handleChange}
//                         className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-200"
//                         required
//                     >
//                         <option value="Student">Student</option>
//                         <option value="Teacher">Teacher</option>
//                         <option value="Admin">Admin</option>
//                     </select>
//                 </div>

//                 {/* Year Selection (Only for Teachers) */}
//                 {
//                     <div className="mb-4">
//                         <label
//                             htmlFor="Year"
//                             className="block text-gray-700 font-medium"
//                         >
//                             Year Teaching
//                         </label>
//                         <select
//                             id="Year"
//                             name="Year"
//                             value={formData.Year}
//                             onChange={handleChange}
//                             className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-200"
//                             required
//                         >
//                             <option value="">Select Year</option>
//                             <option value="1">First Year</option>
//                             <option value="2">Second Year</option>
//                             <option value="3">Third Year</option>
//                             <option value="4">Fourth Year</option>
//                         </select>
//                     </div>
//                 }

//                 {/* Subject Selection (Only for Teachers) */}
//                 {formData.Role === "Teacher" && (
//                     <div className="mb-4">
//                         <label
//                             htmlFor="Subject"
//                             className="block text-gray-700 font-medium"
//                         >
//                             Subject Teaching
//                         </label>
//                         <select
//                             id="Subject"
//                             name="Subject"
//                             value={formData.Subject}
//                             onChange={handleChange}
//                             className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-200"
//                             required
//                         >
//                             <option value="">Select Subject</option>
//                             <option value="Mathematics">Mathematics</option>
//                             <option value="Physics">Physics</option>
//                             <option value="Chemistry">Chemistry</option>
//                             <option value="Computer Science">
//                                 Computer Science
//                             </option>
//                             <option value="English">English</option>
//                         </select>
//                     </div>
//                 )}

//                 {/* Profile Image Upload */}
//                 <div className="mb-6">
//                     <label className="block text-gray-700 font-semibold mb-2">
//                         Profile Image
//                     </label>
//                     <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
//                         <div className="space-y-1 text-center">
//                             <div className="flex text-sm text-gray-600">
//                                 <label
//                                     htmlFor="Image"
//                                     className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
//                                 >
//                                     <span>Upload a file</span>
//                                     <input
//                                         id="Image"
//                                         name="Image"
//                                         type="file"
//                                         accept="image/*"
//                                         className="sr-only"
//                                         onChange={handleFileChange}
//                                     />
//                                 </label>
//                                 <p className="pl-1">or drag and drop</p>
//                             </div>
//                             <p className="text-xs text-gray-500">
//                                 PNG, JPG, GIF up to 10MB
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//                 {/* Submit Button */}
//                 <button
//                     type="submit"
//                     className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//                 >
//                     Create Account
//                 </button>
//             </form>
//         </div>
//     );
// }
// export default Register;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import REGISTERAPI from "../utils/REGISTERAPI";
import toast from "react-hot-toast";
import axios from "axios";

function Register() {
   const navigate = useNavigate();
   const [formData, setFormData] = React.useState({
      Username: "",
      Email: "",
      Password: "",
      Mobile: "",
      Role: "Student",
      Year: "",
      Subject: "",
      Image: null,
      Address: "",
      Replacing: false,
      semester: "",
   });
   console.log("🚀 ~ Register ~ Replacing:", formData.Replacing);

   const [error, setError] = useState({
      Username: "",
      Email: "",
      Mobile: "",
      Password: "",
      image: "",
   });

   const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
         ...formData,
         [name]: type === "checkbox" ? checked : value,
      });
   };

   const handleFileChange = (e) => {
      setFormData({ ...formData, Image: e.target.files[0] });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      const form = new FormData();
      form.append("Username", formData.Username);
      form.append("Email", formData.Email);
      form.append("Password", formData.Password);
      form.append("Mobile", formData.Mobile);
      form.append("Role", formData.Role);
      form.append("Year", formData.Year);
      form.append("Address", formData.Address);

      if (formData.Role === "Teacher") form.append("Subject", formData.Subject);

      if (formData.Image) {
         form.append("Image", formData.Image);
      }

      try {
         const resp = await REGISTERAPI(form);
         if (resp.status === 200) {
            toast.success("Registered successfully");
            navigate("/login");
         }
      } catch (error) {
         if (error.response.status == 401) {
            return toast.error("Not Authorized Ask Admin");
         }
         toast.error(error.response?.data || "An error occurred");
         const errors = error.response?.data?.errors || {};
         setError({
            Username: errors.Username || "",
            Email: errors.Email || "",
            Mobile: errors.Mobile || "",
            Password: errors.Password || "",
            image: errors.image || "",
         });
      }
   };

   const handleReplacingSubmit = async (e) => {
      e.preventDefault();

      const form = new FormData();
      form.append("TeacherName", formData.Username);
      form.append("Email", formData.Email);
      form.append("Password", formData.Password);
      form.append("Mobile", formData.Mobile);
      form.append("Year", formData.Year);
      form.append("Address", formData.Address);
      form.append("Replacing", formData.Replacing);

      if (formData.Replacing) {
         form.append("Subject", formData.Subject);
      }

      if (formData.Image instanceof File) {
         form.append("Image", formData.Image);
      }

      try {
         let resp;
         if (formData.Replacing === false) {
            resp = await REGISTERAPI(form);
         } else {
            resp = await axios.put(
               `https://localhost:7013/api/Admin/replaceTeacher`,
               form,
               { withCredentials: true }
            );
         }

         if (resp.status === 200) {
            toast.success("Registered successfully");
            navigate("/login");
         }
      } catch (error) {
         if (error.response?.status === 401) {
            return toast.error("Not Authorized Ask Admin");
         }
         toast.error(error.response?.data || "An error occurred");
         const errors = error.response?.data?.errors || {};
         setError({
            Username: errors.TeacherName || "",
            Email: errors.Email || "",
            Mobile: errors.Mobile || "",
            Password: errors.Password || "",
            image: errors.image || "",
         });
      }
   };

   if (localStorage.getItem("role") !== "Admin") {
      return (
         <div className="flex items-center justify-center h-screen min-w-[70vw]">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
               <p className="font-semibold text-lg">Access Denied</p>
               <p className="text-sm">
                  You are not authorized to register users. Please contact the
                  Admin.
               </p>
            </div>
         </div>
      );
   }

   return (
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md -space-x-20">
         <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
         <div className="mb-4 ">
            <label className="block text-gray-700 font-medium mx-2">
               Replacing Existing Teacher?
            </label>
            <input
               type="checkbox"
               name="Replacing"
               checked={formData.Replacing}
               onChange={handleChange}
               className=""
            />
            {/* <span>Replacing existing Teacher</span> */}
         </div>
         <form
            onSubmit={
               formData.Replacing === true
                  ? handleReplacingSubmit
                  : handleSubmit
            }
            encType="multipart/form-data"
         >
            {/* Name */}
            <div className="mb-4">
               <label
                  htmlFor="Username"
                  className="block text-gray-700 font-medium"
               >
                  Name
               </label>
               <input
                  type="text"
                  id="Username"
                  name="Username"
                  value={formData.Username}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-200"
                  required
               />
               {error.Username && (
                  <p className="text-red-500 text-sm mt-1">{error.Username}</p>
               )}
            </div>

            {/* Email */}
            <div className="mb-4">
               <label
                  htmlFor="Email"
                  className="block text-gray-700 font-medium"
               >
                  Email
               </label>
               <input
                  type="email"
                  id="Email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-200"
                  required
               />
               {error.Email && (
                  <p className="text-red-500 text-sm mt-1">{error.Email}</p>
               )}
            </div>

            {/* Password */}
            <div className="mb-4">
               <label
                  htmlFor="Password"
                  className="block text-gray-700 font-medium"
               >
                  Password
               </label>
               <input
                  type="password"
                  id="Password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-200"
                  required
               />
               {error.Password && (
                  <p className="text-red-500 text-sm mt-1">{error.Password}</p>
               )}
            </div>

            {/* Mobile Number */}
            <div className="mb-4">
               <label
                  htmlFor="Mobile"
                  className="block text-gray-700 font-medium"
               >
                  Mobile Number
               </label>
               <input
                  type="tel"
                  id="Mobile"
                  name="Mobile"
                  value={formData.Mobile}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-200"
                  required
                  maxLength={10}
               />
               {error.Mobile && (
                  <p className="text-red-500 text-sm mt-1">{error.Mobile}</p>
               )}
            </div>

            {/* Address */}
            <div className="mb-4">
               <label
                  htmlFor="Address"
                  className="block text-gray-700 font-medium"
               >
                  Address
               </label>
               <input
                  type="text"
                  id="Address"
                  name="Address"
                  value={formData.Address}
                  onChange={handleChange}
                  placeholder="123, Nyc USA"
                  className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-200"
                  required
               />
               {error.Address && (
                  <p className="text-red-500 text-sm mt-1">{error.Address}</p>
               )}
            </div>

            {/* Role Selection */}
            <div className="mb-4">
               <label
                  htmlFor="Role"
                  className="block text-gray-700 font-medium"
               >
                  Role
               </label>
               <select
                  id="Role"
                  name="Role"
                  value={formData.Role}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-200"
                  required
               >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Admin">Admin</option>
               </select>
            </div>

            {/* Year Selection (Only for Teachers) */}
            {
               <div className="mb-4">
                  <label
                     htmlFor="Year"
                     className="block text-gray-700 font-medium"
                  >
                     Year Teaching
                  </label>
                  <select
                     id="Year"
                     name="Year"
                     value={formData.Year}
                     onChange={handleChange}
                     className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-200"
                     required
                  >
                     <option value="">Select Year</option>
                     <option value="1">First Year</option>
                     <option value="2">Second Year</option>
                     <option value="3">Third Year</option>
                     <option value="4">Fourth Year</option>
                  </select>
               </div>
            }

            {/* Subject Selection (Only for Teachers) */}
            {formData.Role === "Teacher" && (
               <div className="mb-4">
                  <label
                     htmlFor="Subject"
                     className="block text-gray-700 font-medium"
                  >
                     Subject Teaching
                  </label>
                  <select
                     id="Subject"
                     name="Subject"
                     value={formData.Subject}
                     onChange={handleChange}
                     className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-200"
                     required
                  >
                     <option value="">Select Subject</option>
                     <option value="Mathematics">Mathematics</option>
                     <option value="Physics">Physics</option>
                     <option value="Chemistry">Chemistry</option>
                     <option value="Computer Science">Computer Science</option>
                     <option value="English">English</option>
                  </select>
               </div>
            )}

            {/* Profile Image Upload */}
            <div className="mb-6">
               <label className="block text-gray-700 font-semibold mb-2">
                  Profile Image
               </label>
               <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                     <div className="flex text-sm text-gray-600">
                        <label
                           htmlFor="Image"
                           className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                           <span>Upload a file</span>
                           <input
                              id="Image"
                              name="Image"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleFileChange}
                           />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                     </div>
                     <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                     </p>
                  </div>
               </div>
            </div>
            {/* Submit Button */}
            <button
               type="submit"
               className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
               Create Account
            </button>
         </form>
      </div>
   );
}

export default Register;
