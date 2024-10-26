// UserEditForm.js

import { useState, useEffect } from "react";
import api from "../api";
import "./EditUserForm.css"

const UserEditForm = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    id_type: '',
    id_number: '',
    address: '',
    role: '',
    status: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name,
        phone_number: user.phone_number,
        id_type: user.id_type,
        id_number: user.id_number,
        address: user.address,
        role: user.role,
        status: user.status
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/api/edit-user/${user.id}/`, formData);
      alert('User updated successfully!');
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  return (
    <div className="user-edit-form">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>ID Type</label>
          <input
            type="text"
            name="id_type"
            value={formData.id_type}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>ID Number</label>
          <input
            type="text"
            name="id_number"
            value={formData.id_number}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="client">Client</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <button type="submit">Update User</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default UserEditForm;
