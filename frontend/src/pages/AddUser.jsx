import { useState, useEffect } from "react";
import api from "../api";
import { Link, useLocation } from "react-router-dom";
import AddBookForm from "./AddBookForm";
import "./BookList.css";
import IssueBookForm from "./IssueBookForm";

function CustomModal({ show, onClose, children }) {
  if (!show) return null;

  const handleModalClick = (e) => {
    e.stopPropagation(); 
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleModalClick}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

function BookList() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null); 
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [error, setError] = useState(null); 

  const location = useLocation();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    api
      .get("/api/books/")
      .then((res) => res.data)
      .then((data) => {
        setBooks(data);
        setError(null); 
      })
      .catch((err) => {
        setError("Failed to fetch books. Please try again later.");
        console.error(err);
      });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const filteredBooks = books.filter((book) =>
    Object.values(book).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedBooks = sortBy
    ? filteredBooks.sort((a, b) => {
        const fieldA = a[sortBy].toString().toLowerCase();
        const fieldB = b[sortBy].toString().toLowerCase();
        if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
        if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      })
    : filteredBooks;

  const openModal = (book = null) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const openIssueModal = (book) => {
    setSelectedBook(book);
    setIsIssueModalOpen(true);
  };

  const closeIssueModal = () => {
    setIsIssueModalOpen(false);
    setSelectedBook(null);
  };

  // DELETE Function
  const deleteBook = (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      api
        .delete(`/api/book/${bookId}/`)
        .then((res) => {
          setBooks(books.filter((book) => book.id !== bookId));
          setError(null); 
          console.log(`Book with ID: ${bookId} deleted successfully`);
        })
        .catch((err) => {
          setError(`Error deleting book with ID: ${bookId}. Please try again.`);
          console.error(err);
        });
    }
  };

  return (
    <div className="book-list">
      
      {error && <div className="alert alert-error">{error}</div>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by any field..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div>
        <button onClick={() => openModal()}>Add New Book</button>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("code")}>Book Code</th>
            <th onClick={() => handleSort("title")}>Title</th>
            <th onClick={() => handleSort("author")}>Author</th>
            <th onClick={() => handleSort("genre")}>Genre</th>
            <th onClick={() => handleSort("quantity")}>Quantity</th>
            <th onClick={() => handleSort("availability")}>Availability</th>
            <th onClick={() => handleSort("yearOfPublication")}>
              Year of Publication
            </th>
            <th>Edit</th>
            <th>Delete</th>
            <th>Issue</th>
          </tr>
        </thead>
        <tbody>
          {sortedBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.code}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.quantity}</td>
              <td>{book.availability}</td>
              <td>{book.published}</td>
              <td>
                <button onClick={() => openModal(book)}>Edit</button>
              </td>
              <td>
                <button onClick={() => deleteBook(book.id)}>Delete</button>
              </td>
              <td>
                <button onClick={() => openIssueModal(book)}>Issue</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CustomModal show={isModalOpen} onClose={closeModal}>
        <AddBookForm book={selectedBook} onClose={closeModal} onSave={fetchBooks} />
      </CustomModal>

      <CustomModal show={isIssueModalOpen} onClose={closeIssueModal}>
        {selectedBook && (
          <IssueBookForm
            book={selectedBook}
            onClose={closeIssueModal}
            onSave={fetchBooks}
          />
        )}
      </CustomModal>
    </div>
  );
}

export default BookList;




// import { useState } from "react";
// import axios from "axios";
// import "../css/AddUserForm.css";

// function AddUser() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     idType: "",
//     idNumber: "",
//     address: "",
//     accountStatus: "Active", 
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:4000/user", formData); // Update endpoint URL
//       // Clear form fields after successful submission
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         idType: "",
//         idNumber: "",
//         address: "",
//         accountStatus: "Active", // Reset account status to "Active"
//       });
//       alert("User added successfully!");
//     } catch (error) {
//       console.error("Error adding user:", error);
//       alert("Failed to add user. Please try again.");
//     }
//   };

//   return (
//     <div className="form-container">
//       <div className="add-user-form">
//         <h2>Add new user</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="name">Name</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="phone">Phone</label>
//             <input
//               type="text"
//               id="phone"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="idType">ID Type</label>
//             <input
//               type="text"
//               id="idType"
//               name="idType"
//               value={formData.idType}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="idNumber">ID Number</label>
//             <input
//               type="text"
//               id="idNumber"
//               name="idNumber"
//               value={formData.idNumber}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="address">Address</label>
//             <input
//               type="text"
//               id="address"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="accountStatus">Account Status</label>
//             <select
//               id="accountStatus"
//               name="accountStatus"
//               value={formData.accountStatus}
//               onChange={handleChange}
//             >
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </select>
//           </div>
//           <button type="submit" className="add-user-button">
//             Add new user
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddUser;


