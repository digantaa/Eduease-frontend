import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootswatch/dist/lux/bootstrap.min.css";
import ArrowUpwardTwoToneIcon from "@mui/icons-material/ArrowUpwardTwoTone";
import ArrowDownwardTwoToneIcon from "@mui/icons-material/ArrowDownwardTwoTone";
function GetAllStudents() {
   const [students, setStudents] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [query, setQuery] = useState("");
   const [sortField, setSortField] = useState("name");
   const [sortOrder, setSortOrder] = useState("asc");
   const navigate = useNavigate();
   const searchInputRef = useRef(null);

   useEffect(() => {
      const fetchStudents = async () => {
         try {
            const response = await axios.get(
               "https://localhost:7013/api/admin/AllStudents",
               { withCredentials: true }
            );
            setStudents(response.data);
         } catch (err) {
            if (err.response?.status === 401) {
               toast.error("You are not authorized to access this page.");
               navigate("/Login");
            }
            setError("Error fetching students");
         } finally {
            setLoading(false);
         }
      };
      fetchStudents();
   }, []);

   const handleDelete = async (studentID) => {
      if (!window.confirm("Are you sure you want to delete this student?"))
         return;

      try {
         await axios.delete(
            `https://localhost:7013/api/Admin/delete/student/${studentID}`,
            {
               withCredentials: true,
            }
         );

         toast.success("Student deleted successfully!");

         // Remove the deleted student from state
         setStudents((prevStudents) =>
            prevStudents.filter((student) => student.id !== studentID)
         );
      } catch (err) {
         console.error("Error deleting student:", err);
         toast.error("Failed to delete student. Please try again.");
      }
   };

   const handleSearch = async () => {
      try {
         const response = await axios.get(
            `https://localhost:7013/api/admin/student?Username=${query}`,
            { withCredentials: true }
         );
         setStudents(response.data.students);
      } catch (error) {
         console.error("Error fetching students:", error);
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
         setStudents(response.data);
         setSortField(field);
         setSortOrder(newSortOrder);
      } catch (err) {
         if (err.response?.status === 401) {
            toast.error("You are not authorized to access this page.");
            navigate("/Login");
         }
         setError("Error fetching students");
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
         <h2 className="text-center mb-4">All Students</h2>
         <div className="input-group mb-4">
            <input
               ref={searchInputRef}
               type="text"
               className="form-control"
               placeholder="Search students..."
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
                  <th>Actions</th>
               </tr>
            </thead>
            <tbody>
               {students.map((student) => (
                  <tr key={student.id}>
                     <td>{student.name}</td>
                     <td>{student.email}</td>
                     <td>
                        <button
                           className="btn btn-primary me-2"
                           onClick={() =>
                              navigate(`/view-student/${student.id}`)
                           }
                        >
                           View
                        </button>
                        <button
                           className="btn btn-warning me-2"
                           onClick={() =>
                              navigate(`/edit-student/${student.id}`)
                           }
                        >
                           Edit
                        </button>
                        <button
                           className="btn btn-danger"
                           onClick={() => handleDelete(student.id)}
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

export default GetAllStudents;
