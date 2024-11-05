import { useState, useEffect } from "react";
import api from "../api";
// import { Link } from "react-router-dom";
import UserEditForm from "./EditUserForm";
import UserDelete from "./UserDelete";

function Users() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users/");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);  
  };

  const closeModal = () => {
    setSelectedUser(null);
    fetchUsers();  
  }

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeletePopup(true);
  };

  const confirmDelete = async (userId) => {
    try {
      await api.delete(`/api/delete-user/${userId}/`);
      alert("User deleted successfully.");
      setShowDeletePopup(false);
      fetchUsers();  
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setSelectedUser(null);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="user-management">
      <h2 className="header">Users</h2>
      {/* <Link to="/adduser" className="add-book-button">Add New User</Link> */}

      <table className="user-table">
        <thead>
          <tr className="table-header">
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>User type</th>
            <th>ID Type</th>
            <th>ID Number</th>
            <th>Status</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>{user.phone_number}</td>
              <td>{user.address}</td>
              <td>{user.role}</td>
              <td>{user.id_type}</td>
              <td>{user.id_number}</td>
              <td>{user.status}</td>
              <td>
              <button onClick={() => handleEditClick(user)}>Edit</button>

              </td>
              <td>
                <button onClick={() => handleDeleteClick(user)}>Delete</button>
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

      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <UserEditForm user={selectedUser} onClose={closeModal} />
          </div>
        </div>
      )}
      
      {showDeletePopup && selectedUser && (
        <UserDelete
          user={selectedUser}
          onConfirm={confirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

export default Users;

