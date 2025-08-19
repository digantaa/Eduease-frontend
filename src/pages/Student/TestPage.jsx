import React, { useEffect, useState } from "react";
import axios from "axios";
import Timer from "../../components/CountdownTimer/Timer";
import toast from "react-hot-toast";
import {
   CheckCircle,
   CircleDashed,
   AlertTriangle,
   Clock,
   Award,
   ChevronRight,
} from "lucide-react";

const TestPage = () => {
   const [questions, setQuestions] = useState([]);
   const [currentIndex, setCurrentIndex] = useState(0);
   const [selectedAnswers, setSelectedAnswers] = useState({});
   const [totalMarks, setTotalMarks] = useState(0);
   const [testSubmitted, setTestSubmitted] = useState(false);
   const [questionTimer, setQuestionTimer] = useState(null);
   const [loading, setLoading] = useState(true);
   const totalTime = Number(localStorage.getItem("duration")) * 60 * 1000;
   const perQuestionTime = totalTime / questions?.length;

   const userId = localStorage.getItem("userid");
   const testId = localStorage.getItem("testid");

   useEffect(() => {
      fetchTestContent();

      document.addEventListener("visibilitychange", handleTabLeave);
      return () => {
         document.removeEventListener("visibilitychange", handleTabLeave);
      };
   }, []);

   useEffect(() => {
      if (questions.length > 0) {
         startQuestionTimer();
      }
      return () => clearTimeout(questionTimer);
   }, [currentIndex, questions]); // Restart timer on new question

   // Fetch test data
   const fetchTestContent = async () => {
      setLoading(true);
      try {
         const resp = await axios.get(
            `https://localhost:7013/api/Student/getTestContent?TestId=${testId}`,
            { withCredentials: true }
         );
         setQuestions(resp.data.data);
      } catch (error) {
         console.error("Error fetching test content:", error);
         toast.error("Failed to load test questions");
      } finally {
         setLoading(false);
      }
   };

   // Handle tab switching
   const handleTabLeave = () => {
      if (document.hidden) {
         submitTest();
      }
   };

   // Handle answer selection
   const handleOptionSelect = (option) => {
      const currentQuestion = questions[currentIndex];
      setSelectedAnswers((prev) => ({
         ...prev,
         [currentIndex]: option,
      }));

      if (option === currentQuestion.correctOption) {
         setTotalMarks((prevMarks) => prevMarks + currentQuestion.marks);
      }
   };

   // Start timer for the current question
   const startQuestionTimer = () => {
      clearTimeout(questionTimer);
      const timer = setTimeout(() => handleNextQuestion(), perQuestionTime);
      setQuestionTimer(timer);
   };

   // Move to next question
   const handleNextQuestion = () => {
      if (currentIndex < questions.length - 1) {
         setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
         submitTest();
      }
   };

   // Submit the test
   //    const submitTest = async () => {
   //       if (!testSubmitted) {
   //          setTestSubmitted(true);
   //          clearTimeout(questionTimer);
   //          try {
   //             const resp = await axios.post(
   //                `https://localhost:7013/api/Student/submitTest?studentId=${userId}&testId=${testId}&score=${totalMarks}`,
   //                {},
   //                {
   //                   withCredentials: true,
   //                }
   //             );

   //             console.log("🚀 ~ submitTest ~ resp:", resp.data);
   //             toast.success(resp.data.message);
   //             setTimeout(() => {
   //                window.close();
   //             }, 2000);
   //          } catch (error) {
   //             toast.error(error.message);
   //          }
   //       }
   //    };

   const submitTest = async (score = totalMarks) => {
      if (!testSubmitted) {
         setTestSubmitted(true);
         clearTimeout(questionTimer);
         try {
            const resp = await axios.post(
               `https://localhost:7013/api/Student/submitTest?studentId=${userId}&testId=${testId}&score=${score}`,
               {},
               { withCredentials: true }
            );

            console.log("🚀 ~ submitTest ~ resp:", resp.data);
            toast.success(resp.data.message);
            setTimeout(() => {
               window.close();
            }, 2000);
         } catch (error) {
            toast.error(error.message);
         }
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-[91vh]">
            <div className="flex flex-col items-center">
               <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
               <p className="mt-4 text-gray-600 font-medium">
                  Loading test questions...
               </p>
            </div>
         </div>
      );
   }

   if (questions.length === 0) {
      return (
         <div className="flex items-center justify-center min-h-[91vh]">
            <div className="text-center p-6 rounded-lg border border-gray-200 shadow-sm bg-white max-w-md">
               <AlertTriangle
                  size={48}
                  className="mx-auto text-yellow-500 mb-4"
               />
               <h2 className="text-xl font-bold text-gray-800 mb-2">
                  No Questions Available
               </h2>
               <p className="text-gray-600">
                  Unable to load test questions. Please contact your instructor.
               </p>
            </div>
         </div>
      );
   }

   return (
      <div className="relative p-6 min-h-[91vh] max-w-4xl mx-auto">
         {!testSubmitted ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
               {/* Timer and Progress */}
               <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                     <div className="flex items-center">
                        <Clock className="text-blue-600 mr-2" size={20} />
                        <Timer duration={totalTime} onTimeUp={submitTest} />
                     </div>
                     <div className="text-sm text-gray-600 font-medium">
                        Question {currentIndex + 1} of {questions.length}
                     </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                     <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                           width: `${
                              ((currentIndex + 1) / questions.length) * 100
                           }%`,
                        }}
                     ></div>
                  </div>
               </div>

               {/* Question Content */}
               <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                     <h2 className="text-lg font-bold text-gray-800 flex gap-2 items-start">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                           {currentIndex + 1}
                        </span>
                        <span>{questions[currentIndex].questionText}</span>
                     </h2>
                     <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center">
                        <Award size={14} className="mr-1" />
                        {questions[currentIndex].marks} marks
                     </span>
                  </div>

                  {/* Options */}
                  <div className="space-y-3 mt-6">
                     {["A", "B", "C", "D"].map((key) => (
                        <button
                           key={key}
                           className={`w-full px-4 py-3 rounded-lg border text-left transition-all flex items-center
                              ${
                                 selectedAnswers[currentIndex] === key
                                    ? "bg-blue-50 border-blue-500 ring-2 ring-blue-200"
                                    : "border-gray-200 hover:bg-gray-50"
                              }`}
                           onClick={() => handleOptionSelect(key)}
                        >
                           <span className="flex items-center justify-center h-6 w-6 rounded-full mr-3 bg-gray-100 text-gray-800 text-sm font-medium">
                              {key}
                           </span>
                           <span className="text-gray-800">
                              {questions[currentIndex][`option${key}`]}
                           </span>
                           {selectedAnswers[currentIndex] === key && (
                              <CheckCircle
                                 size={16}
                                 className="ml-auto text-blue-500"
                              />
                           )}
                           {selectedAnswers[currentIndex] !== key && (
                              <CircleDashed
                                 size={16}
                                 className="ml-auto text-gray-300"
                              />
                           )}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Navigation */}
               <div className="flex justify-between mt-8">
                  <div className="text-sm text-gray-600">
                     {Object.keys(selectedAnswers).length} of {questions.length}{" "}
                     questions answered
                  </div>
                  <button
                     className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                     onClick={handleNextQuestion}
                  >
                     {currentIndex === questions.length - 1
                        ? "Submit Test"
                        : "Next Question"}
                     <ChevronRight size={18} className="ml-1" />
                  </button>
               </div>
            </div>
         ) : (
            <div className="flex items-center justify-center min-h-[70vh]">
               <div className="text-center p-8 rounded-lg border border-gray-200 shadow-md bg-white max-w-md">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                     <CheckCircle size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                     Test Submitted!
                  </h2>
                  <p className="text-gray-600 mb-4">
                     Thank you for completing the test.
                  </p>
                  <div className="p-4 bg-blue-50 rounded-lg inline-flex items-center">
                     <Award size={24} className="text-blue-600 mr-2" />
                     <span className="text-xl font-bold text-blue-800">
                        Your score: {totalMarks}
                     </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-6">
                     This window will close automatically in a few seconds.
                  </p>
               </div>
            </div>
         )}
      </div>
   );
};

export default TestPage;
