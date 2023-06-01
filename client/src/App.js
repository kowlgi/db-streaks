import './App.css';

import React, {useState, useEffect} from 'react';

// Import the functions you need from the SDKs you need
import {initializeApp } from "firebase/app";
import {getDatabase, ref, child, update, get, onValue} from 'firebase/database';
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

function getStreakCountFromTimestamps(timestampList){
  timestampList.sort().reverse();

  let streakCount = 0;
  for(let ii = 0; ii < timestampList.length - 1; ii++) {
    const timeDiff = timestampList[ii] - timestampList[ii+1];
    if(timeDiff > 3 && timeDiff < 6) streakCount++;
    else return streakCount;
  }

  return streakCount;
}

function App() {
  const [userid, setUserId] = useState(null);
  const [useridInput, setUserIdInput] = useState('');
  const [checkIn, setCheckIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    let unsubscribeCoinListener = null;
    let unsubscribeTimestampListener = null;

    get(child(ref(database), `users/${userid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        //set up listeners for coins and timestamps
        unsubscribeCoinListener = onValue(child(ref(database), `/users/${userid}/total_coins`), (snapshot) => {
          if(snapshot.exists()){
            const data = snapshot.val();
            setCoins(snapshot.val());
          } 
        });

        unsubscribeTimestampListener = onValue(child(ref(database), `/users/${userid}/timestamps`), (snapshot) => {
          if(snapshot.exists()){
            let timestampList = [];
            snapshot.forEach((timestamp) => {
              timestampList.push(parseInt(timestamp.key));
            })
            let streakCount = getStreakCountFromTimestamps(timestampList);
            setStreak(streakCount);
          }
        });
      } else {
        // user does not exist
        let updates = {};
        updates[`/users/${userid}/total_coins`] = 0;
        update(ref(database), updates).then(() => {
          //set up listeners for coins and timestamps
          unsubscribeCoinListener = onValue(child(ref(database), `/users/${userid}/total_coins`), (snapshot) => {
            if(snapshot.exists()){
              const data = snapshot.val();
              setCoins(snapshot.val());
            } 
          });

          unsubscribeTimestampListener = onValue(child(ref(database), `/users/${userid}/timestamps`), (snapshot) => {
            if(snapshot.exists()){
              let timestampList = [];
              snapshot.forEach((timestamp) => {
                timestampList.push(parseInt(timestamp.key));
              })
              let streakCount = getStreakCountFromTimestamps(timestampList);
              setStreak(streakCount);
            }
          });
        });
      }
    }).catch((error) => {
      console.log(error);
    }); 

    return () => {
      if(unsubscribeCoinListener) unsubscribeCoinListener();
      if(unsubscribeTimestampListener) unsubscribeTimestampListener();
    }
  }, [userid])

  useEffect(() => {
    if(checkIn === true) {
      fetch('checkin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userid: "sunil"})
      }).then((res) => {
          console.log(res);
        }
      )
    } 
    setCheckIn(false);
  }, [checkIn])


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
        <a> Logout </a>
        <p >Click daily for rewards!</p>
        <br></br>
        <button onClick={() => setCheckIn(true)}>Check in!</button>
        <br></br>
        <p>Streak: {streak}</p>
        <br></br>
        <p>Coins: {coins}</p>
      </header>
    </div>
  );
}

export default App;
