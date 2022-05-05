// 로그인 검사를 미들웨어로 만들어서 일괄로 처리
// 기능마다 로그인 우뮤에 따른 처리가 존재 하므로 각 기능에 로그인 유무 확인을 매번 넣으면
// 중복이 되므로 미들웨어로 처라
exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {  // 로그인 유무 판단
        return next();  // 다음 미들웨어로 넘어가라는 의미
    }
    return res.status(401).send('로그인이 필요 합니다.');
}

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {  // 로그인 유무 판단
        return next();
    }
    return res.status(401).send('로그인한 사람은 할 수 없습니다.');
}