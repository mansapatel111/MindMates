import React, { useState, useEffect, useRef } from "react";
import "../Chatbot.css";

const Chatbot = () => {
  const allQuestions = [
    
    "How are you feeling today?",
    "What is one thing you're grateful for?",
    "What was a small win you had today?",
    "How can you show kindness to yourself or others?",
    "What is one thing you're looking forward to tomorrow?",
    "What is something you learned today?",
    "What is one thing you can do to take care of yourself today?",
    "What is a positive affirmation you can tell yourself?",
    "What is one thing you can do to help someone else today?",
    "What is one thing you can do to be more present in the moment?",
    "What is one thing you can do to improve your work-life balance?",
    "What is one thing you can do to improve your self-esteem?",
    "What is one thing you can do to improve your self-awareness?",
    "What is one thing you can do to improve your emotional intelligence?",
    "What is one thing you can do to improve your resilience?",

    "What’s one thing you can see, hear, and feel right now?",
    "Take a deep breath. What does your body feel like in this moment?",
    "Can you name 3 things you're grateful for today?",
    "If your thoughts were clouds, what kind of sky would they be in right now?",

    "Pick a color. Now describe a memory or emotion linked to that color.",
    "If your current mood was a weather report, what would it say?",
    "Imagine a tiny garden in your mind. What’s growing in it today?",
    "Draw an emotion using only three emojis 🌱😶💭 — what are they?",
    "If you could write a letter to your future self, what would you say?",
    "What’s a song that resonates with your current feelings?",
    "If you could paint your mood, what colors would you use?",
    "What’s a quote or mantra that inspires you?",
    "On a scale of 1–10, how are you feeling emotionally?",
    "What’s a word that captures your mood right now?",
    "What do you wish someone would say to you today?",
    "If you could send one kind message to yourself, what would it be?",
    "What’s one thing you can do to be kinder to yourself today?",
    "If you could give your current mood a name, what would it be?",
    "What’s something you did today that you’re proud of (big or small)?",
    "What do you need to hear right now?",
    "What’s one kind thing you can do for yourself after this chat?",
    "Finish this sentence: I am worthy of…",
    "If your stress had a voice, what would it say?",
    "When was the last time you felt truly at peace?",
    "What’s one thing you want to let go of today?",
    "What’s something small that brings you joy?",
  ];

  const getRandomQuestions = (questions, count) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const [questions, setQuestions] = useState(getRandomQuestions(allQuestions, 5));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [chatFinished, setChatFinished] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [streak, setStreak] = useState(0);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true); // i added new state for sound control

  const token = localStorage.getItem("token");
  const questionAudioRef = useRef(null);
  const completionAudioRef = useRef(null);

  useEffect(() => {
    const initializeAudio = () => {
      if (completionAudioRef.current && soundEnabled) {
        completionAudioRef.current.loop = true;
        completionAudioRef.current.play();
        setAudioInitialized(true);
      }
      document.removeEventListener("click", initializeAudio);
      document.removeEventListener("keypress", initializeAudio);
    };
    if (!audioInitialized) {
      document.addEventListener("click", initializeAudio);
      document.addEventListener("keypress", initializeAudio);
    }

    const fetchStreakData = async () => {
      try {
        const response = await fetch("http://localhost:5001/chatbot/getResponses", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (data && data.streak !== undefined) {
          setStreak(data.streak);
        }
        if (data && data.smilestones !== undefined) {
          localStorage.setItem("smilestones", data.smilestones);
        }
      } catch (error) {
        console.error("Error fetching streak data:", error);
      }
    };

    if (token) fetchStreakData();
  }, [token, audioInitialized, soundEnabled]);

  const manageBackgroundMusic = (action) => {
    if (completionAudioRef.current) {
      if (action === "pause") {
        completionAudioRef.current.pause();
      } else if (action === "play" && soundEnabled) {
        completionAudioRef.current.play();
      }
    }
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const newSoundState = !prev;
      if (newSoundState) {
        manageBackgroundMusic("play");
      } else {
        manageBackgroundMusic("pause");
      }
      return newSoundState;
    });
  };

  const handleNext = async () => {
    if (inputValue.trim()) {
      const newResponses = [...responses, inputValue];
      setResponses(newResponses);
      setInputValue("");

      if (currentQuestion < questions.length - 1) {
        // Pause bg and add question audio
        manageBackgroundMusic("pause");
        if (questionAudioRef.current) {
          questionAudioRef.current.play();
          questionAudioRef.current.onended = () => {
            // Resume bg
            manageBackgroundMusic("play");
          };
        }

        setCurrentQuestion(currentQuestion + 1);
      } else {
        setChatFinished(true);
        // Stop question audio 
        if (questionAudioRef.current) {
          questionAudioRef.current.pause();
          questionAudioRef.current.currentTime = 0;
        }
        // resume bg when session is completed
        manageBackgroundMusic("play");
        try {
          const res = await fetch("http://localhost:5001/chatbot/saveResponses", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      handleNext();
    }
  };

  const handleReloadQuestion = () => {
    let newQuestionIndex;
    do {
      newQuestionIndex = Math.floor(Math.random() * allQuestions.length);
    } while (questions.includes(allQuestions[newQuestionIndex]));

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion] = allQuestions[newQuestionIndex];
    setQuestions(updatedQuestions);
    // Pause bg music and play question audio
    manageBackgroundMusic("pause");
    if (questionAudioRef.current) {
      questionAudioRef.current.play();
      questionAudioRef.current.onended = () => {
        // Resume after question audio finishes
        manageBackgroundMusic("play");
      };
    }
  };

  return (
    <div className="chatbot-container">
      <h1 className="chatbot-title">Mindfulness Chatbot</h1>
      <audio ref={questionAudioRef} src="/audio/metalic-instrument-328274.mp3" />
      <audio ref={completionAudioRef} src="/audio/calm-background-piano-148405.mp3" />

      {/* Sound Button */}
      <button className="sound-toggle-button" onClick={toggleSound}>
        {soundEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
      </button>

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
          <div className="chatbot-message-container">
            <div className="chatbot-message chatbot-question">
              {questions[currentQuestion]}
            </div>
            <button
              className="reload-button"
              onClick={handleReloadQuestion}
              title="Reload Question"
            >
              🔄
            </button>
          </div>
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