const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const cookie = require('cookie-parser');
const morgan = require('morgan');

const db = require('./models');
const passportConfig = require('./passport');

const app = express();

db.sequelize.sync();
passportConfig();

// app.use -> req, res를 조작
// 미들웨어
app.use(morgan('dev')); // 요청이 왔을때 콘솔에 요청 온것을 보여주는 미들웨어
app.use(express.json()); //json 데이터 헤삭
app.use(express.urlencoded({ extended: false })); // form을 통한 데이터 해석
app.use(cookie('cookiesecret'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'cookiesecret',
}))
app.use(cors('http://localhost:3000/')); // 프론트 서버 주소 허용
app.use(passport.initialize());
app.use(passport.session());    // 기록(로그인 정보 등)

app.get('/', (req, res) => {
    res.send('안녕. 백엔드');
})

app.post('/user', async (req, res, next) => {
    console.log(req.body);
    try {
        const hash = await bcrypt.hash(req.body.password, 12);
        const exUser = await db.User.findOne({
            where: {
                email: req.body.email,
            }
        });
        if(exUser) {    // 이미 회원가입 되어 있을 경우
            return res.status(403).json({
                errorCode: 1,
                message: '이미 회원가입 되어있습니다.',
            });
        }
        const newUser = await db.User.create({
            email: req.body.email,
            password: hash,
            nickname: req.body.nickname,
        });
        // http status code 검색
        // 200: 성공 | 201: 성공적으로 생성했다. 살짝 의미의 한끗차이
        return res.status(201).json(newUser);
    } catch(error) {
        console.log(error);
        next(error);
    }
});

app.post('/user/login', async (req, res) => {
    passport.authenticate('local', (error, user, info) => {
        if(error) {
            console.log(error);
            return next(error);
        }
        if(info) {
            return res.status(401).send(info.reason);
        }
        return req.login(user, (error) => {  // 세션에 사용자 정보 저장(어떻게 저장?? => serializeUser)
            if(error) {
                console.log(error);
                return next(error);
            }
            return res.json(user);
        });
    })(req, res, next);
})

app.listen(3085, () => {
    console.log(`백엔드 서버 ${3085} 번 포트 작동`);
});