import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./Landing.css";
import Dashboard from "./Dashboard";
import Users from "./Users";
import BookList from "./BookList";
import IssueReturn from "./IssueReturn";
import ClientDashboard from "./ClientDashboard";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedMenuItem, setSelectedMenuItem] = useState("Dashboard");

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    navigate("/login"); 
  };

  return (
    <div className="container">
      <aside className="side-menu">
        <div className="logo-section">
          <img
            src="https://images.unsplash.com/photo-1492052722242-2554d0e99e3a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJvb2t8ZW58MHx8MHx8fDA%3D"
            alt="Logo"
            className="logo"
          />
        </div>

        <nav className="menu-items">
          <ul>
            <li
              className="menu-link"
              onClick={() => handleMenuItemClick("Dashboard")}
            >
              Dashboard
            </li>
            <li
              className="menu-link"
              onClick={() => handleMenuItemClick("Users")}
            >
              Users
            </li>
            <li
              className="menu-link"
              onClick={() => handleMenuItemClick("Books")}
            >
              Books
            </li>
            <li
              className="menu-link"
              onClick={() => handleMenuItemClick("Issue/Return")}
            >
              Issue/Return
            </li>
            <li
              className="menu-link"
              onClick={() => handleMenuItemClick("ClientDashboard")}
            >
              Client
            </li>
          </ul>
        </nav>
        <div className="logout-section">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
        <footer className="copyright">
          <p>&copy; 2024 Lib58</p>
        </footer>
      </aside>

      <main className="main-content">
        <div className="main-overlay">
          {selectedMenuItem === "Dashboard" && <Dashboard />}
          {selectedMenuItem === "Users" && <Users />}
          {selectedMenuItem === "Books" && <BookList />}
          {selectedMenuItem === "Issue/Return" && <IssueReturn />}
          {selectedMenuItem === "ClientDashboard" && <ClientDashboard />}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
