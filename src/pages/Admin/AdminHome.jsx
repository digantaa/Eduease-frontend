import React from "react";
import { useNavigate } from "react-router-dom";

function AdminHome() {
   const navigate = useNavigate();

   const handleManageStudents = () => {
      navigate("/admin/allstudents");
   };

   const handleManageTeachers = () => {
      navigate("/admin/teachers");
   };

   const handleManageUsers = () => {
      navigate("/admin/users");
   };
   if (localStorage.getItem("role") !== "Admin") {
      return (
         <div className="min-h-[70vh] flex items-center justify-center">
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
      <div className="container mt-5 min-h-[80vh]">
         <h2 className="text-center mb-4">Admin Dashboard</h2>

         <div className="row row-cols-1 row-cols-md-3 g-4">
            {/* Manage Students */}
            <div className="col">
               <div
                  className="card bg-primary text-white p-4 cursor-pointer"
                  onClick={handleManageStudents}
               >
                  <h3 className="card-title">Manage Students</h3>
                  <p className="card-text">
                     View, add, edit, or remove students.
                  </p>
               </div>
            </div>

            {/* Manage Teachers */}
            <div className="col">
               <div
                  className="card bg-success text-white p-4 cursor-pointer"
                  onClick={handleManageTeachers}
               >
                  <h3 className="card-title">Manage Teachers</h3>
                  <p className="card-text">
                     View, add, edit, or remove teachers.
                  </p>
               </div>
            </div>

            {/* Manage Users */}
            <div className="col">
               <div
                  className="card bg-warning text-white p-4 cursor-pointer"
                  onClick={handleManageUsers}
               >
                  <h3 className="card-title">Manage Users</h3>
                  <p className="card-text">View, add, edit, or remove users.</p>
               </div>
            </div>

            {/* add timetable */}
            <div className="col">
               <div
                  className="card bg-warning text-white p-4 cursor-pointer"
                  onClick={() => navigate("/admin/add-time-table")}
               >
                  <h3 className="card-title">Manage Timetable</h3>
                  <p className="card-text">Manage Timetable</p>
               </div>
            </div>
         </div>

         {/* Logout Button */}
         <div className="mt-4 text-center">
            <button
               onClick={() => navigate("/logout")} // Assuming you have a logout route
               className="btn btn-danger w-100"
            >
               Logout
            </button>
         </div>
      </div>
   );
}

export default AdminHome;
