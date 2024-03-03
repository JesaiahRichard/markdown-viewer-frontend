import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [markdownContent, setMarkdownContent] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [loggedIn, setLoggedIn] = useState(false); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (loggedIn) {
      fetch('https://markdown-viewer-backend-dehv.onrender.com/api/markdown')
        .then((response) => response.json())
        .then((data) => setMarkdownContent(data))
        .catch((error) => console.error('Error fetching data:', error));
    }
  }, [loggedIn]);

  const handleInputChange = (event) => {
    setNewContent(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!loggedIn) {
      alert('Please log in to add content');
      return;
    }


    const sanitizedContent = newContent.trim();

    fetch('https://markdown-viewer-backend-dehv.onrender.com/api/markdown', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: sanitizedContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMarkdownContent([...markdownContent, data]);
        setNewContent('');
      })
      .catch((error) => console.error('Error adding new content:', error));
  };


  const handleEdit = (id, content) => {
  
    const editedContent = prompt('Enter the edited content:', content);
  
    
    if (editedContent === null || editedContent.trim() === '') {
      return;
    }
  

    fetch(`https://markdown-viewer-backend-dehv.onrender.com/api/markdown/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: editedContent }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to edit content');
        }
        return response.json();
      })
      .then((data) => {
        const updatedContent = markdownContent.map(item =>
          item._id === id ? { ...item, content: editedContent } : item
        );
        setMarkdownContent(updatedContent);
        alert('Content edited successfully');
      })
      .catch((error) => {
        console.error('Error editing content:', error);
        alert('Failed to edit content');
      });
  };

  
  const handleDelete = (id) => {
    fetch(`https://markdown-viewer-backend-dehv.onrender.com/api/markdown/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedContent = markdownContent.filter((item) => item._id !== id);
        setMarkdownContent(updatedContent);
      })
      .catch((error) => console.error('Error deleting content:', error));
  };

  const handleLogin = () => {
    
    fetch('https://markdown-viewer-backend-dehv.onrender.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setLoggedIn(true);
        } else {
          alert('Login failed');
        }
      })
      .catch((error) => console.error('Login error:', error));
  };

  const handleSignup = () => {
    
    fetch('https://markdown-viewer-backend-dehv.onrender.com/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Signup successful');
        } else {
          alert('Signup failed');
        }
      })
      .catch((error) => console.error('Signup error:', error));
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="text-center mb-4">Markdown Viewer</h1>
      
          {!loggedIn && (
            <form>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="button" className="btn btn-primary mr-2" onClick={handleLogin}>
                Login
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSignup}>
                Signup
              </button>
            </form>
          )}

          {/* Markdown Content and Add Form */}
          {loggedIn && (
            <div>
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="newContent">New Markdown Content:</label>
                  <textarea
                    id="newContent"
                    className="form-control"
                    value={newContent}
                    onChange={handleInputChange}
                    rows="4"
                    required
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
                    <button
  onClick={() => handleEdit(markdown._id, markdown.content)}
  className="btn btn-primary mt-2 mr-2"
>
  <i className="fas fa-edit"></i> Edit
</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
