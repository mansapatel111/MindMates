import React, { useState } from 'react'; //Imports dependences
import { useNavigate } from 'react-router-dom';

function Login(){


    const [username, setUsername] = useState(''); //This is just initializes the variables to empty
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

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
            setMessage(`Login successful!`);
            localStorage.setItem('token', data.token);
            localStorage.setItem('firstName', data.firstName);
            localStorage.setItem('lastName', data.lastName);
            navigate('/dashboard');
          } else {
            setMessage(data.message);
          }
        } catch (error) {
          setMessage('Login failed');
        }
      };

      return (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
          </form>
          {message && <h2>{message}</h2>}
        </div>
      );
    }
    
    export default Login;