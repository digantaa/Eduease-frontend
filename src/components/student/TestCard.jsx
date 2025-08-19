import React, { useState } from "react";
import TestInstructions from "./TestInstructions";

const TestCard = ({ test }) => {
   const [showInstructions, setShowInstructions] = useState(false);

   const handleTestStart = () => {
      localStorage.setItem("duration", test.duration);
      localStorage.setItem("testid", test.testId);

      window.open("/test", "_blank");
   };

   return (
      <div className="max-w-7xl mx-auto w-[20vw] h-[40vh] bg-white shadow-md p-4 mb-4 border">
         <h3 className="text-lg font-semibold">{test?.subject}</h3>
         <p className="text-gray-600">Teacher: {test.teacherName}</p>
         <p className="text-gray-600">Duration: {test.duration} min</p>
         <p className="text-gray-600">Total Marks: {test.totalMarks}</p>
         <p className="text-gray-600">Score: {test.score}</p>
         <p
            className={`w-28 mt-2 px-3 py-1 rounded-lg text-sm font-bold ${
               test.status === "Completed"
                  ? "bg-green-200 text-green-800"
                  : "bg-yellow-200 text-yellow-800"
            }`}
         >
            {test.status}
         </p>

         {test.status === "Pending" && (
            <button
               onClick={() => setShowInstructions(true)}
               className="mt-3 bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
            >
               Start Test
            </button>
         )}

         {/* Conditionally Render TestInstructions Modal */}
         {showInstructions && (
            <TestInstructions
               duration={test.duration}
               marks={test.totalMarks}
               onClose={() => setShowInstructions(false)}
               onStartTest={() => {
                  handleTestStart();
                  setShowInstructions(false);
                  // Redirect to test page if needed
               }}
            />
         )}
      </div>
   );
};

export default TestCard;
