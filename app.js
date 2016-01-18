var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var configAuth = require('./config/auth');
var routeAuth = require('./routes/auth');

var routes = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var memo = require('./routes/memo');

// MongoDB
var mongoose   = require('mongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// MongoDB connect
mongoose.connect('mongodb://root:fpdrk17@ds039115.mongolab.com:39115/blogpost');
mongoose.connection.on('error', console.log);


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method', {methods: ['POST', 'GET']}));

//session
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'long-long-long-secret-string-1313513tefgwdsvbjkvasd'
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, next) {
  console.log(req.user);
  res.locals.currentUser = req.user;    //유저가 없으면 undifind
  res.locals.flashMessages = req.flash();
  next();
});

app.locals.moment = require('moment');

configAuth(passport);

app.use('/', routes);
app.use('/users', users);
app.use('/posts', posts);
app.use('/memo', memo);

routeAuth(app, passport);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
