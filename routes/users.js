var express = require('express'),
    User = require('../models/User');
var router = express.Router();

function confirm(form) {
  var name = form.name || "";
  var email = form.email || "";
  name = name.trim();
  email = email.trim();

  if (!name) {
    return '이름을 입력해주세요.';
  }
  if (!email) {
    return '이메일을 입력해주세요.';
  }
  if (!form.password) {
    return '비밀번호를 입력해주세요.';
  }
  if (form.password !== form.pwCheck) {
    return '비밀번호가 일치하지 않습니다.';
  }
  if (form.password.length < 4) {
    return '비밀번호는 4글자 이상이어야 합니다.';
  }
  return null;
}


/* GET users listing. */
router.get('/', function(req, res, next) {
  User.findById(res.locals.currentUser.id, function(err, user) {
    if(err) {
      return next(err);
    }
    res.render('users/profile', {user: user});
  });
});

router.post('/', function(req, res, next) {

  var err = confirm(req.body);  //에러시 err에 에러 스트링, 에러가 없을시 null
  if(err) {                     //err에 스트링 값이 있다면
    req.flash('danger', err);   // flashMessages에 err 스트링 값 입력
    return res.redirect('back');  // redirect back 으로 이전 페이지(회원가입)으로 이동
  }

  //에러가 없다면 DB 입력 시도
  User.findOne({email: req.body.email}, function(err, user) {
    if (err) {
      return next(err);
    }
    if (user) {
      req.flash('danger', '동일한 이메일 주소가 이미 존재합니다.');
      return res.redirect('back');
    }
    var newUser = new User({
      name: req.body.name,
      email: req.body.email
    });
    newUser.password = newUser.generateHash(req.body.password);

    newUser.save(function(err) {
      if (err) {
        next(err);
      }
      else {
        req.flash('success', '가입이 완료되었습니다. 로그인 해주세요.');
        res.redirect('/');
      }
    });
  });
});

module.exports = router;
