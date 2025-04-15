import React, { useState, useEffect } from "react";
import Chatbot from "./Chatbot";

function Dashboard() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Fetch the user's name from localStorage
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    if (firstName && lastName) {
      setUserName(`${firstName} ${lastName}`);
    }
  }, []); // Runs once when the component mounts


  return (
  <div>
    <h2>Welcome to the Dashboard, {userName}!</h2>
    <Chatbot />
  </div>
  
  );
}

export default Dashboard;
