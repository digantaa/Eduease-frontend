import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const MainLayout = () => {
   return (
      <div className="flex flex-col">
         <Navbar />
         <Outlet />
         <Footer />
      </div>
   );
};

export default MainLayout;
