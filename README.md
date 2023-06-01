# db-streaks
Implementation of the streaks feature

# Requirements
Node v16.17.1 

# How to run
1. git clone this repository
1. Open terminal
1. Make sure node v16 or above: for e.g. nvm use v16.17.1
1. cd to project root directory
1. Run `cd server && npm install`
1. Run `npm run start` // start server
1. `cd .. && cd client && npm install && npm run start` // start client
1. Open localhost:8000 in browser to load client web app

# Troubleshooting
* If you run the client app and the streak count is not updating, it could be the server is not running. Make sure the server is running
* The streak count doesn't update corresponding to the timer, because it's not synchronized to the timer. The timer is provided only for reference.