import { useState, useEffect } from "react";
import api from "../api";
import moment from "moment";
import "./IssueReturn.css"

function IssuedBooksList() {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [activeTab, setActiveTab] = useState("notReturned");
  const [isOverdue, setIsOverdue] = useState(false);
  const [finePaid, setFinePaid] = useState(false);
  // const [returningBookId, setReturningBookId] = useState(null);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [totalOverdueBooks, setTotalOverdueBooks] = useState(0);

  useEffect(() => {
    fetchIssuedBooks();
  }, []);

  const fetchIssuedBooks = async () => {
    try {
      const response = await api.get("/api/issue/");
      setIssuedBooks(response.data);

      const overdue = response.data.filter(
        (book) =>
          book.status === "issued" &&
          moment().isAfter(moment(book.expected_return_date))
      );
      setOverdueBooks(overdue);
      setTotalOverdueBooks(overdue.length);
    } catch (error) {
      console.error("Error fetching issued books:", error);
    }
  };

  const handleReturnBook = async (bookId) => {
    const book = issuedBooks.find((b) => b.id === bookId);

    if (book.overdue_status === "due") {
      try {
        // const response = await api.patch(`/api/issues/${bookId}/return/`, {
        //   fine_paid: false,
        // });
        fetchIssuedBooks();
        alert("Book returned successfully!");
      } catch (error) {
        console.error("Error returning the book:", error);
      }
    } else if (book.overdue_status === "overdue") {
      setIsOverdue(true);
      setReturningBookId(bookId);
    }
  };

  const confirmReturnWithFine = async () => {
    if (!finePaid) {
      alert("Please confirm that the fine has been paid.");
      return;
    }

    try {
      // const response = await api.patch(`/api/issues/${returningBookId}/return/`, {
      //   fine_paid: true,
      // });
      fetchIssuedBooks();
      alert("Book returned successfully with fine payment confirmed!");
    } catch (error) {
      console.error("Error returning the book with fine payment:", error);
    }

    setIsOverdue(false);
    setFinePaid(false);
    setReturningBookId(null);
  };

  const filteredBooks =
    activeTab === "notReturned"
      ? issuedBooks.filter((book) => book.status === "issued")
      : activeTab === "returned"
      ? issuedBooks.filter((book) => book.status === "returned")
      : overdueBooks;

  return (
    <div>
      <h2>Issued Books</h2>
      <div>
        <button
          className={activeTab === "notReturned" ? "active" : ""}
          onClick={() => setActiveTab("notReturned")}
        >
          Issued
        </button>
        <button
          className={activeTab === "returned" ? "active" : ""}
          onClick={() => setActiveTab("returned")}
        >
          Returned
        </button>
        <button
          className={activeTab === "overdue" ? "active" : ""}
          onClick={() => setActiveTab("overdue")}
        >
          Overdue
        </button>
      </div>

      {activeTab === "overdue" && (
        <div>
          <h3>Total Overdue Books: {totalOverdueBooks}</h3>
        </div>
      )}

      <div>
        {filteredBooks.length === 0 ? (
          <p>No books to show in this tab.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>User</th>
                <th>Issue Date</th>
                <th>Expected Return Date</th>
                {activeTab === "notReturned" && (
                  <>
                    <th>Due Status</th>
                    <th>Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((issue) => (
                <tr key={issue.id}>
                  <td>{issue.book.title}</td>
                  <td>{issue.user.full_name}</td>
                  <td>{issue.issue_date}</td>
                  <td>{issue.expected_return_date}</td>
                  {activeTab === "notReturned" && (
                    <>
                      <td>{issue.overdue_status}</td>
                      <td>
                        <button onClick={() => handleReturnBook(issue.id)}>
                          Return Book
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isOverdue && (
        <div className="overlay">
          <div className="popup">
            <h3>Book Overdue - Fine $10</h3>
            <p>The book is overdue - Fine $10. Confirm fine has been paid.</p>
            <label>
              <input
                type="checkbox"
                checked={finePaid}
                onChange={(e) => setFinePaid(e.target.checked)}
              />
              Fine paid?
            </label>
            <button onClick={confirmReturnWithFine}>Yes</button>
            <button onClick={() => setIsOverdue(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default IssuedBooksList;


