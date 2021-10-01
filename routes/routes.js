'use strict';

const router = require('express').Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router
    .get('/', (req, res) => {
        if( !req.cookies.jwt ) {
            res.redirect('/login');
            return;
        }
        let payload
        try{
            payload = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
            res.render('index');
        }
        catch(e){
            // if(e.name == TokenExpiredError)
            console.log(e.message);
            res.redirect('/login');
            return;
        }
    })
    .get('/login', (req, res) => {
        res.render('login');
    })
    .post('/login', async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            let sha = crypto.createHash('sha3-256');
            sha.update(req.body.password).update(user.salt);
            let pwd = sha.digest('hex');
            if( pwd != user.password ) {
                console.log("bad password");
                res.render('login');
                return;
            }

            let payload = {username: req.body.username};
            let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                algorithm: "HS256",
                expiresIn: process.env.ACCESS_TOKEN_LIFE
            });
            let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
                algorithm: "HS256",
                expiresIn: process.env.REFRESH_TOKEN_LIFE
            });
            user.token = refreshToken;
            await user.save();
            res.cookie("jwt", accessToken, {secure: true, httpOnly: true})
            res.redirect('/');
        } catch {
            console.log("error");
            res.render('login');
        }
    })
;

module.exports = router;
