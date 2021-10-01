'use strict';

const router = require('express').Router();
const crypto = require('crypto');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router
    // .get('/user', async (req, res) => {
    // 	const users = await User.find();
    // 	res.send(users);
    // })
    // .delete('/user/:id', async (req, res) => {
    // 	try {
    // 	    await User.deleteOne({ _id: req.params.id });
    // 	    res.sendStatus(204);
    // 	} catch {
    // 	    res.status(204).send({error: "User doesn't exist!" });
    // 	}
    // })
    // .get('/create_user', (req, res) => {
    // 	res.render('create_user');
    // })
    // .post('/user', async (req, res) => {
    // 	let salt = crypto.randomBytes(256).toString('hex');
    // 	let sha = crypto.createHash('sha3-256');
    // 	sha.update(req.body.password).update(salt);
    // 	let pwd = sha.digest('hex');
    // 	try {
    // 	    const user = new User({
    // 		username: req.body.username,
    // 		password: pwd,
    // 		salt: salt
    // 	    });
    // 	    await user.save();
    // 	    res.redirect('/');
    // 	} catch {
    // 	    res.status(401).redirect('/create_user');
    // 	}
    // })
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
	    console.log('not verified');
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
