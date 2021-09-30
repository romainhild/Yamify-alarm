'use strict';

const router = require('express').Router();
const crypto = require('crypto');
const User = require('../models/User');

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
	res.render('index');
    })
;

module.exports = router;
