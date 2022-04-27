const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./models');

const app = express();

db.sequelize.sync();

// app.use -> req, res를 조작
// 미들웨어
app.use(express.json()); //json 데이터 헤삭
app.use(express.urlencoded({ extended: false })); // form을 통한 데이터 해석
app.use(cors('http://localhost:3000/')); // 프론트 서버 주소 허용

app.get('/', (req, res) => {
    res.send('안녕. 백엔드');
})

app.post('/user', async (req, res, next) => {
    console.log(req.body);
    try {
        const hash = await bcrypt.hash(req.body.password, 12);
        const newUser = await db.User.create({
            email: req.body.email,
            password: hash,
            nickname: req.body.nickname,
        });
        // http status code 검색
        // 200: 성공 | 201: 성공적으로 생성했다. 살짝 의미의 한끗차이
        res.status(201).json(newUser);
    } catch(error) {
        console.log(error);
        next(error);
    }
})

app.listen(3085, () => {
    console.log(`백엔드 서버 ${3085} 번 포트 작동`);
});