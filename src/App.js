import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css'; 


function App() {
  const [markdownContent, setMarkdownContent] = useState([]);
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    fetch('https://backend-markdown.onrender.com/')
      .then((response) => response.json())
      .then((data) => setMarkdownContent(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleInputChange = (event) => {
    setNewContent(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();



    fetch('https://backend-markdown.onrender.com/api/markdown', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: newContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMarkdownContent([...markdownContent, data]);
        setNewContent('');
      })
      .catch((error) => console.error('Error adding new content:', error));
  };



  const handleDelete = (id) => {
    fetch(`https://backend-markdown.onrender.com/api/markdown/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedContent = markdownContent.filter((item) => item._id !== id);
        setMarkdownContent(updatedContent);
      })
      .catch((error) => console.error('Error deleting content:', error));
  };



  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="text-center mb-4">Markdown Viewer</h1>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="newContent">New Markdown Content:</label>
              <textarea
                id="newContent"
                className="form-control"
                value={newContent}
                onChange={handleInputChange}
                rows="4"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Content
            </button>
          </form>
          {markdownContent.map((markdown, index) => (
            <div key={index} className="card mt-3">
              <div className="card-body">
                <ReactMarkdown>{markdown.content}</ReactMarkdown>
                <button
                  onClick={() => handleDelete(markdown._id)}
                  className="btn btn-danger mt-2"
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default App;
