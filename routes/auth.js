module.exports = function(app, passport) {
  app.post('/login', passport.authenticate('local-signin', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
  }));

  app.get('/auth/facebook',
    passport.authenticate('facebook', { scope : 'email' })
  );

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect : '/login',
      failureFlash : true
    }),
    function(req, res, next) {
      req.flash('success', '로그인되었습니다.');
      res.redirect('/');
    }
  );

  app.get('/auth/google',
    passport.authenticate('google', { scope : ['profile', 'email'] })
  );

  // the callback after google has authenticated the user
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect : '/login',
      failureFlash : true
    }),
    function(req, res, next) {
      req.flash('success', '로그인되었습니다.');
      res.redirect('/');
    }
  );


  app.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', '로그아웃 되었습니다.');
    res.redirect('/');
  });
};
