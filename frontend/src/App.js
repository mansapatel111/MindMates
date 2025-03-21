import React, { useState } from 'react'; //Imports dependences
import Chatbot from "./Chatbot";
function App() { //This function defines the main React Component

 //useState() creates 2 things, [var1, setvar1] -> var1 is a state variable that stores the username, setvar1 -> a function that updates username
 // whenever the variable state setter is called, it updates the variable and re-renders the UI so it updates, so it'll just look empty

  const [username, setUsername] = useState(''); //This is just initializes the variables to empty
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');
  //We need double variables bc we we have login and register on same page, once we show one at once, we dont need double

  const handleLogin = async (event) => { //async functions allows us to write async code and use await
    event.preventDefault(); //This prevents the form from refreshing the page when submitted
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
        method: 'POST', //POST sends data to the server
        headers: {
          'Content-Type': 'application/json', //Tells the server we are sending JSON.
        },
        body: JSON.stringify({ username, password }), //Converts the input data to JSON.
      });

      const data = await response.json(); //response comes from line 18, .json() converts it into a json like format
      if (response.ok) { //.ok checks if the response code is between 200-299, anythin else means error
        setMessage(`Login successful! Token: ${data.token}`);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Login failed');
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: registerUsername, password: registerPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setRegisterMessage('Registration successful!');
      } else {
        setRegisterMessage(data.message);
      }
    } catch (error) {
      setRegisterMessage('Registration failed');
    }
  };

  return (
    <div className="App">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <h2>{message}</h2>}

      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>
            Username:
            <input
              type="text"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Register</button>
      </form>
      {registerMessage && <h2>{registerMessage}</h2>}
      <Chatbot />
    </div>
  );

}

export default App;