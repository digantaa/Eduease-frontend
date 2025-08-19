import React from "react";
import { Link, Outlet } from "react-router-dom";
import Notification from "./Notification";
import "bootstrap/dist/css/bootstrap.min.css";
//import "toastr/build/toastr.min.css";

function Layout() {
   return (
      <>
         <header>
            <nav className="navbar navbar-expand-sm navbar-light bg-white border-bottom box-shadow mb-3">
               <div className="container-fluid">
                  <Link className="navbar-brand" to="/">
                     StudentManagement
                  </Link>
                  <button
                     className="navbar-toggler"
                     type="button"
                     data-bs-toggle="collapse"
                     data-bs-target="#navbarNav"
                     aria-controls="navbarNav"
                     aria-expanded="false"
                     aria-label="Toggle navigation"
                  >
                     <span className="navbar-toggler-icon"></span>
                  </button>
                  <div
                     className="collapse navbar-collapse d-sm-inline-flex justify-content-between"
                     id="navbarNav"
                  >
                     <ul className="navbar-nav flex-grow-1">
                        <li className="nav-item">
                           <Link className="nav-link text-dark" to="/">
                              Home
                           </Link>
                        </li>
                        <li className="nav-item">
                           <Link className="nav-link text-dark" to="/privacy">
                              Privacy
                           </Link>
                        </li>
                        <li className="nav-item">
                           <Link className="nav-link text-dark" to="/register">
                              Register
                           </Link>
                        </li>
                        <li className="nav-item">
                           <Link className="nav-link text-dark" to="/login">
                              Login
                           </Link>
                        </li>
                     </ul>
                  </div>
               </div>
            </nav>
         </header>

         <div className="container">
            <main role="main" className="pb-3">
               <Notification />
               <Outlet />
            </main>
         </div>

         <footer className="border-top footer text-muted">
            <div className="container">
               &copy; 2025 - StudentManagement.Web -{" "}
               <Link to="/privacy">Privacy</Link>
            </div>
         </footer>
      </>
   );
}

export default Layout;
