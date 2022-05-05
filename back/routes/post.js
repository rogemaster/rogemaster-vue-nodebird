const express = require('express');
const { isLoggedIn } = require('./middleware');
const multer = require('multer');
const path = require('path');   // node 기본 제공
const roter = express.Router();

const upload = multer({
    // 어떻게 저장할것인지?
    // 별도 파일디렉토리 서버나 S3를 사용하기 전까지 로컬 저장 사용
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext);
            done(null, basename + Date.now() + ext);
        }
    }), 
    limit: { fileSize: 20 * 2014 * 1024 },  // 20mb로 제한
})

roter.post('/', isLoggedIn,  (req, res) => {

});

roter.post('/images', isLoggedIn, upload.array('image'), (req, res) => {
    console.log('이미지 업로드::::> ', req.files);
    res.json(req.files.map(v => v.filename));
});

module.exports = roter;