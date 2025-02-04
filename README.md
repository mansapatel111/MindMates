Instructions to download dependencies


Step 1: Install Node.js and npm
Download and install Node.js from nodejs.org.
Verify the installation
node -v
npm -v

Step 2: Set Up the Backend (Node.js + Express)
Create a new directory for your project and navigate into it:
mkdir mern-app
cd mern-app

Initialize a new Node.js project:
npm init -y
Install Express and other dependencies:
npm install express mongoose cors
Create the main server file (server.js):
touch server.js

If you don't have MongoDB installed, follow the instructions on mongodb.com to install it.
Start the MongoDB server:
mongod
Create a .env file in the root of your project to store environment variables:
touch .env
Add your MongoDB connection string to the .env file:
Create a new React application inside your project directory:
npx create-react-app client
Navigate into the React application directory:
cd client
Start the React development server:
npm start


Install Axios in the React application:
npm install axios
Create a proxy in client/package.json to forward requests to the Express server:
"proxy": "http://localhost:5000"
Create a new file client/src/api.js and add the following code to make API requests:
import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:5000' });
export const fetchHelloWorld = () => API.get('/');
Use the API in a React component, for example in client/src/App.js:
import React, { useEffect, useState } from 'react';
import { fetchHelloWorld } from './api';
function App() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    fetchHelloWorld().then(response => {
      setMessage(response.data);
    });
  }, []);
  return (
    <div className="App">
      <h1>{message}</h1>
    </div>
  );
}
export default App;


Start the Express server:
node server.js
Start the React development server (in a separate terminal):
cd client
npm start
