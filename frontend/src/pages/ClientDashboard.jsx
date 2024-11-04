import { useEffect, useState } from "react";
import api from "../api";
import "./ClientDashboard.css";

const ClientDashboard = () => {
  const [clientName, setClientName] = useState("");
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [upcomingDueBooks, setUpcomingDueBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const userData = await api.get("/api/client-info/");
        setClientName(userData.data.full_name);

        const overdueResponse = await api.get("/api/client-overdue-books/");
        setOverdueBooks(
          Array.isArray(overdueResponse.data) ? overdueResponse.data : []
        );

        const upcomingDueResponse = await api.get("/api/upcoming-due-books/");
        setUpcomingDueBooks(
          Array.isArray(upcomingDueResponse.data)
            ? upcomingDueResponse.data
            : []
        );

        const allBooksResponse = await api.get("/api/books/");
        setBooks(
          Array.isArray(allBooksResponse.data) ? allBooksResponse.data : []
        );
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    fetchClientData();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="header greeting">
        <h2>Hello, {clientName}</h2>
      </div>

      {overdueBooks.length > 0 && (
        <section>
          <h3>Overdue Books</h3>
          <ul>
            {(overdueBooks || []).map((book) => (
              <li key={book.id}>
                <strong>{book.title}</strong>
                <p>Issued on: {book.date_issued}</p>
                <p>Expected return date: {book.expected_return_date}</p>
                <p>Fine owed: ${book.fine}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {upcomingDueBooks.length > 0 && (
        <section>
          <h3>Books Due Soon</h3>
          <ul>
            {upcomingDueBooks.map((book) => (
              <li key={book.id}>
                <strong>{book.title}</strong> - Due on:{" "}
                {book.expected_return_date}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h3>Search Books</h3>
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <table>
          <thead>
            <tr>
              <th>Book Code</th>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Quantity</th>
              <th>Availability</th>
              <th>Year of Publication</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.code}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.quantity}</td>
                <td>{book.availability}</td>
                <td>{book.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ClientDashboard;
