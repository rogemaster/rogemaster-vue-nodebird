const express = require('express');
const db = require('./models');

const app = express();

db.sequelize.sync();

// app.use -> req, res를 조작
// 미들웨어
app.use(express.json()); //json 데이터 헤삭
app.use(express.urlencoded({ extended: false })); // form을 통한 데이터 해석

app.get('/', (req, res) => {
    res.send('안녕. 백엔드');
})

app.post('/user', async (req, res, next) => {
    try {
        const newUser = await db.User.create({
            where: {
                email: req.body.email,
                password: req.body.password,
                nickname: req.body.nickname,
            },
        });
        // http status code 검색
        // 200: 성공 | 201: 성공적으로 생성했다. 살짝 의미의 한끗차이
        res.status(201).json(newUser);
    } catch(error) {
        console.log(error);
        next(err);
    }
})

app.listen(3085, () => {
    console.log(`백엔드 서버 ${3085} 번 포트 작동`);
});