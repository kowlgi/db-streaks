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

router.post('/checkin', function(req, res, next) {
    if(req.body.userid === null || req.body.userid.length <= 0) res.send('empty user id');

    let now = new Date();
    database.get(database.child(database.ref(db), `users/${req.body.userid}/timestamps`), database.limitToLast(1)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.log(error);
    });  

    res.send("done");
});

module.exports = router;
