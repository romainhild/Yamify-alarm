'use strict';

const router = require('express').Router();
const User = require('../models/User');
const {verify} = require('../auth');

router.use(verify);
router
    .get('/', async (req, res) => {
        const users = await User.find({username: res.locals.username});
        res.send(users);
    })
    .patch('/', async (req, res) => {
        try {
            const user = await User.findOne({ username: res.locals.username });
            if( req.body.username )
                user.username = req.body.username;
            if( req.body.password )
                user.password = req.body.password;
            if( req.body.token )
                user.token = req.body.token;
            if( req.body.name )
                user.name = req.body.name;
            if( req.body.access_token )
                user.access_token = req.body.access_token;
            if( req.body.refresh_token )
                user.refresh_token = req.body.refresh_token;
            if( req.body.yamaha_ip )
                user.yamaha_ip = req.body.yamaha_ip;

            await user.save();
            res.send(user);
        } catch(e) {
            res.status(404).send({ error: "User doesn't exist!", message: e.message });
        }
    })
    // .eelete('/', async (req, res) => {
    //     try {
    //         await User.deleteOne({ username: res.locals.username });
    //         res.sendStatus(204);
    //     } catch {
    //         res.status(204).send({error: "User doesn't exist!" });
    //     }
    // })
    // .post('/', async (req, res) => {
    //     let salt = crypto.randomBytes(256).toString('hex');
    //     let sha = crypto.createHash('sha3-256');
    //     sha.update(req.body.password).update(salt);
    //     let pwd = sha.digest('hex');
    //     try {
    //         const user = new User({
    //             username: req.body.username,
    //             password: pwd,
    //             salt: salt
    //         });
    //         await user.save();
    //         res.redirect('/');
    //     } catch {
    //         res.status(401).redirect('/create_user');
    //     }
    // })
    // .get('/create', (req, res) => {
    //     res.render('create_user');
    // })
;

module.exports = router;
