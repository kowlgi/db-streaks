var express = require('express');
var router = express.Router();

let firebase = require('firebase/app');
let database = require('firebase/database');
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

const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase
const db = database.getDatabase(app);

const MIN_TIME_BETWEEN_TIMESTAMPS_FOR_STREAK_COUNT = 5; // in seconds
const MAX_TIME_BETWEEN_TIMESTAMPS_FOR_STREAK_COUNT = 10; // in seconds

function getStreakCountFromTimestamps(timestampList){
  timestampList.sort().reverse();

  let streakCount = 0;
  for(let ii = 0; ii < timestampList.length - 1; ii++) {
    const timeDiff = timestampList[ii] - timestampList[ii+1];
    if(timeDiff > MIN_TIME_BETWEEN_TIMESTAMPS_FOR_STREAK_COUNT && 
      timeDiff < MAX_TIME_BETWEEN_TIMESTAMPS_FOR_STREAK_COUNT) streakCount++;
    else return streakCount;
  }

  return streakCount;
}

router.post('/checkin', async function(req, res, next) {
    if(req.body.userid === null || req.body.userid.length <= 0) {
      res.send('empty user id');
      return;
    }

    try {
        let streakCount = 0;
        let newCoins = 0;
        const now = new Date();
        const currentTimeInEpochSeconds = Math.round(now.getTime()/1000);
        const timestampsSnapshot = await database.get(database.child(database.ref(db), `users/${req.body.userid}/timestamps`));
        let timestampList = [];

        // Check if we should save new timestamp 
        if (timestampsSnapshot.exists()) {
            timestampsSnapshot.forEach((timestamp) => {
                timestampList.push(parseInt(timestamp.key));
            })
            timestampList.sort().reverse();
            const timeDiff = currentTimeInEpochSeconds - timestampList[0]; // compare new timestamp with last saved timestamp
            
            if(timeDiff < MIN_TIME_BETWEEN_TIMESTAMPS_FOR_STREAK_COUNT) {
              res.send("done"); // this timestamp does not count towards streak
              return;
            }

            const currentStreakCount = getStreakCountFromTimestamps(timestampList);
            streakCount += currentStreakCount;
        }

        let updates = {};
        updates[`/users/${req.body.userid}/timestamps/${currentTimeInEpochSeconds}`] = true;
        await database.update(database.ref(db), updates); // save new timestamp
        streakCount++;
        newCoins++; // new coin because user added to the streak

        console.log(streakCount)
        // Compute Bonus coins
        const bonusSnapshot = await database.get(database.child(database.ref(db), `bonus`));
        if(bonusSnapshot.exists()) {
          console.log("bonus exists");
          bonusSnapshot.forEach((bonus) => {
            console.log(parseInt(bonus.val()))
/*             if(streakCount === parseInt(bonus.val().streak_length)) {
              newCoins += parseInt(bonus.val().bonus_coins);
            } */
          })
        }

        console.log(streakCount);
        // Update user's total coins
        const coinsSnapshot = await database.get(database.child(database.ref(db), `users/${req.body.userid}/total_coins`));
        if(newCoins > 0) {
          let totalCoins = 0;
          if(coinsSnapshot.exists()) totalCoins = parseInt(coinsSnapshot.val()) + newCoins;
          else totalCoins = newCoins;

          console.log(totalCoins);
          let updates = {};
          updates[`/users/${req.body.userid}/total_coins`] = totalCoins;
          await database.update(database.ref(db), updates);
        }
    } catch(err) {
      // fall carefully into the cliff
      console.log(err);
    }

    res.send("done");
});

module.exports = router;
