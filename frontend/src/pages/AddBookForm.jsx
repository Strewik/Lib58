import { useState, useEffect } from 'react';
import './AddBookForm.css';
import api from "../api";

function AddBookForm({ book, onClose, onSave }) {
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    author: '',
    genre: '',
    language: '',
    quantity: 0,
    published: ''
  });

  useEffect(() => {
    if (book) {
      setFormData({
        code: book.code || '',
        title: book.title || '',
        author: book.author || '',
        genre: book.genre || '',
        language: book.language || '',
        quantity: book.quantity || 0,
        published: book.published || ''
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (book) {
        await api.put(`/api/book/${book.id}/`, formData);
        alert('Book updated successfully!');
      } else {
        await api.post("/api/books/", formData);
        alert('Book added successfully!');
      }

      onSave();
      onClose();

      setFormData({
        code: '',
        title: '',
        author: '',
        genre: '',
        language: '',
        quantity: 0,
        published: ''
      });
    } catch (error) {
      console.error('Error adding or updating book:', error);
      alert('Failed to submit the form. Please try again.');
    }
  };

  return (
    <div className="add-book-form">
      <h2>{book ? 'Edit Book' : 'Add New Book'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="code">Code</label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="genre">Genre</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="language">Language</label>
          <input
            type="text"
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="published">Year of Publication</label>
          <input
            type="text"
            id="published"
            name="published"
            value={formData.published}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{book ? 'Update Book' : 'Add Book'}</button>
      </form>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default AddBookForm;



