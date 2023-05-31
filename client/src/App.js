import logo from './logo.svg';
import './App.css';

import React, {useState, useEffect} from 'react';

// Import the functions you need from the SDKs you need
import {initializeApp } from "firebase/app";
import {getDatabase, ref, child, push, update, get} from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCX9zmsRH0-TXwnfvqk10ADJK93VN-1xhs",
  authDomain: "test-streaks.firebaseapp.com",
  databaseURL: "https://test-streaks-default-rtdb.firebaseio.com",
  projectId: "test-streaks",
  storageBucket: "test-streaks.appspot.com",
  messagingSenderId: "1043738936496",
  appId: "1:1043738936496:web:e6f385f46f5c1533c96775"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase
const database = getDatabase(app);

function App() {
  const [userid, setUserId] = useState(null);
  const [useridInput, setUserIdInput] = useState('');
  const [checkIn, setCheckIn] = useState(false);

  useEffect(() => {
    get(child(ref(database), `users/${userid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        // user exists, set up listeners for coins and timestamps
      } else {
        // user does not exist
        let updates = {};
        updates[`/users/${userid}/total_coins`] = 0;
        update(ref(database), updates).then(() => {
          //set up listeners for coins and timestamps
        });
      }
    }).catch((error) => {
      console.log(error);
    }); 
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
        <a>
          Logout
        </a>
        <p >
          Click daily for rewards!
        </p>
        <br></br>
        <button onClick={() => setUserId(useridInput)} disabled={useridInput.length <= 0}>Sign in</button>
      </header>
    </div>
  );
}

export default App;
