import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CodeEditor from "../../components/student/CodeEditor";

const Editor = () => {
   const [selectedQuestion, setSelectedQuestion] = useState(null);
   const location = useLocation();
   const sq = location.state?.selectedQuestion;
   const navigate = useNavigate();

   useEffect(() => {
      setSelectedQuestion(sq);
   }, [sq]);

   return (
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
         {/* Main Layout */}
         <div className="flex w-full h-screen">
            {/* Left Panel - Question Details */}
            <div
               className="w-[40vw] border-r border-gray-300 p-6 bg-gray-100"
               style={{ padding: "30px" }}
            >
               {selectedQuestion ? (
                  <div className="space-y-4">
                     <h2 className="text-2xl font-semibold text-gray-900">
                        {selectedQuestion.question}
                     </h2>
                 
                     <div className="text-sm text-gray-700">
                        <p>
                           <span className="font-medium text-blue-600">
                              Difficulty:
                           </span>{" "}
                           {selectedQuestion.difficulty}
                        </p>
                        <p>
                           <span className="font-medium text-blue-600">
                              Tags:
                           </span>{" "}
                           {selectedQuestion.tags}
                        </p>
                        <p>
                           <span className="font-medium text-blue-600">
                              Sample Input:
                           </span>{" "}
                           <code className="bg-gray-200 px-2 py-1 rounded-md">
                              {selectedQuestion.sampleInput}
                           </code>
                        </p>
                        <p>
                           <span className="font-medium text-blue-600">
                              Expected Output:
                           </span>{" "}
                           <code className="bg-gray-200 px-2 py-1 rounded-md">
                              {selectedQuestion.expectedOutput}
                           </code>
                        </p>
                        <p>
                           <span className="font-medium text-blue-600">
                              Explanation:
                           </span>{" "}
                           {selectedQuestion.explanation}
                        </p>
                        <p>
                           <span className="font-medium text-blue-600">
                              Input Format:
                           </span>{" "}
                           {selectedQuestion.inputFormat}
                        </p>
                     </div>
                  </div>
               ) : (
                  <div className="flex items-center justify-center h-full">
                     <p className="text-lg text-gray-500">
                        Select a question to start coding
                     </p>
                  </div>
               )}
            </div>
            {/* Right Panel - Code Editor */}
            <div className="w-[60vw] flex flex-col bg-white">
               <div className="h-full border rounded-lg shadow-md overflow-hidden flex-1">
                  {selectedQuestion ? (
                     <CodeEditor
                        questionId={selectedQuestion.id}
                        selectedQuestion={selectedQuestion}
                     />
                  ) : (
                     <div className="flex items-center justify-center h-full text-gray-500">
                        No question selected
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default Editor;
