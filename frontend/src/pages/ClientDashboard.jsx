import { useEffect, useState } from "react";
import axios from "axios";

const ClientDashboard = () => {
  const [clientName, setClientName] = useState("");
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [upcomingDueBooks, setUpcomingDueBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const userData = await axios.get('/api/client-info/');
        setClientName(userData.data.full_name);
  
        const overdueResponse = await axios.get('/api/overdue-books/');
        console.log("Overdue books data:", overdueResponse.data);  // Log to confirm structure
        setOverdueBooks(Array.isArray(overdueResponse.data) ? overdueResponse.data : []);  // Ensure array
  
        const upcomingDueResponse = await axios.get('/api/upcoming-due-books/');
        setUpcomingDueBooks(Array.isArray(upcomingDueResponse.data) ? upcomingDueResponse.data : []);
  
        const allBooksResponse = await axios.get('/api/books/');
        setBooks(Array.isArray(allBooksResponse.data) ? allBooksResponse.data : []);
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
    <div>
      <div className="header">
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
        <ul>
          {filteredBooks.map((book) => (
            <li key={book.id}>{book.title}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ClientDashboard;
