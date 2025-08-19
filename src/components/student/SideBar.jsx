import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Sidebar = ({ menuItems, activeView, switchView, setActiveIcon }) => {
   const [openSideBar, setOpenSideBar] = useState(false);
   const [tooltipVisible, setTooltipVisible] = useState(null);

   return (
      <div className="fixed flex gap-2 z-100 bg-white">
         {/* Sidebar Toggle Button */}
         <div
            className="fixed left-4 top-4 p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition-all"
            onClick={() => setOpenSideBar(!openSideBar)}
         >
            {openSideBar ? <X /> : <Menu />}
         </div>

         {/* Sidebar Container */}
         <div
            className={`${
               openSideBar ? "w-[15vw] px-2" : "w-18"
            } flex flex-col justify-center items-center gap-6 py-6 h-screen border-r-2 border-gray-300 transition-all duration-300 ease-in-out overflow-hidden`}
         >
            {menuItems.map((item) => (
               <div key={item.id} className=" group w-full">
                  <button
                     className={`relative w-full z-50 h-12 flex gap-4 items-center rounded-lg transition-all ${
                        activeView === item.id
                           ? "text-blue-300 translate-x-2"
                           : "text-black hover:bg-gray-100 hover:rounded-4xl"
                     } ${openSideBar ? "justify-start" : "justify-center"} `}
                     onClick={() => {
                        switchView(item.id);
                        setActiveIcon(item.id);
                     }}
                     onMouseEnter={() => setTooltipVisible(item.id)}
                     onMouseLeave={() => setTooltipVisible(null)}
                  >
                     <span>{item.icon}</span>
                     {item.badge && (
                        <span className="absolute -top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                           {item.badge}
                        </span>
                     )}
                     {openSideBar && (
                        <span className="ml-3 font-semibold text-black">
                           {item.label}
                        </span>
                     )}
                  </button>

                  {/* Tooltip (only when sidebar is closed) */}
                  {!openSideBar && tooltipVisible === item.id && (
                     <div className="absolute left-18  transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded text-sm transition-opacity duration-200 opacity-100">
                        {item.label}
                     </div>
                  )}
               </div>
            ))}
         </div>
      </div>
   );
};

export default Sidebar;
