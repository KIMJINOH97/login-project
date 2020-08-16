const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const passport = require('passport');
const { session } = require('passport');

const router = express.Router();

// POST   /auth/join 요청이 들어옴.
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, password, nick, age } = req.body; // 요청에 들어 온 항목들
    try {
        const isuser = await User.findOne({ where: { email } });
        if (isuser) {
            req.flash('joinError', '이미 가입된 이메일 입니다.');
            return res.redirect('/join');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            password: hash,
            nick,
            age,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST/   /auth/login
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            req.flash('loginError', info.message);
            console.log('에러났어요');
            return res.redirect('/');
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            console.log('로그인 성공!!');
            return res.redirect('/');
        });
    })(req, res, next);
});

// GET/   auth/logout
router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout();
    req.session.destroy();
    return res.redirect('/');
});

module.exports = router;
