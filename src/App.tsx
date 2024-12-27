import React, { useState } from "react";
import axios from "axios";
import "./App.css";

interface Message {
  text: string;
  sender: "user" | "ai";
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "こんにちは! 私はチャットボットです。何かお手伝いできますか?",
      sender: "ai"
    },
    {
      text: "日本の首都は？",
      sender: "user"
    },
    {
      text: "東京です",
      sender: "ai"
    },
    {
      text: "今日の天気は？",
      sender: "user"
    },
    {
      text: "晴れです",
      sender: "ai"
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = {
      text: input,
      sender: "user"
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/chat",
        { text: input },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );
      const aiResponse: Message = {
        text: response.data.text,
        sender: "ai"
      };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error("Error fetching response from server", error);
      const errorResponse: Message = {
        text: "Error fetching response from server",
        sender: "ai"
      };
      setMessages(prevMessages => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleClear = () => {
    setMessages([]);
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>ChatAI App</h1>
        <button className="clear-button" onClick={handleClear}>
          Clear
        </button>
      </header>
      <div className="chat-container">
        <div className="chat-box">
          {messages.map((message, index) => <>
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div></>
          )}
          {isLoading && <div className="message ai loading">Loading...</div>}
        </div>
        <div className="input-box">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading}
            className={isLoading ? "disabled" : ""}
          />
          <button onClick={handleSend} disabled={isLoading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
