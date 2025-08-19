import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootswatch/dist/lux/bootstrap.min.css";
import ArrowUpwardTwoToneIcon from "@mui/icons-material/ArrowUpwardTwoTone";
import ArrowDownwardTwoToneIcon from "@mui/icons-material/ArrowDownwardTwoTone";

function ManageTeachers() {
   const [teachers, setTeachers] = React.useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [query, setQuery] = useState("");
   const [sortField, setSortField] = useState("name");
   const [sortOrder, setSortOrder] = useState("asc");
   const navigate = useNavigate();
   const searchInputRef = useRef(null);

   useEffect(() => {
      const fetchTeachers = async () => {
         try {
            const response = await axios.get(
               "https://localhost:7013/api/Admin/allTeachers",
               { withCredentials: true }
            );
            console.log("🚀 ~ fetchTeachers ~ response:", response);
            setTeachers(response.data);
         } catch (err) {
            if (err.response?.status === 401) {
               toast.error("You are not authorized to access this page.");
               navigate("/Login");
            }
            setError("Error fetching teachers");
         } finally {
            setLoading(false);
         }
      };
      fetchTeachers();
   }, []);

   const handleDelete = async (teacherID) => {
      if (!window.confirm("Are you sure you want to delete this teacher?"))
         return;

      console.log("🚀 ~ handleDelete ~ teacherID:", teacherID);
      try {
         const resp = await axios.delete(
            `https://localhost:7013/api/Admin/delete/teacher?id=${teacherID}`,
            {
               withCredentials: true,
            }
         );
         console.log(resp.data, "teacher delete data,,,,,,,,,,,,");
         toast.success("Teacher deleted successfully!");

         // Remove the deleted teacher from state
         setTeachers((prevStudents) =>
            prevStudents.filter((teacher) => teacher.id !== teacherID)
         );
      } catch (err) {
         console.error("Error deleting teacher:", err);
         toast.error("Failed to delete teacher. Please try again.");
      }
   };

   const handleSearch = async () => {
      try {
         const response = await axios.get(
            `https://localhost:7013/api/admin/teacher?Username=${query}`,
            { withCredentials: true }
         );
         console.log("🚀 ~ handleDelete ~ resp:", resp);
         console.log("🚀 ~ handleDelete ~ resp:", resp);
         console.log("🚀 ~ handleDelete ~ resp:", resp);
         console.log("🚀 ~ handleDelete ~ resp:", resp);
         setTeachers(response.data.teachers);
      } catch (error) {
         console.error("Error fetching teachers:", error);
      }
      searchInputRef.current?.focus();
   };

   const handleSort = async (field) => {
      const newSortOrder =
         sortField === field && sortOrder === "asc" ? "desc" : "asc";

      console.log(newSortOrder);

      try {
         const response = await axios.get(
            `https://localhost:7013/api/admin/AllStudents?sortField=${field}&sortOrder=${newSortOrder}`,
            { withCredentials: true }
         );
         setTeachers(response.data);
         setSortField(field);
         setSortOrder(newSortOrder);
      } catch (err) {
         if (err.response?.status === 401) {
            toast.error("You are not authorized to access this page.");
            navigate("/Login");
         }
         setError("Error fetching teachers");
      }
   };

   if (loading) return <div className="text-center mt-5">Loading...</div>;
   if (error)
      return <div className="text-center text-danger mt-5">{error}</div>;
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
      <div className="container mt-5 min-h-[80vh]">
         <h2 className="text-center mb-4">All Teachers</h2>
         <div className="input-group mb-4">
            <input
               ref={searchInputRef}
               type="text"
               className="form-control"
               placeholder="Search teachers..."
               value={query}
               onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-danger" onClick={handleSearch}>
               Search
            </button>
         </div>

         <table className="table table-hover">
            <thead>
               <tr>
                  <th onClick={() => handleSort("name")} className="sortable">
                     Name{" "}
                     {sortOrder === "asc" ? (
                        <ArrowUpwardTwoToneIcon />
                     ) : (
                        <ArrowDownwardTwoToneIcon />
                     )}
                  </th>
                  <th onClick={() => handleSort("email")} className="sortable">
                     Email
                     {sortOrder === "asc" ? (
                        <ArrowUpwardTwoToneIcon />
                     ) : (
                        <ArrowDownwardTwoToneIcon />
                     )}
                  </th>
                  <th>Year</th>
                  <th>Subject</th>
                  <th>Actions</th>
               </tr>
            </thead>
            <tbody>
               {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                     <td>{teacher.username}</td>
                     <td>{teacher.email}</td>
                     <td>{teacher.year}</td>
                     <td>{teacher.subject}</td>
                     <td>
                        <button
                           className="btn btn-primary me-2"
                           onClick={() =>
                              navigate(`/view-teacher/${teacher.id}`)
                           }
                        >
                           View
                        </button>
                        <button
                           className="btn btn-warning me-2"
                           onClick={() =>
                              navigate(`/edit-teacher/${teacher.id}`)
                           }
                        >
                           Edit
                        </button>
                        <button
                           className="btn btn-danger"
                           onClick={() => handleDelete(teacher.id)}
                        >
                           Delete
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default ManageTeachers;
