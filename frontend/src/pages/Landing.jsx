import {useState} from "react";
import { Link, Outlet } from "react-router-dom";
import "./Landing.css"; // Import the regular CSS
import Dashboard from "./Dashboard";

const HomePage = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("Dashboard");

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  return (
    <div className="container">
      {/* Side Menu */}
      <aside className="side-menu">
        <div className="logo-section">
          {/* Logo */}
          <img
            src="https://images.unsplash.com/photo-1492052722242-2554d0e99e3a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJvb2t8ZW58MHx8MHx8fDA%3D"
            alt="Logo"
            className="logo"
          />
        </div>

        {/* Menu Items */}
        <nav className="menu-items">
          <ul>
            <li
              className="menu-link"
              onClick={() => handleMenuItemClick("Dashboard")}
            >
              Dashboard
            </li>

            <li>
              <Link to="/about" className="menu-link">
                About
              </Link>
            </li>
            <li>
              <Link to="/services" className="menu-link">
                Services
              </Link>
            </li>
            <li>
              <Link to="/contact" className="menu-link">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Copyright */}
        <footer className="copyright">
          <p>&copy; 2024 Your Company</p>
        </footer>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="main-overlay">
            { <div className=""> this is some really messed up thing</div> }
          {selectedMenuItem === "Dashboard" && <Dashboard />}
          {/* {selectedMenuItem === "Users" && <Users />}
          {selectedMenuItem === "Books" && <BookList />}
          {selectedMenuItem === "Issue/Return" && <IssueReturn />} */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
