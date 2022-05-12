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
});

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

        if(req.body.image) {
            if(Array.isArray(req.body.image)) {
                await Promise.all(req.body.image.map((image) => {
                    return db.Image.create({ src: image, PostId: newPost.id });
                }));
            }else {
                await db.Image.create({
                    src: req.body.image,
                    PostId: newPost.id
                });
            }
        }
        // include: 관계들을 자동으로 포함해 주는 기능
        // attributes 속성으로 원하는 데이터만 가져올수 있음
        const fullPost = await db.Post.findOne({
            where: { id: newPost.id },
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'nickname'],
                },
                {
                    model: db.User,
                    as: 'Likers',
                    attributes: ['id'],
                },
                {
                    model: db.Image,
                }
            ],
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
        const comments = await db.Comment.findAll({
            where: {
                PostId: req.params.id,
            },
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'nickname'],
                },
                {
                    model: db.Image,
                }
            ],
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

router.patch('/:id', async (req, res, next) => {
    try {
        await db.Post.patch({
            where: {
                id: req.params.id,
            }
        });

        return res.send('');

    } catch (error) {
        console.error(error);
        next(error);
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        await db.Post.destroy({
            where: {
                id: req.params.id,
            }
        });

        return res.send('삭제하였습니다.');

    }catch(error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id/retweet', async (req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: { id: req.params.id },
            include: [{
                model: db.Post,
                as: 'Retweet',
            }],
        });

        if(!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }

        if(req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
            return res.status(403), send('자신의 글을 리트윗할 수 없습니다.');
        }
        
        const retweetTargetId = post.RetweetId || post.id;
        const exPost = await db.Post.findOne({
            where: {
                UserId: req.user.id,
                RetweetId: retweetTargetId,
            },
        });

        if(exPost) {
            return res.status(403).send('이미 리트윗했습니다.');
        }

        const retweet = await db.Post.create({
            UserId : req.user.id,
            RetweetId: retweetTargetId, // 원본 아이디
            content: 'retweet',
        });

        const retweetWithPrevPost = await db.Post.findOne({
            // include가 많아 지면 많아질수록 db에 무리가 가는 쿼리가 짜여 지므로
            // 이런 경우에는 직접 쿼리를 구현하는게 좋음
            where: { id: retweet.id },
            include: [
                {
                    model: db.User,
                    attributes: [ 'id', 'nickname' ],
                },
                {
                    model: db.User,
                    as: 'Likers',
                    attributes: ['id'],
                },
                {
                    model: db.Post,
                    as: 'Retweet',
                    include: [
                        {
                            model: db.User,
                            attributes: [ 'id', 'nickname' ],
                        },
                        {
                            model: db.Image,
                        }
                    ],
                },
            ],
        });

        return res.json(retweetWithPrevPost);

    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id/like', async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id }});
        
        if(!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }

        await post.addLiker(req.user.id);

        return res.json({ userId: req.user.id });

    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:id/like', async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id }});
        
        if(!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }

        await post.removeLiker(req.user.id);

        return res.json({ userId: req.user.id });
        
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;