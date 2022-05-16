const passport = require('passport');
const db = require('../models');
const local = require('./local');

module.exports = () => {
    passport.serializeUser((user, done) => {
        return done(null, user.id);
    });

    passport.deserializeUser(async(id, done) => {
        try {
            const user = await db.User.findOne({ 
                where: { id },
                attributes: ['id', 'nickname'],
                include: [
                    {
                        model: db.User,
                        as: 'Followings',
                        attributes: ['id'],
                    },
                    {
                        model: db.User,
                        as: 'Followers',
                        attributes: ['id'],
                    }
                ],
            });   // 실무에서는 이 부분을 캐싱 처리를 한다. DB 접속 취소화
            return done(null, user);    //req.user, req.isAuthenticated() === true
        }catch(error) {
            console.log(error);
            return done(error);
        }
    });
    local();
}