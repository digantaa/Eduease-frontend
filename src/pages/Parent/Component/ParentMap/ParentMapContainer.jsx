import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ParentMapComponent from "./ParentMapComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Custom icon
const customIcon = L.icon({
   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
   iconSize: [32, 32],
   iconAnchor: [16, 32],
   popupAnchor: [0, -32],
});

// Re-center map on position change
const RecenterMap = ({ position }) => {
   const map = useMap();

   useEffect(() => {
      map.setView(position, map.getZoom(), {
         animate: true,
         duration: 1,
      });
   }, [position, map]);
   return null;
};

const ParentMapContainer = () => {
   const [accuracy, setAccuracy] = useState(50);
   const [locationData, setLocationData] = useState({});
   const navigate = useNavigate();

   const fetchLocation = async () => {
      try {
         const parentId = Number(localStorage.getItem("parentId")); // convert properly

         const resp = await axios.post(
            `https://localhost:7013/api/Parent/child/Location/${parentId}`,
            {},

            {
               withCredentials: true,
            }
         );

         if (resp.data && resp.data.length > 0) {
            const loc = resp.data[0];
            loc.latitude = parseFloat(loc.latitude);
            loc.longitude = parseFloat(loc.longitude);
            setLocationData(loc);
         }
      } catch (error) {
         console.error(
            "Error updating location:",
            error.response?.data || error.message
         );
      }
   };

   // handle logout
   const handleLogout = async () => {
      const resp = await axios.post(
         `https://localhost:7013/api/Parent/auth/logout/${localStorage.getItem(
            "parentId"
         )}`,
         {},
         {
            withCredentials: true,
         }
      );
      console.log(resp);
      localStorage.removeItem("parentId");
      localStorage.removeItem("parentJwt");
      navigate("/");
   };

   // Update location every 2 seconds
   useEffect(() => {
      fetchLocation(); // fetch once on mount
      const interval = setInterval(fetchLocation, 2000);
      return () => clearInterval(interval); // cleanup on unmount
   }, []);

   return (
      <div>
         <ParentMapComponent
            accuracy={accuracy}
            customIcon={customIcon}
            RecenterMap={RecenterMap}
            locationData={locationData}
            handleLogout={handleLogout}
         />
      </div>
   );
};

export default ParentMapContainer;
