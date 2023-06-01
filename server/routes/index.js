var express = require('express');
var router = express.Router();

router.post('/checkin', function(req, res, next) {
  console.log("hello");
});

module.exports = router;
