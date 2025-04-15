
import React, { useState, useEffect } from "react";
import "../Chatbot.css";

const Chatbot = () => {
  const questions = [
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
  const [streak, setStreak] = useState(0);

  const token = localStorage.getItem("token");

  // Fetch streak information on component mount
  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        const response = await fetch("http://localhost:5001/chatbot/getResponses", {
          headers: { Authorization: token },
        });
        const data = await response.json();
        
        // Set streak from returned data
        if (data && data.streak !== undefined) {
          setStreak(data.streak);
        }
      } catch (error) {
        console.error("Error fetching streak data:", error);
      }
    };

    if (token) fetchStreakData();
  }, [token]);

  const handleNext = async () => {
    if (inputValue.trim()) {
      const newResponses = [...responses, inputValue];
      setResponses(newResponses);
      setInputValue("");

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setChatFinished(true);

        try {
          // Save completion and update streak
          const res = await fetch("http://localhost:5001/chatbot/saveResponses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({ responses: newResponses }),
          });

          const data = await res.json();
          if (data && data.streak !== undefined) {
            setStreak(data.streak);
          }
        } catch (error) {
          console.error("Error saving completion:", error);
        }
      }
    }
  };

  // Handle keyboard Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleNext();
    }
  };

  return (
    <div className="chatbot-container">
      <h1 className="chatbot-title">Mindfulness Chatbot</h1>
      
      {streak > 0 && (
        <div className="streak-display">
          <p>🔥 Current streak: {streak} day{streak !== 1 ? "s" : ""}</p>
        </div>
      )}
      
      <div className="chatbot-messages">
        {responses.map((response, index) => (
          <div key={index}>
            <div className="chatbot-message chatbot-question">{questions[index]}</div>
            <div className="chatbot-message chatbot-answer">{response}</div>
          </div>
        ))}

        {!chatFinished && (
          <div className="chatbot-message chatbot-question">{questions[currentQuestion]}</div>
        )}
      </div>

      {!chatFinished && (
        <div className="chatbot-input-container">
          <input
            type="text"
            className="chatbot-input"
            placeholder="Type your answer..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="chatbot-submit" onClick={handleNext}>
            Submit
          </button>
        </div>
      )}

      {chatFinished && (
        <>
          <h2 className="chatbot-finished">Session complete! 🎉</h2>
          <p className="chatbot-streak">
            🔥 Your current streak is {streak} day{streak !== 1 ? "s" : ""}!
          </p>
        </>
      )}
    </div>
  );
};

export default Chatbot;
// import React, { useState, useEffect } from "react";
// import "../Chatbot.css";

// const Chatbot = () => {
//   const questions = [
//     "How are you feeling today?",
//     "What is one thing you're grateful for?",
//     "What was a small win you had today?",
//     "How can you show kindness to yourself or others?",
//     "What is one thing you're looking forward to tomorrow?"
//   ];

//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [responses, setResponses] = useState([]);
//   const [chatFinished, setChatFinished] = useState(false);
//   const [inputValue, setInputValue] = useState("");
//   const [streak, setStreak] = useState(0); // 🔥 New: state for streak

//   const token = localStorage.getItem("token");

//   // Fetch previous responses from the backend
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       window.location.href = '/login';
//       return;
//     }

//     const fetchResponses = async () => {
//       try {
//         const response = await fetch("http://localhost:5001/chatbot/getResponses", {
//           headers: { "Authorization": `Bearer ${token}` },
//         });
//         const data = await response.json();
//         if (Array.isArray(data) && data.length > 0) {
//           setResponses(data);
//           setCurrentQuestion(data.length);
//         }
//       } catch (error) {
//         console.error("Error fetching past responses:", error);
//       }
//     };

//     if (token) fetchResponses();
//   }, [token]);

//   const handleNext = async () => {
//     if (inputValue.trim()) {
//       const newResponses = [...responses, inputValue];
//       setResponses(newResponses);
//       setInputValue("");

//       if (currentQuestion < questions.length - 1) {
//         setCurrentQuestion(currentQuestion + 1);
//       } else {
//         setChatFinished(true);

//         // Send respon to backend
//         const token = localStorage.getItem('token');
//         try {
//           const res = await fetch("http://localhost:5001/chatbot/saveResponses", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               "Authorization": `Bearer ${token}`
//             },
//             body: JSON.stringify({ responses: newResponses }),
//           });

//           const data = await res.json();
//           console.log("Current streak:", data.streak);
//           setStreak(data.streak); // Save streak to state

//         } catch (error) {
//           console.error("Error saving responses:", error);
//         }
//       }
//     }
//   };
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && inputValue.trim()) {
//       handleNext();
//     }
//   };

//   return (
//     <div className="chatbot-container">
//       <h3 className="chatbot-title">~Mindfulness Chatbot~ </h3>
//       {streak > 0 && (
//         <div className="streak-display">
//           <p>🔥 Current streak: {streak} day{streak !== 1 ? "s" : ""}</p>
//         </div>
//       )}
//       <div className="chatbot-messages">
//         {responses.map((response, index) => (
//           <div key={index}>
//             <div className="chatbot-message chatbot-question">{questions[index]}</div>
//             <div className="chatbot-message chatbot-answer">{response}</div>
//           </div>
//         ))}

//         {!chatFinished && (
//           <div className="chatbot-message chatbot-question">{questions[currentQuestion]}</div>
//         )}
//       </div>

//       {!chatFinished && (
//         <div className="chatbot-input-container">
//           <input
//             type="text"
//             className="chatbot-input"
//             placeholder="Type your answer..."
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//           />
//           <button className="chatbot-submit" onClick={handleNext}>Submit</button>
//         </div>
//       )}

//       {chatFinished && (
//         <>
//           <h2 className="chatbot-finished">Session complete! 🎉</h2>
//           {streak !== null && (
//             <p className="chatbot-streak">🔥 Your current streak is {streak} day{streak !== 1 ? "s" : ""}!</p>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Chatbot;
