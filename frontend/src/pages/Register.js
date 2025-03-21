import React, { useState } from 'react'; //Imports dependences

function Register(){
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerMessage, setRegisterMessage] = useState('');

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
          console.log("API URL:", `${process.env.REACT_APP_API_BASE_URL}/auth/register`);
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
        <div>
          <h1>Register</h1>
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Username" value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
            <button type="submit">Register</button>
          </form>
          {registerMessage && <h2>{registerMessage}</h2>}
        </div>
      );
    }
    
    export default Register;