// import axios from "axios";

// export function EnableHeartBeat(flag) {
//    if (!flag) {
//       return;
//    } else {
//       const intervalRef = useRef(null);
//       const inactivityTimerRef = useRef(null);
//       const navigate = useNavigate();
//       //    const { notifications, setNotifications } = useStore();

//       useEffect(() => {
//          // Start heartbeat when the app loads
//          startHeartbeat();

//          // Track user activity
//          window.addEventListener("mousemove", resetInactivityTimer);
//          window.addEventListener("keydown", resetInactivityTimer);
//          window.addEventListener("click", resetInactivityTimer);

//          return () => {
//             clearInterval(intervalRef.current);
//             clearTimeout(inactivityTimerRef.current);
//             window.removeEventListener("mousemove", resetInactivityTimer);
//             window.removeEventListener("keydown", resetInactivityTimer);
//             window.removeEventListener("click", resetInactivityTimer);
//          };
//       }, []);

//       const sendHeartbeat = async () => {
//          console.log("inside heart beat");
//          try {
//             const userId = localStorage.getItem("userid");
//             if (!userId) {
//                console.warn("User ID is missing in localStorage.");
//                return;
//             }
//             const resp = await axios.post(
//                `https://localhost:7013/api/Session/heartbeat/${userId}`
//             );

//             console.log("Heartbeat response:", resp.data);
//          } catch (error) {
//             localStorage.clear();
//             toast.error(error.response.data.message);
//             document.cookie =
//                "jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";
//             document.cookie =
//                ".AspNetCore.Session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";
//             navigate("/");
//             console.error("Heartbeat error:", error);
//          }
//       };

//       const startHeartbeat = () => {
//          if (!intervalRef.current) {
//             console.log("User is active. Starting heartbeat...");
//             intervalRef.current = setInterval(sendHeartbeat, 1000);
//          }
//       };

//       const stopHeartbeat = () => {
//          if (intervalRef.current) {
//             console.log("User is inactive. Stopping heartbeat...");
//             clearInterval(intervalRef.current);
//             intervalRef.current = null;
//          }
//       };

//       const resetInactivityTimer = () => {
//          clearTimeout(inactivityTimerRef.current);
//          startHeartbeat();
//          inactivityTimerRef.current = setTimeout(() => {
//             stopHeartbeat();
//          }, 1000); // 30 seconds of inactivity
//       };
//    }
// }

// useHeartbeat.js
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useHeartbeat = (enabled) => {
   const intervalRef = useRef(null);
   const inactivityTimerRef = useRef(null);
   const navigate = useNavigate();

   useEffect(() => {
      if (!enabled) return;

      startHeartbeat();

      window.addEventListener("mousemove", resetInactivityTimer);
      window.addEventListener("keydown", resetInactivityTimer);
      window.addEventListener("click", resetInactivityTimer);

      return () => {
         clearInterval(intervalRef.current);
         clearTimeout(inactivityTimerRef.current);
         window.removeEventListener("mousemove", resetInactivityTimer);
         window.removeEventListener("keydown", resetInactivityTimer);
         window.removeEventListener("click", resetInactivityTimer);
      };
   }, [enabled]);

   const sendHeartbeat = async () => {
      try {
         const userId = localStorage.getItem("userid");
         if (!userId) {
            console.warn("User ID missing");
            return;
         }
         const resp = await axios.post(
            `https://localhost:7013/api/Session/heartbeat/${userId}`
         );
         console.log("Heartbeat response:", resp.data);
      } catch (error) {
         localStorage.clear();
         toast.error(error?.response?.data?.message || "Session expired");
         document.cookie =
            "jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";
         document.cookie =
            ".AspNetCore.Session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";
         navigate("/");
      }
   };

   const startHeartbeat = () => {
      if (!intervalRef.current) {
         intervalRef.current = setInterval(sendHeartbeat, 1000);
      }
   };

   const stopHeartbeat = () => {
      if (intervalRef.current) {
         clearInterval(intervalRef.current);
         intervalRef.current = null;
      }
   };

   const resetInactivityTimer = () => {
      clearTimeout(inactivityTimerRef.current);
      startHeartbeat();
      inactivityTimerRef.current = setTimeout(() => {
         stopHeartbeat();
      }, 3000); // 30 seconds
   };
};
