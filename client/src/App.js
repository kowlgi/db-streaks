import logo from './logo.svg';
import './App.css';

import React, {useState, useEffect} from 'react';

function App() {
  const [userid, setUserId] = useState(null);
  const [useridInput, setUserIdInput] = useState('');

  useEffect(() => {

  }, [userid])

  if(userid === null) {
    return (
      <div className="App">
        <header className="App-header">
        <p >
          Sign into DappBack Streaks
        </p>
        <input value={useridInput} onChange={(e) => setUserIdInput(e.target.value)} placeholder="Enter user id"></input>
        <br></br>
        <button onClick={() => setUserId(useridInput)} disabled={useridInput.length <= 0}>Sign in</button>
        </header>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <p >
          Click daily for rewards!
        </p>
      </header>
    </div>
  );
}

export default App;
