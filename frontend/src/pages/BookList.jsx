import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../api";

import { Link, useLocation } from "react-router-dom";

import "./BookList.css";

function BookList() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const location = useLocation();

  useEffect(() => {
    fetchBooks();
  }, []);

  // const fetchBooks = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:8000/api/book/");
  //     console.log(response.data);
  //     setBooks(response.data);
  //   } catch (error) {
  //     console.error("Error fetching books:", error);
  //   }
  // };

  const fetchBooks = () => {
    api
      .get("/api/books/")
      .then((res) => res.data)
      .then((data) => {
        setBooks(data);
        console.log("This is the data: " + data);
      })
      .catch((err) => {
        console.log(err);
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

  return (
    <div className="book-list">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by any field..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div>
        <Link to="/addbook" className="add-book-button">
          Add New Book
        </Link>
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
                <button>Edit</button>
              </td>
              <td>
                <button>Delete</button>
              </td>
              <td>
                <Link
                  to={{
                    pathname: `/issuereturn/${book._id}`,
                    state: { bookData: book, location: location },
                  }}
                >
                  <button>Issue</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookList;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// import "../css/BookList.css";

// function BookList() {
//   const [books, setBooks] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("");
//   const [sortOrder, setSortOrder] = useState("");

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   const fetchBooks = async () => {
//     try {
//       const response = await axios.get(
//         "https://library58-api.onrender.com/books"
//       );
//       setBooks(response.data);
//     } catch (error) {
//       console.error("Error fetching books:", error);
//     }
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleSort = (field) => {
//     if (sortBy === field) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(field);
//       setSortOrder("asc");
//     }
//   };

//   const filteredBooks = books.filter((book) =>
//     Object.values(book).some((value) =>
//       value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   const sortedBooks = sortBy
//     ? filteredBooks.sort((a, b) => {
//         const fieldA = a[sortBy].toString().toLowerCase();
//         const fieldB = b[sortBy].toString().toLowerCase();
//         if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
//         if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
//         return 0;
//       })
//     : filteredBooks;

//   return (
//     <div className="book-list">
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Search by any field..."
//           value={searchTerm}
//           onChange={handleSearch}
//         />
//       </div>
//       <div>
//         <Link to="/addbook" className="add-book-button">
//           Add New Book
//         </Link>
//       </div>

//       <table>
//         <thead>
//           <tr>
//             <th onClick={() => handleSort("code")}>Book Code</th>
//             <th onClick={() => handleSort("title")}>Title</th>
//             <th onClick={() => handleSort("author")}>Author</th>
//             <th onClick={() => handleSort("genre")}>Genre</th>
//             <th onClick={() => handleSort("quantity")}>Quantity</th>
//             <th onClick={() => handleSort("availability")}>Availability</th>
//             <th onClick={() => handleSort("yearOfPublication")}>
//               Year of Publication
//             </th>
//             <th>Edit</th>
//             <th>Delete</th>
//             <th>Issue</th> {/* New column for issuing books */}
//           </tr>
//         </thead>
//         <tbody>
//           {sortedBooks.map((book) => (
//             <tr key={book._id}>
//               <td>{book.code}</td>
//               <td>{book.title}</td>
//               <td>{book.author}</td>
//               <td>{book.genre}</td>
//               <td>{book.quantity}</td>
//               <td>{book.availability}</td>
//               <td>{book.yearOfPublication}</td>
//               <td>
//                 <button>Edit</button>
//               </td>
//               <td>
//                 <button>Delete</button>
//               </td>
//               <td>
//                 <Link
//                   to={{
//                     pathname: `/issuereturn/${book._id}`,
//                     state: { bookData: book },
//                   }}
//                 >
//                   <button>Issue</button>
//                 </Link>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default BookList;
