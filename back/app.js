const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookie = require('cookie-parser');
const morgan = require('morgan');

const db = require('./models');
const passportConfig = require('./passport');
const usersRouter = require('./routes/user');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');

const app = express();

db.sequelize.sync();
passportConfig();

// app.use -> req, res를 조작
// 미들웨어
app.use(morgan('dev')); // 요청이 왔을때 콘솔에 요청 온것을 보여주는 미들웨어
app.use(express.json()); //json 데이터 헤삭
app.use(express.urlencoded({ extended: false })); // form을 통한 데이터 해석
app.use('/', express.static('uploads'));
app.use(cookie('cookiesecret'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'cookiesecret',
    cookie: {
        httpOnly: true,
        secure: false,
    },
}))
app.use(cors({
    origin: 'http://localhost:3000',   // 프론트 서버 주소 허용
    credentials: true,
})); 
app.use(passport.initialize());
app.use(passport.session());    // 기록(로그인 정보 등)

app.use('/user', usersRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);

app.get('/', (req, res) => {
    res.send('안녕. 백엔드');
})

app.listen(3085, () => {
    console.log(`백엔드 서버 ${3085} 번 포트 작동`);
});