// import React, { useState, useEffect } from "react";

// const Timer = () => {
//   const totalTestTime = Number(localStorage.getItem("duration")) * 60 * 1000; // Convert to seconds
//   const [leftTime, setLeftTime] = useState(totalTestTime);

//   useEffect(() => {
//     if (leftTime <= 0) return;

//     const timer = setTimeout(() => {
//       setLeftTime((prev) => prev - 1000);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [leftTime]);

//   // Convert seconds to MM:SS format
//   const formatTime = (milliseconds) => {
//     const total_seconds = parseInt(Math.floor(milliseconds / 1000));
//     const total_minutes = parseInt(Math.floor(total_seconds / 60));
//     const total_hours = parseInt(Math.floor(total_minutes / 60));
//     let seconds = parseInt(total_seconds % 60);
//     let minutes = parseInt(total_minutes % 60);
//     let hours = parseInt(total_hours % 60);
//     return `${hours}:${minutes}:${seconds}`;
//   };

//   return (
//     <div className="absolute flex flex-col justify-center items-center bottom-2 right-2 bg-gray-800 p-6  shadow-lg text-center z-3000">
//       <h1 className="font-bold mb-4">🕒</h1>
//       <div className="text-2xl text-white font-mono px-2">
//         {formatTime(leftTime)}
//       </div>

//       {/* Progress Bar */}
//       <div className="w-full bg-gray-800 rounded-full h-4 mt-6 p-3">
//         <div
//           className="bg-green-500 h-2 rounded-full transition-all duration-300"
//           style={{ width: `${(leftTime / totalTestTime) * 100}%` }}
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default Timer;

import React, { useState, useEffect } from "react";

const Timer = () => {
   const totalTestTime = Number(localStorage.getItem("duration")) * 60 * 1000;
   const [leftTime, setLeftTime] = useState(totalTestTime);

   useEffect(() => {
      if (leftTime <= 0) return;
      const timer = setTimeout(() => {
         setLeftTime((prev) => prev - 1000);
      }, 1000);
      return () => clearTimeout(timer);
   }, [leftTime]);

   // Convert milliseconds to HH:MM:SS format
   const formatTime = (milliseconds) => {
      const totalSeconds = Math.floor(milliseconds / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);

      const seconds = String(totalSeconds % 60).padStart(2, "0");
      const minutes = String(totalMinutes % 60).padStart(2, "0");
      const hours = String(totalHours).padStart(2, "0"); // Fix: Correct hours calculation

      return `${hours}:${minutes}:${seconds}`; // Fix: Correct template literal usage
   };

   // Calculate progress percentage
   const progressPercentage = (leftTime / totalTestTime) * 100;

   return (
      <div className="fixed bottom-4 right-4 bg-slate-800 rounded-lg shadow-xl text-center z-5000 p-4 max-w-xs w-64 backdrop-blur-sm bg-opacity-90 border border-slate-700 ">
         <div className="flex items-center justify-center mb-3">
            <span className="text-amber-400 text-2xl mr-2">🕒</span>
            <h1 className="font-bold text-white text-lg">Remaining Time</h1>
         </div>

         <div className="text-3xl text-white font-mono my-3 tracking-wider">
            {formatTime(leftTime)}
         </div>

         {/* Progress Bar */}
         <div className="w-full bg-slate-700 rounded-full h-2 mt-3 overflow-hidden">
            <div
               className={`h-full rounded-full transition-all duration-300 ${
                  progressPercentage > 50
                     ? "bg-emerald-500"
                     : progressPercentage > 20
                     ? "bg-amber-500"
                     : "bg-red-500"
               }`}
               style={{ width: `${progressPercentage}%` }} // Fix: Correct template literal usage
            ></div>
         </div>

         <div className="text-xs text-slate-400 mt-2">
            {Math.floor(progressPercentage)}% remaining
         </div>
      </div>
   );
};

export default Timer;
