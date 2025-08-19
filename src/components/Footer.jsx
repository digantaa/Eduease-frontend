import React from "react";
import {
   Facebook,
   Twitter,
   Instagram,
   Linkedin,
   Mail,
   MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
   const currentYear = new Date().getFullYear();

   const quickLinks = [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "Login", path: "/login" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
   ];

   const socialLinks = [
      {
         name: "Facebook",
         icon: Facebook,
         url: "https://www.facebook.com",
      },
      {
         name: "Twitter",
         icon: Twitter,
         url: "https://www.twitter.com",
      },
      {
         name: "Instagram",
         icon: Instagram,
         url: "https://www.instagram.com",
      },
      {
         name: "LinkedIn",
         icon: Linkedin,
         url: "https://www.linkedin.com",
      },
   ];

   return (
      <div className="bg-[#1F2122]">
         <footer
            style={{ padding: "2rem" }}
            className="bg-[#1F2122] gap-6 flex justify-around border-t-2"
         >
            <div className="pt-2xl">
               <h3 className="text-2xl font-bold mb-4 text-white">
                  StudentManagement
               </h3>
               <p className="mb-4 text-white">
                  Empowering education through innovative management solutions.
               </p>
               <div className="flex items-center text-white mb-2">
                  <Mail className="mr-2 w-5 h-5 text-white" />
                  <span className="text-white">
                     support@studentmanagement.com
                  </span>
               </div>
               <div className="flex items-center text-white">
                  <MapPin className="mr-2 w-5 h-5 text-white" />
                  <span className="text-white">
                     123 Education Street, Learning City
                  </span>
               </div>
            </div>
            <div className="flex flex-col items-start">
               <h4 className="text-xl font-semibold mb-4 text-white">
                  Quick Links
               </h4>
               <div className="flex flex-col items-start">
                  {quickLinks.map((link) => (
                     <p key={link.path}>
                        <Link
                           to={link.path}
                           className="text-white hover:text-blue-500 transition-colors"
                        >
                           {link.name}
                        </Link>
                     </p>
                  ))}
               </div>
            </div>
            <div>
               <h4 className="text-xl font-semibold mb-4 text-white">
                  Our Services
               </h4>
               <ul className="space-y-2">
                  <li className="text-white hover:text-blue-500 transition-colors">
                     Student Records Management
                  </li>
                  <li className="text-white hover:text-blue-500 transition-colors">
                     Academic Tracking
                  </li>
                  <li className="text-white hover:text-blue-500 transition-colors">
                     Notification System
                  </li>
                  <li className="text-white hover:text-blue-500 transition-colors">
                     Performance Analytics
                  </li>
               </ul>
            </div>
            <div className="flex flex-col justify-between">
               <div>
                  <h4 className="text-xl font-semibold mb-4 text-white">
                     Connect With Us
                  </h4>
                  <div className="flex gap-4">
                     {socialLinks.map((social) => (
                        <a
                           key={social.name}
                           href={social.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                           {React.createElement(social.icon, {
                              className: "w-6 h-6 text-white",
                           })}
                        </a>
                     ))}
                  </div>
               </div>
               <div>
                  <div className="mt-6 bg-gray-800 p-4 rounded-lg">
                     <h5 className="text-lg font-semibold mb-2">
                        Subscribe to Newsletter
                     </h5>
                     <div className="flex">
                        <input
                           type="email"
                           name="email"
                           placeholder="Enter your email"
                           className="w-full px-3 py-2 rounded-l-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                           Send
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </footer>
         <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-white">
               &copy; {currentYear} Student Management System. All rights
               reserved.
            </p>
         </div>
      </div>
   );
};

export default Footer;
