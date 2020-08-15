const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const morgan = require('morgan');
const flash = require('connect-flash');
const { sequelize } = require('./models');

require('dotenv').config();

// 라우터 파일 모듈
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

// 포트설정
app.set('port', process.env.PORT || 8000);

// 개발용
app.use(morgan('dev'));
// 정적파일 담기
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
        },
    })
);

// 1회성 메시지
app.use(flash());

// 라우터
app.use('/', indexRouter);
app.use('/auth', authRouter);

// 에러처리
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

// 포트를 연다. app.get('port') = 8080
app.listen(app.get('port'), () => {
    console.log(`${app.get('port')}번 포트에서 서버 실행 중입니다.`);
});
