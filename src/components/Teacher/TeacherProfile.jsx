import React from "react";
import {
   Mail,
   MapPin,
   Phone,
   Calendar,
   BookOpen,
   GraduationCap,
   Layers,
} from "lucide-react";

const TeacherProfile = ({ teacher }) => {
   if (!teacher) return null;

   return (
      <div className="mt-10 px-4 max-w-[60vw] mx-auto">
         {/* Profile Card */}
         <div className="relative bg-white rounded-2xl overflow-hidden">
            {/* Header Background */}
            <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

            {/* Profile Image */}
            <div className="relative -mt-12 flex justify-center">
               <div className="absolute rounded-full border-4 border-white bg-white h-28 w-28"></div>
               <img
                  src={`https://localhost:7013/${teacher.image}`}
                  alt={teacher.username}
                  className="relative rounded-full border-4 border-white h-28 w-28 object-cover z-10"
               />
            </div>

            {/* Profile Content */}
            <div className="pt-3 pb-6 px-6">
               <h2 className="text-2xl font-bold text-center text-gray-800 mt-2">
                  {teacher.username}
               </h2>
               <p className="text-center text-gray-500 text-sm mb-6">
                  {teacher.subject} Teacher
               </p>

               {/* Contact Info Section */}
               <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h3 className="text-gray-700 font-medium mb-3">
                     Contact Information
                  </h3>
                  <div className="space-y-3">
                     <div className="flex items-center gap-3 text-gray-600">
                        <div className="bg-indigo-100 p-2 rounded-full">
                           <Mail size={16} className="text-indigo-600" />
                        </div>
                        <div>
                           <p className="text-xs text-gray-500">Email</p>
                           <p className="text-sm">{teacher.email}</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-3 text-gray-600">
                        <div className="bg-indigo-100 p-2 rounded-full">
                           <MapPin size={16} className="text-indigo-600" />
                        </div>
                        <div>
                           <p className="text-xs text-gray-500">Address</p>
                           <p className="text-sm">{teacher.address}</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-3 text-gray-600">
                        <div className="bg-indigo-100 p-2 rounded-full">
                           <Phone size={16} className="text-indigo-600" />
                        </div>
                        <div>
                           <p className="text-xs text-gray-500">Phone</p>
                           <p className="text-sm">{teacher.mobile}</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Academic Info Section */}
               <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-gray-700 font-medium mb-3">
                     Academic Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                     <div className="flex items-center gap-2 text-gray-600">
                        <div className="bg-purple-100 p-2 rounded-full">
                           <GraduationCap
                              size={16}
                              className="text-purple-600"
                           />
                        </div>
                        <div>
                           <p className="text-xs text-gray-500">Year</p>
                           <p className="text-sm font-medium">{teacher.year}</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-2 text-gray-600">
                        <div className="bg-purple-100 p-2 rounded-full">
                           <Calendar size={16} className="text-purple-600" />
                        </div>
                        <div>
                           <p className="text-xs text-gray-500">Semester</p>
                           <p className="text-sm font-medium">
                              {teacher.semester}
                           </p>
                        </div>
                     </div>

                     <div className="flex items-center gap-2 text-gray-600">
                        <div className="bg-purple-100 p-2 rounded-full">
                           <BookOpen size={16} className="text-purple-600" />
                        </div>
                        <div>
                           <p className="text-xs text-gray-500">
                              Primary Subject
                           </p>
                           <p className="text-sm font-medium">
                              {teacher.subject}
                           </p>
                        </div>
                     </div>

                     <div className="flex items-center gap-2 text-gray-600">
                        <div className="bg-purple-100 p-2 rounded-full">
                           <Layers size={16} className="text-purple-600" />
                        </div>
                        <div>
                           <p className="text-xs text-gray-500">All Subjects</p>
                           <p className="text-sm font-medium truncate">
                              {teacher.subjects}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default TeacherProfile;
