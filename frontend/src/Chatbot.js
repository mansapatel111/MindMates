import React, { useState, useEffect } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const questions = [
    "Hello, are you ready to start today's session?",
    "How are you feeling today?",
    "What is one thing you're grateful for?",
    "What was a small win you had today?",
    "How can you show kindness to yourself or others?",
    "What is one thing you're looking forward to tomorrow?"
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [chatFinished, setChatFinished] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const userId = "testUser123"; // gonna replace with actual user ID

  // Fetching previous responses from the backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchResponses = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/getResponses/${userId}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.length > 0) {
          setResponses(data);
          setCurrentQuestion(data.length); 
        }
      } catch (error) {
        console.error("Error fetching past responses:", error);
      }
    };
    fetchResponses();
  }, []);

  const handleNext = async () => {
    if (inputValue.trim()) {
      const newResponses = [...responses, inputValue];
      setResponses(newResponses);
      setInputValue("");

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setChatFinished(true);

        // Send respon to backend
        const token = localStorage.getItem('token');
        try {
          await fetch(`${process.env.REACT_APP_API_BASE_URL}/saveResponses`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ userId, responses: newResponses }),
          });
        } catch (error) {
          console.error("Error saving responses:", error);
        }
      }
    }
  };

  return (
    <div className="chatbot-container">
      <h1 className="chatbot-title">Mindfulness Chatbot 🪷</h1>
      <div className="chatbot-messages">
        {/* Chatbot Questions */}
        {responses.map((response, index) => (
          <div key={index}>
            <div className="chatbot-message chatbot-question">
              {questions[index]}
            </div>
            <div className="chatbot-message chatbot-answer">{response}</div>
          </div>
        ))}

        {/* cuuurrent Question */}
        {!chatFinished && (
          <div className="chatbot-message chatbot-question">
            {questions[currentQuestion]}
          </div>
        )}
      </div>

      {/* Chat Input */}
      {!chatFinished && (
        <div className="chatbot-input-container">
          <input
            type="text"
            className="chatbot-input"
            placeholder="Type your answer..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className="chatbot-submit" onClick={handleNext}>
            Submit
          </button>
        </div>
      )}

      {chatFinished && <h2 className="chatbot-finished">Great, Today's session is complete! 🎉</h2>}
    </div>
  );
};

export default Chatbot;