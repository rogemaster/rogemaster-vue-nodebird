const express = require('express');
const { isLoggedIn } = require('./middleware');
const multer = require('multer');
const path = require('path');   // node 기본 제공
const db = require('../models');
const router = express.Router();

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

router.post('/', isLoggedIn,  async (req, res, next) => {
    try{
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        const newPost = await db.Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });
        if(hashtags) {
            // findOrCreate: db에 있으면 저장하지 말고 없는 경우에만 저장 해라
            // await 을 붙이지 않고 map을 사용 하면 Promise가 배열로 됨. 그러므로 Promise.all을 사용해야 함.
            const result = Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
                where: {
                    name: tag.slice(1).toLowerCase(),
                }
            })));
            await newPost.addHashtags(result.map(r => r[0]));
        }
        // include: 관계들을 자동으로 포함해 주는 기능
        // attributes 속성으로 원하는 데이터만 가져올수 있음
        const fullPost = await db.Post.findOne({
            where: { id: newPost.id },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }],
        });

        return res.json(fullPost);

    }catch(error) {
        console.log(error);
        next(error);
    }
});

router.post('/images', isLoggedIn, upload.array('image'), (req, res) => {
    console.log('이미지 업로드::::> ', req.files);
    res.json(req.files.map(v => v.filename));
});

router.get('/:id/comments', async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id }});
        if(!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        const comments = await db.findAll({
            where: {
                PostId: req.params.id,
            },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }],
            order: [['createdAt', 'ASE']],
        });

        return res.json(comments);

    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id/comment', isLoggedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if(!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        const newComment = await db.Comment.create({
            PostId: post.id,
            UserId: req.user.id,
            contnet: req.body.content,
        });
        const comment = await db.Comment.findOne({
            where: { id: newComment.id },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }],
        });

        return res.json(comment);

    } catch(error) {
        next(error);
    }
});

module.exports = router;