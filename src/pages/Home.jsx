import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
   Users,
   GraduationCap,
   Bell,
   BookOpen,
   Calendar,
   ClipboardList,
   ArrowRight,
} from "lucide-react";

const Home = () => {
   const navigate = useNavigate();
   const features = [
      {
         icon: Users,
         title: "Student Management",
         description: "Comprehensive student profile tracking and management",
         color: "text-blue-500",
         bgColor: "bg-blue-50",
      },
      {
         icon: GraduationCap,
         title: "Academic Tracking",
         description: "Monitor academic progress and performance metrics",
         color: "text-green-500",
         bgColor: "bg-green-50",
      },
      {
         icon: Bell,
         title: "Real-time Alerts",
         description: "Instant notifications for important updates and events",
         color: "text-orange-500",
         bgColor: "bg-orange-50",
      },
      {
         icon: BookOpen,
         title: "Course Management",
         description: "Streamline course creation and enrollment processes",
         color: "text-purple-500",
         bgColor: "bg-purple-50",
      },
      {
         icon: Calendar,
         title: "Schedule Planner",
         description: "Integrated academic and event scheduling system",
         color: "text-teal-500",
         bgColor: "bg-teal-50",
      },
      {
         icon: ClipboardList,
         title: "Assignment Tracking",
         description: "Efficient assignment submission and grading workflow",
         color: "text-indigo-500",
         bgColor: "bg-indigo-50",
      },
   ];

   return (
      <div className="relative flex flex-col gap-20">
         {/* Hero Section with Gradient Background */}
         <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 py-24">
            <div className="container mx-auto flex flex-wrap items-center justify-between px-6 md:px-10">
               {/* Left Section */}
               <div className="w-full lg:w-1/2 text-left px-4 md:px-6 mb-12 lg:mb-0">
                  <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                     <span className="text-blue-600">Modern</span> Student
                     Management System
                  </h1>
                  <p className="text-xl text-gray-700 max-w-2xl mb-10 leading-relaxed">
                     Empower educational institutions with comprehensive,
                     user-friendly student management tools designed for the
                     digital age.
                  </p>

                  <div className="flex flex-wrap gap-4">
                     <button
                        className="bg-blue-600 w-1/2 p-3 font-medium text-white flex items-center gap-2 hover:bg-blue-700 transform transition-all duration-300 hover:translate-y-1"
                        onClick={() => navigate("/login")}
                     >
                        Get Started
                        <ArrowRight size={18} />
                     </button>
                     <button
                        className="bg-blue-600 w-1/2 p-3 font-medium text-white flex items-center gap-2 hover:bg-blue-700 transform transition-all duration-300 hover:translate-y-1"
                        onClick={() => navigate("/parent/auth")}
                     >
                        As Parent
                        <ArrowRight size={18} />
                     </button>
                  </div>
               </div>

               {/* Right Section (Image) with decorative elements */}
               <div className="w-full h-screen lg:w-1/2 flex justify-center items-center relative">
                  {/* Decorative Bubbles */}
                  <div className="absolute top-10 left-10 w-24 h-24 bg-blue-100 rounded-full opacity-50 animate-pulse-slow"></div>
                  <div className="absolute bottom-10 right-10 w-36 h-36 bg-indigo-100 rounded-full opacity-60 animate-float"></div>
                  <div className="absolute bottom-32 left-32 w-28 h-28 bg-purple-100 rounded-full opacity-50 animate-float-reverse"></div>
                  <div className="absolute bottom-60 right-60 w-20 h-20 bg-blue-200 rounded-full opacity-40 animate-bounce-slow"></div>
                  <div className="absolute bottom-80 right-[50vw] w-20 h-20 bg-blue-200 rounded-full opacity-40 animate-bounce-slow"></div>

                  {/* Image Container */}
                  <div className="relative z-10 border-8 border-white shadow-xl rounded-3xl overflow-hidden animate-fade-in">
                     <img
                        src="/public/estudent_LP5-removebg-preview.png"
                        alt="Student Management"
                        className="w-full max-w-md object-cover"
                     />
                  </div>
               </div>
            </div>
         </div>

         {/* Features Section */}
         <div className="container mx-auto px-6 md:px-16 py-20">
            <div className="text-center mb-16">
               <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                  FEATURES
               </span>
               <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-5">
                  Powerful Tools for Modern Education
               </h2>
               <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  Designed to simplify educational administration and enhance
                  communication between students, teachers, and administrators.
               </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {features.map((feature, index) => (
                  <div
                     key={index}
                     className="bg-white border border-gray-100 p-8 rounded-xl hover:border-blue-200 transition-all duration-300 group"
                  >
                     <div
                        className={`flex items-center justify-center w-16 h-16 rounded-lg ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}
                     >
                        <feature.icon
                           className={`w-8 h-8 ${feature.color}`}
                           strokeWidth={1.5}
                        />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {feature.title}
                     </h3>
                     <p className="text-gray-600">{feature.description}</p>
                  </div>
               ))}
            </div>
         </div>

         {/* Testimonial Section with Gradient */}
         <div className=" text-white py-20 rounded-t-3xl">
            <div className="container mx-auto px-6 md:px-16">
               <div className="max-w-4xl mx-auto">
                  <div className="flex justify-center mb-8">
                     <div className="flex -space-x-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-lg font-bold">
                           AS
                        </div>
                        <div className="w-12 h-12 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-lg font-bold">
                           MK
                        </div>
                        <div className="w-12 h-12 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-lg font-bold">
                           JL
                        </div>
                     </div>
                  </div>

                  <h2 className="text-3xl font-bold mb-8 text-center">
                     Trusted by Educational Institutions Worldwide
                  </h2>

                  <blockquote className="text-2xl italic mb-8 leading-relaxed text-center">
                     "This system has transformed how we manage student
                     information, making administrative tasks more efficient and
                     streamlined."
                  </blockquote>

                  <div className="flex flex-col items-center">
                     <p className="text-lg font-semibold">Avneet Singh</p>
                     <p className="text-blue-200">
                        Head of Administration, International Academy
                     </p>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex justify-center mt-6">
                     {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                           key={star}
                           className="w-6 h-6 text-yellow-300 mx-1"
                           fill="currentColor"
                           viewBox="0 0 20 20"
                        >
                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Home;
