var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
  res.render('users/signUp');
});

router.get('/login', function(req, res, next) {
  res.render('users/logIn');
});


module.exports = router;
