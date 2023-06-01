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
const ref = database.ref;

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

router.post('/checkin', async function(req, res, next) {
    if(req.body.userid === null || req.body.userid.length <= 0) res.send('empty user id');

    const now = new Date();
    const timestampsSnapshot = await database.get(database.child(database.ref(db), `users/${req.body.userid}/timestamps`));
    if (timestampsSnapshot.exists()) {
        let timestampList = [];
        timestampsSnapshot.forEach((timestamp) => {
          timestampList.push(parseInt(timestamp.key));
        })
        timestampList.sort().reverse();
        const currentTimeInEpochSeconds = Math.round(now.getTime()/1000);
        const timeDiff = currentTimeInEpochSeconds - timestampList[0];
        let streakCount = 0;
        let addCoins = 0;
        if(timeDiff > 3 && timeDiff < 6) {
          // TODO: add timestamp to database
          // TODO: add 1 coin to user
          streakCount = 1;
        }  

        const currentStreakCount = getStreakCountFromTimestamps(timestampList);
        streakCount += currentStreakCount;
        const bonusSnapshot = await database.get(database.child(database.ref(db), `bonus`));
        if(bonusSnapshot.exists()) {
          bonusSnapshot.forEach((bonus) => {
            if(streakCount === bonus.streak_length) {
              addCoins = bonus.bonus_coins;
            }
          })
        }

        if(addCoins > 0) {
          
        }
    }
    res.send("done");
});

module.exports = router;
