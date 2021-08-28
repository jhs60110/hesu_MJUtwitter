
const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = req.user ? req.user.Followers.length : 0;
    res.locals.followingCount = req.user ? req.user.Followings.length : 0;
    res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
    next();
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { title: '내 정보 - 60181643 서해수 기말' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', { title: '회원가입 - 60181643 서해수 기말' });
});

router.get('/', async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['createdAt', 'ASC']],
        });
        res.render('main', {
            title: '60181643 서해수 기말',
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }

    router.route('/:id/post')
        .patch(async (req, res, next) => { //수정버튼
            try {
                const result = await Post.update({ //해당되는 id로 찾아가서 업데이트
                    post: req.body.post,
                }, {
                    where: { id: req.params.id },
                });
                res.json(result);
            } catch (err) {
                console.error(err);
                next(err);
            }
        })
        .delete(async (req, res, next) => {
            try {
                const result = await Post.destroy({ where: { id: req.params.id } });
                res.json(result);
            } catch (err) {
                console.error(err);
                next(err);
            }
        });
});


module.exports = router;