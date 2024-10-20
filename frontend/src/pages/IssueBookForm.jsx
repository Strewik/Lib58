import { useState, useEffect } from "react";
import api from "../api";

function IssueBookForm({ book, onClose, onSave }) {
  const [userId, setUserId] = useState(""); // Store the selected user's ID
  const [userName, setUserName] = useState(""); // Store the selected user's name for input display
  const [users, setUsers] = useState([]); // List of users for dropdown
  const [issueDate, setIssueDate] = useState(""); // Default issue date is set below
  const [expectedReturnDate, setExpectedReturnDate] = useState("");
  const [status, setStatus] = useState("issued"); // Set default status to "issued"

  // Fetch users from the API
  useEffect(() => {
    api.get("/api/users/").then((res) => setUsers(res.data));

    // Set default issue date as today's date
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    setIssueDate(formattedDate);
  }, []);

  useEffect(() => {
    if (issueDate) {
      const issue = new Date(issueDate);
      const returnDate = new Date(issue);
      returnDate.setDate(issue.getDate() + 7);
      setExpectedReturnDate(returnDate.toISOString().slice(0, 10));
    }
  }, [issueDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/issue/", {
        user: userId,
        book: book.id,
        issue_date: issueDate,
        expected_return_date: expectedReturnDate,
        status, 
      });
      onSave(); 
      onClose(); 
      alert("Book issued successfully!");
    } catch (error) {
      console.error("Error issuing book:", error);
      alert("Failed to issue the book.");
    }
  };

  // Filter users based on the typed input
  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(userName.toLowerCase())
  );

  // When a user is selected from the dropdown
  const handleUserSelect = (selectedUserId, selectedUserName) => {
    setUserId(selectedUserId);
    setUserName(selectedUserName); // Fill input with selected user's name
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>
        Issue Book: <strong>{book.title}</strong> by <em>{book.author}</em>
      </h3>
      <div>
        <label>Search or Select User:</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Search or select user"
        />
        {filteredUsers.length > 0 && (
          <ul style={{ border: "1px solid #ccc", maxHeight: "150px", overflowY: "auto" }}>
            {filteredUsers.map((user) => (
              <li
                key={user.id}
                onClick={() => handleUserSelect(user.id, user.full_name)}
                style={{ cursor: "pointer", padding: "5px" }}
              >
                {user.full_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <label>Issue Date:</label>
        <input
          type="date"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Expected Return Date:</label>
        <input
          type="date"
          value={expectedReturnDate}
          readOnly
        />
      </div>
      <button type="submit">Issue Book</button>
    </form>
  );
}

export default IssueBookForm;




