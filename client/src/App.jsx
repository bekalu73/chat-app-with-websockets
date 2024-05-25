import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";

const ENDPOINT = "http://localhost:5000";
const socket = socketIOClient(ENDPOINT);

function App() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("loadMessages", (data) => {
      setMessages(data);
    });

    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, []);
  const sendMessage = () => {
    if (name && message) {
      const newMessage = { name, message };
      socket.emit("sendMessage", newMessage);
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Chat App</h1>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.name}: </strong>
            {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
