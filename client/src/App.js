import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('Loading...');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessage();
  }, []);

  const fetchMessage = async () => {
    try {
      const response = await fetch('/api/message');
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error fetching message:', error);
      setMessage('Error loading message');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage }),
      });
      if (response.ok) {
        setNewMessage('');
        fetchMessage();
      }
    } catch (error) {
      console.error('Error submitting message:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Message Board</h1>
      </header>
      <main>
        <section className="message-display">
          <h2>Current Message:</h2>
          <p>{message}</p>
          <button onClick={fetchMessage}>Refresh Message</button>
        </section>
        <section className="message-form">
          <h2>Add New Message:</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter a new message"
              required
            />
            <button type="submit">Submit</button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;