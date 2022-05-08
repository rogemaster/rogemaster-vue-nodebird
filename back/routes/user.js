const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { isNotLoggedIn, isLoggedIn } = require('./middleware');

router.get('/', async (req, res, next) => {
    const user = req.user;
    res.json(user);
});

// 회원가입
router.post('/', isNotLoggedIn, async (req, res, next) => {
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
        await db.User.create({
            email: req.body.email,
            password: hash,
            nickname: req.body.nickname,
        });
        // http status code 검색
        // 200: 성공 | 201: 성공적으로 생성했다. 살짝 의미의 한끗차이
        // return res.status(201).json(newUser);
        passport.authenticate('local', (error, user, info) => {
            if(error) {
                console.log(error);
                return next(error);
            }
            if(info) {
                return res.status(401).send(info.reason);
            }
            return req.login(user, async (error) => {  // 세션에 사용자 정보 저장(어떻게 저장?? => serializeUser)
                if(error) {
                    console.log(error);
                    return next(error);
                }
                return res.json(user);
            });
        })(req, res, next);

    } catch(error) {
        console.log(error);
        return next(error);
    }
});

// 로그인
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
        if(error) {
            console.log(error);
            return next(error);
        }
        if(info) {
            return res.status(401).send(info.reason);
        }
        return req.login(user, async (error) => {  // 세션에 사용자 정보 저장(어떻게 저장?? => serializeUser)
            if(error) {
                console.log(error);
                return next(error);
            }
            return res.json(user);
        });
    })(req, res, next);
});

// 로그아웃
router.post('/logout', isLoggedIn, (req, res) => {
    if(req.isAuthenticated()) {
        req.logout();
        req.session.destroy();  // 이 부분선택 세션삭제
        return res.status(200).send('로그아웃 되었습니다.');
    }
});

module.exports = router;