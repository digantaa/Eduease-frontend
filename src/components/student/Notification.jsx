import React from "react";

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

const Notification = ({
   notifications = [],
   noNotificationsMessage = "No notifications available",
   handleMarkAsRead,
}) => {
   return (
      <div className="max-w-[40vw] mt-6 p-6 mx-auto">
         <div className="flex flex-col gap-4">
            {/* Header with optional count */}
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-semibold text-gray-800">
                  Notifications
               </h2>
               {notifications.length > 0 && (
                  <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                     {notifications.length}
                  </span>
               )}
            </div>

            {/* Empty state */}
            {notifications.length === 0 ? (
               <NoNotification
                  noNotificationsMessage={noNotificationsMessage}
               />
            ) : (
               <Notifications
                  notifications={notifications}
                  handleMarkAsRead={handleMarkAsRead}
               />
            )}

            {/* Optional footer */}
            {notifications.length >= 5 && (
               <div className="text-sm text-gray-500 text-center mt-6 border-t pt-4">
                  Showing {notifications.length} notifications
               </div>
            )}
         </div>
      </div>
   );
};

export default Notification;

function Notifications({ notifications, handleMarkAsRead }) {
   if (!notifications || notifications.length === 0) {
      return <NoNotification noNotificationsMessage="No new notifications" />;
   }

   return (
      <div className="space-y-4">
         {notifications.map((note, index) => {
            const isApproved = note.message
               ?.toLowerCase()
               ?.includes("approved");
            const statusColor = isApproved ? "emerald" : "red";

            return (
               <div
                  key={index}
                  className={`relative overflow-hidden rounded-xl border border-${statusColor}-100 bg-gradient-to-br from-white to-${statusColor}-50 p-5 transition-all duration-300 hover:border-${statusColor}-200 hover:from-${statusColor}-50 hover:to-white`}
               >
                  {/* Status indicator line */}
                  <div
                     className={`absolute left-0 top-0 h-full w-1 bg-${statusColor}-400`}
                  ></div>

                  <div className="flex gap-4">
                     {/* Profile image with status ring */}
                     <div
                        className={`relative shrink-0 rounded-full ring-2 ring-${statusColor}-200 ring-offset-2`}
                     >
                        <img
                           src={
                              `https://localhost:7013/${note?.senderImage?.replace(
                                 /\\/g,
                                 "/"
                              )}` ||
                              "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ="
                           }
                           alt="Notification"
                           className="h-12 w-12 rounded-full object-cover"
                        />
                        <span
                           className={`absolute bottom-0 right-0 h-3 w-3 rounded-full bg-${statusColor}-400 ring-2 ring-white`}
                        ></span>
                     </div>

                     {/* Content area */}
                     <div className="flex-1">
                        <div className="flex items-start justify-between">
                           <div>
                              <h5 className="font-semibold text-gray-900">
                                 {note.senderName}
                              </h5>
                              <p className="mt-1 text-gray-700">
                                 {note.message}
                              </p>
                           </div>

                           {/* Mark as read button */}
                           {handleMarkAsRead && (
                              <button
                                 onClick={() => handleMarkAsRead(note.id)}
                                 className={`ml-2 flex items-center rounded-full bg-${statusColor}-100 px-3 py-1 text-sm font-medium text-${statusColor}-700 transition-colors hover:bg-${statusColor}-200`}
                              >
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-1 h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                 >
                                    <path
                                       fillRule="evenodd"
                                       d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                       clipRule="evenodd"
                                    />
                                 </svg>
                                 Mark as read
                              </button>
                           )}
                        </div>

                        {/* Footer area with metadata */}
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                           {/* Timestamp badge */}
                           <span className="inline-flex items-center text-sm text-gray-500">
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 className="mr-1 h-4 w-4"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 stroke="currentColor"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                 />
                              </svg>
                              {note.dateSent
                                 ? getTimeAgo(note.dateSent)
                                 : "Just now"}
                           </span>

                           {/* Category badge */}
                           {note.category && (
                              <span
                                 className={`inline-flex items-center rounded-full bg-${statusColor}-100 px-2.5 py-0.5 text-xs font-medium text-${statusColor}-800`}
                              >
                                 {note.category}
                              </span>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            );
         })}
      </div>
   );
}

function NoNotification({ noNotificationsMessage }) {
   return (
      <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
         <div className="mb-3 rounded-full bg-gray-100 p-3">
            <svg
               xmlns="http://www.w3.org/2000/svg"
               className="h-8 w-8 text-gray-400"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
               />
            </svg>
         </div>
         <h4 className="text-lg font-medium text-gray-900">All caught up!</h4>
         <p className="mt-1 text-gray-500">{noNotificationsMessage}</p>
      </div>
   );
}
