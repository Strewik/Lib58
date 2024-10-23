import { useState, useEffect } from "react";
import api from "../api"; // Axios instance for API calls

function IssuedBooksList() {
  const [issuedBooks, setIssuedBooks] = useState([]); // Store the list of issued books
  const [activeTab, setActiveTab] = useState("notReturned"); // Active tab: "notReturned" or "returned"

  // Fetch issued books from the API when the component mounts
  useEffect(() => {
    fetchIssuedBooks();
  }, []);

  const fetchIssuedBooks = async () => {
    try {
      const response = await api.get("/api/issue/");
      setIssuedBooks(response.data);
    } catch (error) {
      console.error("Error fetching issued books:", error);
    }
  };

  
  const handleReturnBook = async (bookId) => {
    try {
      await api.patch(`/api/issues/${bookId}/return/`, { status: "returned" });
      fetchIssuedBooks(); 
      alert("Book returned successfully!");
    } catch (error) {
      console.error("Error returning the book:", error);
      alert("Failed to return the book.");
    }
  };

  // Filter books based on the active tab
  const filteredBooks =
    activeTab === "notReturned"
      ? issuedBooks.filter((book) => book.status === "issued")
      : issuedBooks.filter((book) => book.status === "returned");

  return (
    <div>
      <h2>Issued Books</h2>
      {/* Tabs for filtering the list */}
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
      </div>

      {/* Book List */}
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
                {activeTab === "notReturned" && <th>Action</th>}
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
                    <td>
                      <button onClick={() => handleReturnBook(issue.id)}>
                        Return Book
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default IssuedBooksList;
