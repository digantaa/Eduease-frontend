import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Code, Search, Filter, Star, Tag, Clock } from "lucide-react";

const Coding = () => {
   const [questions, setQuestions] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const userId = localStorage.getItem("userid");
   const navigate = useNavigate();

   // Fetch Coding Questions for the Student
   useEffect(() => {
      const fetchCodingQuestions = async () => {
         setLoading(true);
         try {
            const response = await axios.get(
               `https://localhost:7013/api/Student/allCodingQuestion?studentId=${userId}`,
               { withCredentials: true }
            );
            setQuestions(response.data.data || []);
         } catch (error) {
            console.error("Error fetching coding questions:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchCodingQuestions();
   }, [userId]);

   // Filter questions based on search term
   const filteredQuestions = questions.filter(
      (question) =>
         question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
         question.tags.toLowerCase().includes(searchTerm.toLowerCase())
   );

   // Get difficulty color
   const getDifficultyColor = (difficulty) => {
      switch (difficulty?.toLowerCase()) {
         case "easy":
            return "bg-green-50 text-green-700 border-green-200";
         case "medium":
            return "bg-yellow-50 text-yellow-700 border-yellow-200";
         case "hard":
            return "bg-red-50 text-red-700 border-red-200";
         default:
            return "bg-gray-50 text-gray-700 border-gray-200";
      }
   };

   return (
      <div className="flex justify-center  max-w-7xl mx-auto min-h-screen py-6">
         <div className="min-w-full px-4">
            <div className="flex justify-between items-center mb-6">
               <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Code className="mr-2" />
                  Coding Practice
               </h1>
               <div className="flex items-center space-x-2">
                  <Clock className="text-gray-500" size={16} />
                  <span className="text-sm text-gray-500">
                     Last updated: {new Date().toLocaleDateString()}
                  </span>
                  <button
                     className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                     onClick={() => navigate(-1)}
                  >
                     Back
                  </button>
               </div>
            </div>

            <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
               {/* Search bar */}
               <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                     </div>
                     <div style={{ marginLeft: "5px" }}>
                        <input
                           type="text"
                           className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                           placeholder="Search questions or tags..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                  </div>
               </div>

               <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                     Coding Questions{" "}
                     {questions.length > 0 && `(${filteredQuestions.length})`}
                  </h2>

                  {loading ? (
                     <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                     </div>
                  ) : questions.length === 0 ? (
                     <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <p className="text-gray-600">
                           No coding questions available.
                        </p>
                     </div>
                  ) : filteredQuestions.length === 0 ? (
                     <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <p className="text-gray-600">
                           No questions match your search.
                        </p>
                     </div>
                  ) : (
                     <div className="space-y-4">
                        {filteredQuestions.map((question, index) => (
                           <div
                              key={question.id}
                              className={`p-4 cursor-pointer border rounded-lg shadow-sm transition-all
                                 ${
                                    question.status === "Completed"
                                       ? "border-l-4 border-l-green-500"
                                       : question.status === "Pending"
                                       ? "border-l-4 border-l-red-500"
                                       : "border-l-4 border-l-yellow-500"
                                 } bg-white hover:shadow-md hover:translate-y-[-2px]`}
                              onClick={() =>
                                 navigate("/editor", {
                                    state: { selectedQuestion: question },
                                 })
                              }
                           >
                              <div className="flex justify-between items-start">
                                 <h3 className="text-lg font-semibold text-gray-900">
                                    {index + 1}. {question.question}
                                 </h3>
                                 <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${
                                       question.status === "Completed"
                                          ? "bg-green-100 text-green-800"
                                          : question.status === "Pending"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-yellow-100 text-yellow-800"
                                    }`}
                                 >
                                    {question.status}
                                 </span>
                              </div>

                              <div className="mt-2 flex flex-wrap gap-2">
                                 <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getDifficultyColor(
                                       question.difficulty
                                    )}`}
                                 >
                                    <Star size={12} className="mr-1" />
                                    {question.difficulty}
                                 </span>

                                 {question.tags
                                    .split(",")
                                    .map((tag, tagIndex) => (
                                       <span
                                          key={tagIndex}
                                          className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                                       >
                                          <Tag size={12} className="mr-1" />
                                          {tag.trim()}
                                       </span>
                                    ))}
                              </div>

                              <div className="mt-3 flex justify-between items-center">
                                 <p className="text-sm text-gray-600">
                                    {question.description?.substring(0, 100) ||
                                       "Solve this coding challenge to improve your skills"}
                                    ...
                                 </p>
                                 <span className="text-blue-600 text-sm font-medium">
                                    Solve →
                                 </span>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>

               {!loading && questions.length > 0 && (
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                     <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                           Showing {filteredQuestions.length} of{" "}
                           {questions.length} questions
                        </p>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default Coding;
