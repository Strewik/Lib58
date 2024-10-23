// Dashboard.js
import { useEffect, useState } from "react";
import "./Dashboard.css";
import api from "../api"; // Importing the updated api client

const Dashboard = () => {
  const [userCounts, setUserCounts] = useState({
    total_users: 0,
    total_staff: 0,
    total_admin: 0,
    total_client: 0,
  });

  const [bookStats, setBookStats] = useState({
    total_issued: 0,
    books_returned: 0,
    books_currently_issued: 0,
  });

  const [popularBooks, setPopularBooks] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState(0);
  const [topGenres, setTopGenres] = useState([]);
  const [totalBooks, setTotalBooks] = useState({
    total_books: 0,
    total_copies: 0,
  });

  useEffect(() => {
    // Fetch the user counts from the API
    const fetchUserCounts = async () => {
      try {
        const response = await api.get("/api/user-count/");
        setUserCounts(response.data);
      } catch (error) {
        console.error("Failed to fetch user counts:", error);
      }
    };

    fetchUserCounts();
  }, []);

  useEffect(() => {
    const fetchBookStats = async () => {
      try {
        const response = await api.get("/api/book-stats/");
        setBookStats(response.data);
      } catch (error) {
        console.error("Failed to fetch book stats:", error);
      }
    };

    fetchBookStats();
  }, []);

  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        const response = await api.get("/api/popular-books/");
        setPopularBooks(response.data);
      } catch (error) {
        console.error("Failed to fetch popular books:", error);
      }
    };

    fetchPopularBooks();
  }, []);

  useEffect(() => {
    const fetchOverdueBooks = async () => {
      try {
        const response = await api.get("/api/overdue-books/");
        setOverdueBooks(response.data.overdue_books);
      } catch (error) {
        console.error("Failed to fetch overdue books:", error);
      }
    };

    fetchOverdueBooks();
  }, []);

  useEffect(() => {
    const fetchTopGenres = async () => {
      try {
        const response = await api.get("/api/top-genres/");
        setTopGenres(response.data);
      } catch (error) {
        console.error("Failed to fetch top genres:", error);
      }
    };

    fetchTopGenres();
  }, []);

  useEffect(() => {
    const fetchTotalBooks = async () => {
      try {
        const response = await api.get("/api/total-books/");
        setTotalBooks(response.data.total_books);
      } catch (error) {
        console.error("Failed to fetch total books:", error);
      }
    };

    fetchTotalBooks();
  }, []);

  const cardData = [
    {
      id: 1,
      title: "User Statistics",
      content: (
        <>
          <p>Total Users: {userCounts.total_users}</p>
          <p>Total Staff: {userCounts.total_staff}</p>
          <p>Total Admins: {userCounts.total_admin}</p>
          <p>Total Clients: {userCounts.total_client}</p>
        </>
      ),
    },
    {
      id: 2,
      title: "Book Statistics",
      content: (
        <>
          <p>Total Books Issued: {bookStats.total_issued}</p>
          <p>Books Returned: {bookStats.books_returned}</p>
          <p>Books Currently Issued: {bookStats.books_currently_issued}</p>
        </>
      ),
    },
    {
      id: 3,
      title: "Overdue Books",
      content: (
        <>
          <p>Overdue Books: {overdueBooks}</p>
        </>
      ),
    },
    {
      id: 4,
      title: "Top Genres",
      content: (
        <>
          <p>Top Genres: {topGenres.map((genre) => genre.genre).join(", ")}</p>
        </>
      ),
    },
    { 
      id: 5, 
      title: 'Total Books and Copies', 
      content: (
        <>
          <p>Total Books: {totalBooks.total_books}</p>
          <p>Total Copies: {totalBooks.total_copies}</p>
        </>
      ),
    },
    { id: 6, title: "Card 6", content: "This is content for card 6" },
  ];

  return (
    <div className="dashboard">
      <div className="card-grid">
        {cardData.map((card) => (
          <div key={card.id} className="card">
            <h3 className="card-title">{card.title}</h3>
            <div className="card-content">{card.content}</div>
          </div>
        ))}
      </div>

      <div>
        <h3>Most Popular Books</h3>
        <table className="popular-books-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Times Issued</th>
            </tr>
          </thead>
          <tbody>
            {popularBooks.map((book, index) => (
              <tr key={index}>
                <td>{book.book__title}</td>
                <td>{book.book__author}</td>
                <td>{book.issue_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
