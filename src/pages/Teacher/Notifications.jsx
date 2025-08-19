import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/store";

// ⏱ Time-ago formatter
const getTimeAgo = (dateString) => {
   const now = new Date();
   const date = new Date(dateString);
   const seconds = Math.floor((now - date) / 1000);

   const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
   ];

   for (let i = 0; i < intervals.length; i++) {
      const interval = intervals[i];
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
         return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
   }

   return "Just now";
};

const Notifications = () => {
   const [pendingApplications, setPendingApplications] = useState([]);

   const navigate = useNavigate();
   const userId = localStorage.getItem("userid");
   const { setNotifications } = useStore();

   useEffect(() => {
      localStorage.setItem("noofnotifications", pendingApplications?.length);
      setNotifications(pendingApplications?.length || 0);
   }, [pendingApplications]);

   useEffect(() => {
      fetchTeacher();
   }, []);

   const fetchTeacher = async () => {
      try {
         const response = await axios.get(
            `https://localhost:7013/api/teacher/${userId}`,
            { withCredentials: true }
         );
         setPendingApplications(response.data.applications || []);
         setNotifications(response.data.applications?.length || 0);
      } catch (err) {
         if (err.response?.status === 400) {
            toast.error("You need to login first.");
            navigate("/Login");
         } else if (err.response?.status === 401) {
            toast.error("You are not authorized to use this page.");
            navigate("/Login");
         }
      }
   };

   const handleApplicationResponse = async (
      applicationId,
      senderId,
      status
   ) => {
      try {
         await axios.put(
            `https://localhost:7013/api/teacher/applicationresponse/${applicationId}`,
            {
               status,
               applicationId,
               receiverId: senderId,
               senderId: userId,
            },
            { withCredentials: true }
         );
         setPendingApplications((prev) =>
            prev.filter((app) => app.applicationId !== applicationId)
         );
         toast.success(`Application ${status.toLowerCase()} successfully.`);
      } catch (error) {
         console.error(`Error updating application status: ${status}`, error);
         toast.error("Failed to update application status.");
      }
   };

   return (
      <div className="max-w-[40vw] mt-6 p-6 mx-auto bg-white rounded-xl shadow-sm">
         <div className="flex flex-col gap-5">
            {/* Header with notification count */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
               <h2 className="text-2xl font-semibold text-gray-800">
                  Notifications
               </h2>
               {pendingApplications.length > 0 && (
                  <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                     {pendingApplications.length}
                  </span>
               )}
            </div>

            {/* Empty state */}
            {pendingApplications.length === 0 ? (
               <NoPendingApplication />
            ) : (
               <PendingApplications
                  pendingApplications={pendingApplications}
                  handleApplicationResponse={handleApplicationResponse}
               />
            )}

            {/* Footer with count */}
            {pendingApplications.length >= 5 && (
               <div className="text-sm text-gray-500 text-center mt-4 border-t border-gray-100 pt-4">
                  Showing {pendingApplications.length} notifications
               </div>
            )}
         </div>
      </div>
   );
};

export default Notifications;

function NoPendingApplication() {
   return (
      <div className="flex flex-col items-center justify-center py-12">
         <div className="bg-gray-100 p-4 rounded-full mb-4">
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="24"
               height="24"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               stroke-width="2"
               stroke-linecap="round"
               stroke-linejoin="round"
               className="text-gray-400"
            >
               <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
         </div>
         <p className="text-gray-500 font-medium">No notifications available</p>
         <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
      </div>
   );
}

function PendingApplications({
   pendingApplications,
   handleApplicationResponse,
}) {
   const alternateImage =
      "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=";

   return (
      <div className="space-y-5">
         {pendingApplications.map((app, index) => (
            <div
               key={index}
               className="flex flex-col md:flex-row gap-4 rounded-xl p-5 bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
               <div className="flex items-start gap-4">
                  <div className="relative">
                     <img
                        src={
                           app?.senderImage
                              ? `https://localhost:7013/${app.senderImage.replace(
                                   /\\/g,
                                   "/"
                                )}`
                              : alternateImage
                        }
                        alt={app?.senderName || "Applicant"}
                        className="w-14 h-14 object-cover rounded-full border-2 border-gray-100 shadow-sm"
                        onError={(e) => {
                           e.target.src = alternateImage;
                        }}
                     />
                     <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                     <h3 className="font-semibold text-gray-900 text-lg">
                        {app?.senderName}
                     </h3>
                     <p className="text-sm text-gray-500">
                        Applied{" "}
                        {app.dateApplied
                           ? getTimeAgo(app.dateApplied)
                           : "just now"}
                     </p>
                  </div>
               </div>

               <div className="flex-1 flex flex-col md:ml-2">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                     <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Application Message:
                     </h4>
                     <p className="text-gray-700">{app.leaveReason}</p>
                  </div>

                  <div className="flex gap-3 mt-auto">
                     <button
                        className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors text-white text-sm font-medium rounded-lg shadow-sm"
                        onClick={() =>
                           handleApplicationResponse(
                              app.applicationId,
                              app.senderId,
                              "Approved"
                           )
                        }
                     >
                        Approve
                     </button>
                     <button
                        className="flex-1 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors text-gray-700 text-sm font-medium rounded-lg shadow-sm"
                        onClick={() =>
                           handleApplicationResponse(
                              app.applicationId,
                              app.senderId,
                              "Rejected"
                           )
                        }
                     >
                        Decline
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>
   );
}
