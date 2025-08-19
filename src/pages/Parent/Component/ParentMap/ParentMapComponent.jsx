import React from "react";
import {
   MapContainer,
   TileLayer,
   Marker,
   Popup,
   Circle,
   ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

/**
 * ParentMapComponent - A React component that displays a location on a map
 *
 * @param {Object} props - Component props
 * @param {number} props.accuracy - Accuracy radius in meters
 * @param {Object} props.customIcon - Custom marker icon
 * @param {Function} props.RecenterMap - Component to recenter map on location updates
 * @param {Object} props.locationData - Location data including latitude, longitude and timestamp
 */
const ParentMapComponent = ({
   accuracy,
   customIcon,
   RecenterMap,
   locationData,
   handleLogout,
}) => {
   // Parse location coordinates
   const lat = parseFloat(locationData?.latitude);
   const lng = parseFloat(locationData?.longitude);
   const dateTime = new Date(locationData?.lastSeen);

   // Format to HH:MM:SS format (24-hour clock)
   const formattedTime = dateTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Set to true for AM/PM format
   });
   // Check if coordinates are valid
   const isValid = !isNaN(lat) && !isNaN(lng);

   return (
      <div className="max-w-5xl mx-auto mt-5 p-6 min-h-screen">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
               </svg>
               Live Location Map
            </h2>
            <button
               onClick={handleLogout}
               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center"
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
               </svg>
               Logout
            </button>
         </div>

         {isValid ? (
            <div className="rounded-xl overflow-hidden shadow-xl transition-all duration-500">
               <MapContainer
                  center={[lat, lng]}
                  zoom={15}
                  scrollWheelZoom={true}
                  zoomControl={false}
                  className="h-96 md:h-128 w-full transition-all duration-500"
               >
                  {/* Map tile layer */}
                  <TileLayer
                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  {/* Location marker */}
                  <Marker position={[lat, lng]} icon={customIcon}>
                     <Popup className="font-sans">
                        <span className="font-medium text-blue-600">
                           You are here
                        </span>
                     </Popup>
                  </Marker>
                  {/* Accuracy circle */}
                  <Circle
                     center={[lat, lng]}
                     radius={accuracy}
                     pathOptions={{
                        fillColor: "#3b82f6",
                        fillOpacity: 0.2,
                        color: "#60a5fa",
                        weight: 2,
                     }}
                  />
                  {/* Controls */}
                  <ZoomControl position="bottomright" />
                  <RecenterMap position={[lat, lng]} />
               </MapContainer>
            </div>
         ) : (
            <div className="h-96 md:h-128 w-full rounded-xl bg-gray-50 flex items-center justify-center shadow-inner">
               <div className="flex flex-col items-center">
                  <svg
                     className="animate-spin h-10 w-10 text-blue-500 mb-4"
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                  >
                     <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                     ></circle>
                     <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                     ></path>
                  </svg>
                  <p className="text-gray-500 font-medium">
                     Acquiring your location...
                  </p>
               </div>
            </div>
         )}

         <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600 flex items-center">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-blue-500"
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
               Last seen:{" "}
               <span className="font-semibold ml-1">
                  {formattedTime || "N/A"}
               </span>
            </p>
            <div className="bg-green-100 px-3 py-1 rounded-full flex items-center">
               <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
               <span className="text-xs font-medium text-green-800">Live</span>
            </div>
         </div>
      </div>
   );
};

export default ParentMapComponent;
