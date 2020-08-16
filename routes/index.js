var express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('main', {
        title: 'login project',
        twits: [],
        user: req.user,
        loginError: req.flash('loginError'),
    });
});

router.get('/join', isNotLoggedIn, (req, res, next) => {
    res.render('join', {
        title: '회원가입',
        user: req.user,
        joinError: req.flash('joinError'),
    });
});

router.get('/profile', isLoggedIn, (req, res, next) => {
    res.render('profile', {
        title: '내 정보',
    });
});

module.exports = router;
