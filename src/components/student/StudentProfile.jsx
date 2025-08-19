import React, { useState, useEffect } from "react";

const StudentProfile = ({ studentData }) => {
   const [isEditing, setIsEditing] = useState(false);
   const [updatedData, setUpdatedData] = useState({});

   // Ensure state is updated when `studentData` is received

   useEffect(() => {
      if (studentData) {
         setUpdatedData(studentData);
      }
   }, [studentData]);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setUpdatedData((prevData) => ({
         ...prevData,
         [name]: value,
      }));
   };

   const handleEditToggle = () => {
      setIsEditing((prevState) => !prevState);
      if (isEditing) {
         console.log("Updated Data:", updatedData);
         // Here you would typically save the data to the backend
      }
   };

   const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString("en-GB", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
      });
   };

   return (
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
         {/* Header with background */}
         <div className="bg-gradient-to-r from-green-400 to-blue-500 h-32 relative flex items-center justify-center">
            {/* Profile image overlay */}
            <div className="absolute -bottom-16">
               <div className="relative">
                  <img
                     src={
                        updatedData.imagePath
                           ? `https://localhost:7013/${updatedData.imagePath.replace(
                                /\\/g,
                                "/"
                             )}`
                           : "https://via.placeholder.com/150"
                     }
                     alt={updatedData.name || "Student Profile"}
                     className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                  {/* Camera Icon Overlay */}
                  <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition">
                     <i className="bi bi-camera-fill text-gray-600 text-lg"></i>
                  </div>
               </div>
            </div>
         </div>

         {/* Content area */}
         <div className="pt-20 px-8 pb-8 flex flex-col items-center space-y-6">
            {/* Name Input / Display */}
            {isEditing ? (
               <input
                  type="text"
                  name="name"
                  value={updatedData.name || ""}
                  onChange={handleChange}
                  className="text-center w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter Name"
               />
            ) : (
               <h2 className="text-2xl font-bold text-gray-800">
                  {updatedData.name || "N/A"}
               </h2>
            )}

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
               {/* Email */}
               <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                     <i className="bi bi-envelope-fill text-blue-600"></i>
                  </div>
                  <div>
                     <p className="text-xs text-gray-500 font-medium">Email</p>
                     <p className="text-gray-700">
                        {updatedData.email || "N/A"}
                     </p>
                  </div>
               </div>

               {/* Phone */}
               <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                     <i className="bi bi-telephone-fill text-green-600"></i>
                  </div>
                  <div>
                     <p className="text-xs text-gray-500 font-medium">Phone</p>
                     <p className="text-gray-700">
                        {updatedData.mobile || "N/A"}
                     </p>
                  </div>
               </div>

               {/* Address */}
               <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                     <i className="bi bi-geo-alt-fill text-yellow-600"></i>
                  </div>
                  <div>
                     <p className="text-xs text-gray-500 font-medium">
                        Address
                     </p>
                     <p className="text-gray-700">
                        {updatedData.address || "N/A"}
                     </p>
                  </div>
               </div>

               {/* DOB */}
               <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                     <i className="bi bi-calendar-fill text-purple-600"></i>
                  </div>
                  <div>
                     <p className="text-xs text-gray-500 font-medium">
                        Date of Birth
                     </p>
                     <p className="text-gray-700">
                        {formatDate(updatedData.dateOfBirth)}
                     </p>
                  </div>
               </div>

               {/* Current Year - Full Width */}
               <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center col-span-full">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                     <i className="bi bi-mortarboard-fill text-indigo-600"></i>
                  </div>
                  <div>
                     <p className="text-xs text-gray-500 font-medium">
                        Current Year
                     </p>
                     <p className="text-gray-700">
                        {updatedData.currentYear || "N/A"}
                     </p>
                  </div>
               </div>
            </div>

            {/* Edit / Save Button */}
            <button
               onClick={handleEditToggle}
               className={`px-6 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 w-48 flex items-center justify-center ${
                  isEditing
                     ? "bg-green-600 hover:bg-green-700 text-white"
                     : "bg-blue-600 hover:bg-blue-700 text-white"
               }`}
            >
               {isEditing ? (
                  <>
                     <i className="bi bi-save mr-2"></i> Save Changes
                  </>
               ) : (
                  <>
                     <i className="bi bi-pencil mr-2"></i> Edit Profile
                  </>
               )}
            </button>
         </div>
      </div>
   );
};

export default StudentProfile;
