import React, { useEffect, useState } from 'react';
import {fetchHelloWorld} from './api';

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
