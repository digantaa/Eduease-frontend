import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const ManageUsers = () => {
   const [users, setUsers] = React.useState([]);
   const [page, setPage] = useState(1);
   const [pageSize] = useState(5); // Adjust page size as needed
   const [totalPages, setTotalPages] = useState(1);

   useEffect(() => {
      fetchUsers();
   }, [page]);

   const fetchUsers = async () => {
      try {
         const response = await axios.get(
            `https://localhost:7013/api/Admin/allUsers?page=${page}&pageSize=${pageSize}`,
            { withCredentials: true }
         );

         setUsers(response.data.data);
         setTotalPages(response.data.totalPages);
      } catch (error) {
         console.error("Error fetching users:", error);
      }
   };

   const handleDelete = async (userId) => {
      if (!window.confirm("Are you sure you want to delete this user?")) return;
      try {
         await axios.delete(
            `https://localhost:7013/api/Admin/deleteUser/${userId}`,
            { withCredentials: true }
         );

         fetchUsers();
      } catch (error) {
         console.error("Error deleting user:", error);
      }
   };
   if (localStorage.getItem("role") !== "Admin") {
      return (
         <div className="flex items-center justify-center h-screen">
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
      <div className="container mx-auto p-6 min-h-[80vh]">
         <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Users</h2>

         <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="w-full border-collapse">
               <thead>
                  <tr className="bg-gray-200">
                     <th className="p-3 text-left">Name</th>
                     <th className="p-3 text-left">Year</th>
                     <th className="p-3 text-left">Role</th>
                     <th className="p-3 text-left">Email</th>
                     <th className="p-3 text-center">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {users.length > 0 ? (
                     users.map((user) => (
                        <tr
                           key={user.id}
                           className="border-b hover:bg-gray-100"
                        >
                           <td className="p-3">{user.username}</td>
                           <td className="p-3">{user.year}</td>
                           <td className="p-3">{user.role}</td>
                           <td className="p-3">{user.email}</td>
                           <td className="p-3 flex justify-center space-x-3">
                              <button className="text-blue-500 hover:text-blue-700">
                                 <Eye className="w-5 h-5" />
                              </button>
                              <button className="text-yellow-500 hover:text-yellow-700">
                                 <Pencil className="w-5 h-5" />
                              </button>
                              <button
                                 className="text-red-500 hover:text-red-700"
                                 onClick={() => handleDelete(user.id)}
                              >
                                 <Trash className="w-5 h-5" />
                              </button>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td
                           colSpan="4"
                           className="text-center p-4 text-gray-500"
                        >
                           No users found.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* Pagination Controls */}
         <div className="flex justify-center mt-4">
            <button
               className="p-2 bg-gray-300 rounded-md mx-2 disabled:opacity-50"
               onClick={() => setPage(page - 1)}
               disabled={page === 1}
            >
               <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="p-2">{`Page ${page} of ${totalPages}`}</span>
            <button
               className="p-2 bg-gray-300 rounded-md mx-2 disabled:opacity-50"
               onClick={() => setPage(page + 1)}
               disabled={page === totalPages}
            >
               <ChevronRight className="w-5 h-5" />
            </button>
         </div>
      </div>
   );
};

export default ManageUsers;
