import { useState, useEffect } from "react";
import axios from "axios";
import api from "../api";
import { Link } from "react-router-dom";

import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("http://localhost:8000/api/users/");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      await axios.patch(`http://localhost:4000/users/${id}`, {
        accountStatus: newStatus,
      });
      fetchUsers(); // Refresh the user list after status change
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="user-management">
      <h2 className="header">Users</h2>
      <Link to="/adduser" className="add-book-button">
        Add New User
      </Link>

      <table className="user-table">
        <thead>
          <tr className="table-header">
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>ID Type</th>
            <th>ID Number</th>
            <th>Status</th>
            <th>Edit</th>
            {/* <th>Delete</th> */}
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>{user.phone_number}</td>
              <td>{user.address}</td>
              <td>{user.id_type}</td>
              <td>{user.id_number}</td>
              <td>
                <button
                  onClick={() => toggleStatus(user.id, user.status)}
                >
                  {user.accountStatus}
                </button>
              </td>
              <td>
                <Link to={`/edit-user/${user._id}`}>Edit</Link>
              </td>
              {/* <td><button>Delete</button></td> */}
              <td>
                <button>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(users.length / usersPerPage) },
          (_, i) => (
            <button key={i} onClick={() => paginate(i + 1)}>
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default Users;
