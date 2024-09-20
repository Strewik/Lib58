import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function IssueReturn({ bookData }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [issueData, setIssueData] = useState({
    _id: location.state?.bookData?._id || "",
    code: location.state?.bookData?.code || "",
    title: location.state?.bookData?.title || "",
    userName: "",
    userId: "",
    issueDate: new Date().toISOString().split("T")[0], // Today's date
    returnDate: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 // Adding 7 days
    )
      .toISOString()
      .split("T")[0],
    fineStatus: false,
    returned: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIssueData({
      ...issueData,
      [name]: value,
    });
  };

  const handleReturn = async () => {
    try {
      await axios.put(
        `https://library58-api.onrender.com/books/${issueData._id}`,
        {
          returned: true,
        }
      );
      alert("Book returned successfully!");
      navigate("/booklist");
    } catch (error) {
      console.error("Error returning book:", error);
      alert("Failed to return book. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Implement your Axios post request to issue the book
      console.log("Issuing book:", issueData);
      alert("Book issued successfully!");
      navigate("/booklist");
    } catch (error) {
      console.error("Error issuing book:", error);
      alert("Failed to issue book. Please try again.");
    }
  };

  return (
    <div>
      <h2>Issue/Return Book</h2>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="_id" value={issueData._id} />
        <div>
          <label>Book Code:</label>
          <input type="text" value={issueData.code} readOnly />
        </div>
        <div>
          <label>Title:</label>
          <input type="text" value={issueData.title} readOnly />
        </div>
        <div>
          <label>User Name:</label>
          <input
            type="text"
            name="userName"
            value={issueData.userName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>User ID:</label>
          <input
            type="text"
            name="userId"
            value={issueData.userId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Issue Date:</label>
          <input
            type="date"
            name="issueDate"
            value={issueData.issueDate}
            readOnly
          />
        </div>
        <div>
          <label>Return Date:</label>
          <input
            type="date"
            name="returnDate"
            value={issueData.returnDate}
            readOnly
          />
        </div>
        <div>
          <label>Fine Status:</label>
          <input
            type="text"
            value={issueData.fineStatus ? "True" : "False"}
            readOnly
          />
        </div>
        <div>
          <button type="submit">Issue Book</button>
        </div>
      </form>

      <button onClick={handleReturn}>Return Book</button>
    </div>
  );
}

export default IssueReturn;

// import React, { useState } from "react";
// import { useHistory } from "react-router-dom";
// import axios from "axios";

// function IssueReturn(props) {
//   const history = useHistory();

//   const [issueData, setIssueData] = useState({
//     _id: props.location.state.bookData._id,
//     code: props.location.state.bookData.code,
//     title: props.location.state.bookData.title,
//     userName: "",
//     userId: "",
//     issueDate: new Date().toISOString().split("T")[0], // Today's date
//     returnDate: new Date(
//       Date.now() + 7 * 24 * 60 * 60 * 1000 // Adding 7 days
//     ).toISOString().split("T")[0],
//     fineStatus: false,
//     returned: false,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setIssueData({
//       ...issueData,
//       [name]: value,
//     });
//   };

//   const handleReturn = async () => {
//     try {
//       await axios.put(`https://library58-api.onrender.com/books/${issueData._id}`, {
//         returned: true,
//       });
//       alert("Book returned successfully!");
//       history.push("/booklist");
//     } catch (error) {
//       console.error("Error returning book:", error);
//       alert("Failed to return book. Please try again.");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Implement your Axios post request to issue the book
//       console.log("Issuing book:", issueData);
//       alert("Book issued successfully!");
//       history.push("/booklist");
//     } catch (error) {
//       console.error("Error issuing book:", error);
//       alert("Failed to issue book. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <h2>Issue/Return Book</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="hidden" name="_id" value={issueData._id} />
//         <div>
//           <label>Book Code:</label>
//           <input type="text" value={issueData.code} readOnly />
//         </div>
//         <div>
//           <label>Title:</label>
//           <input type="text" value={issueData.title} readOnly />
//         </div>
//         <div>
//           <label>User Name:</label>
//           <input
//             type="text"
//             name="userName"
//             value={issueData.userName}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label>User ID:</label>
//           <input
//             type="text"
//             name="userId"
//             value={issueData.userId}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Issue Date:</label>
//           <input
//             type="date"
//             name="issueDate"
//             value={issueData.issueDate}
//             readOnly
//           />
//         </div>
//         <div>
//           <label>Return Date:</label>
//           <input
//             type="date"
//             name="returnDate"
//             value={issueData.returnDate}
//             readOnly
//           />
//         </div>
//         <div>
//           <label>Fine Status:</label>
//           <input
//             type="text"
//             value={issueData.fineStatus ? "True" : "False"}
//             readOnly
//           />
//         </div>
//         <div>
//           <button type="submit">Issue Book</button>
//         </div>
//       </form>

//       <button onClick={handleReturn}>Return Book</button>
//     </div>
//   );
// }

// export default IssueReturn;

// import React from 'react';

// function IssueReturnForm(props) {
//   const { bookData } = props.location.state;

//   return (
//     <div className="issue-return-form">
//       <h2>Issue/Return Book</h2>
//       <form>
//         <div className="form-group">
//           <label>Book Code</label>
//           <input type="text" value={bookData.code} readOnly />
//         </div>
//         <div className="form-group">
//           <label>Title</label>
//           <input type="text" value={bookData.title} readOnly />
//         </div>
//         <div className="form-group">
//           <label>Author</label>
//           <input type="text" value={bookData.author} readOnly />
//         </div>
//         {/* Add other book data fields here */}
//         <div className="form-group">
//           <label>Date Issued</label>
//           <input type="date" />
//         </div>
//         <div className="form-group">
//           <label>Date of Return</label>
//           <input type="date" />
//         </div>
//         <div className="form-group">
//           <label>Fine Status</label>
//           <input type="text" />
//         </div>
//         <div className="form-group">
//           <label>Returned</label>
//           <input type="checkbox" />
//         </div>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// }

// export default IssueReturnForm;

// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import '../css/IssueReturn.css';

// // function IssueReturnForm({ bookData }) {
// //   const [formData, setFormData] = useState({
// //     book: bookData._id,
// //     user: '',
// //     issueDate: new Date().toISOString().slice(0, 10), // Today's date
// //     returnDate: '',
// //   });

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({
// //       ...formData,
// //       [name]: value
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       await axios.post('http://localhost:4000/issue-return', formData);
// //       // Clear form fields after successful submission
// //       setFormData({
// //         ...formData,
// //         user: '',
// //         returnDate: ''
// //       });
// //       alert('Book issued successfully!');
// //     } catch (error) {
// //       console.error('Error issuing book:', error);
// //       alert('Failed to issue book. Please try again.');
// //     }
// //   };

// //   return (
// //     <div className="issue-return-form">
// //       <h2>Issue / Return Book</h2>
// //       <form onSubmit={handleSubmit}>
// //         <div className="form-group">
// //           <label htmlFor="user">User</label>
// //           <input
// //             type="text"
// //             id="user"
// //             name="user"
// //             value={formData.user}
// //             onChange={handleChange}
// //             required
// //           />
// //         </div>
// //         <div className="form-group">
// //           <label htmlFor="issueDate">Issue Date</label>
// //           <input
// //             type="date"
// //             id="issueDate"
// //             name="issueDate"
// //             value={formData.issueDate}
// //             onChange={handleChange}
// //             required
// //           />
// //         </div>
// //         <div className="form-group">
// //           <label htmlFor="returnDate">Return Date</label>
// //           <input
// //             type="date"
// //             id="returnDate"
// //             name="returnDate"
// //             value={formData.returnDate}
// //             onChange={handleChange}
// //           />
// //         </div>
// //         <button type="submit">Issue Book</button>
// //       </form>
// //     </div>
// //   );
// // }

// // export default IssueReturnForm;
