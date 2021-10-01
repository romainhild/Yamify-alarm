'use strict';

const router = require('express').Router();
const crypto = require('crypto');
const axios = require('axios');
const User = require('../models/User');
const {verify} = require('../auth');

router.use(verify);

var stateKey = 'spotify_auth_state';

router
    .get('/login', (req, res) => {
        var state = crypto.randomBytes(16).toString('hex');
        res.cookie(stateKey, state);

        var scope = 'playlist-read-private user-read-playback-state user-modify-playback-state';
        let params = new URLSearchParams({
            response_type: 'code',
            client_id: process.env.SPOTIFY_ID,
            scope: scope,
            redirect_uri: process.env.SPOTIFY_URL,
            state: state
        });
        res.redirect('https://accounts.spotify.com/authorize?' +
                     params.toString());
    })
    .get('/logout', async (req, res) => {
        try {
            const user = await User.findOne({ username: res.locals.username });
            user.name = "";
            user.access_token = "";
            user.refresh_token = "";
                            
            await user.save();
            res.redirect('/');
        } catch(e) {
            res.status(404).send({ error: "User doesn't exist!", message: e.message });
        }
    })
    .get('/', (req, res) => {
        var code = req.query.code || null;
        var state = req.query.state || null;
        var storedState = req.cookies ? req.cookies[stateKey] : null;
        if (state === null || state !== storedState) {
            res.redirect('/');
        } else {
            res.clearCookie(stateKey);
            let options = {
                url: 'https://accounts.spotify.com/api/token',
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64')
                },
                params: {
                    code: code,
                    redirect_uri: process.env.SPOTIFY_URL,
                    grant_type: 'authorization_code'
                }
            };
            axios(options)
                .then(function(response) {
                    let access_token = response.data.access_token;
                    let refresh_token = response.data.refresh_token;
                    options = {
                        url: 'https://api.spotify.com/v1/me',
                        headers: { 'Authorization': 'Bearer ' + access_token },
                    };
                    axios(options)
                        .then(async function(response) {
                            try {
                                const user = await User.findOne({ username: res.locals.username });
                                user.name = response.data.display_name;
                                user.access_token = access_token;
                                user.refresh_token = refresh_token;
                            
                                await user.save();
                        
                                res.redirect('/');
                            } catch(e) {
                                res.status(404).send({ error: "User doesn't exist!", message: e.message });
                            }
                        })
                        .catch(function(error) {
                            console.log(error);
                            res.redirect('/');
                        });
                })
                .catch(function(error) {
                    console.log("error");
                    console.log(error);
                    res.redirect('/');
                });
        }
    })
    .get('/playlist', async (req, res) => {
        let user;
        try {
            user = await User.findOne({ username: res.locals.username });
        } catch(e) {
            res.status(404).send({ error: "User doesn't exist!", message: e.message });
        }
        let options = {
            url: 'https://api.spotify.com/v1/me/playlists?limit=50',
            headers: { 'Authorization': 'Bearer ' + user.access_token },
        };
        axios(options)
            .then(function(response) {
                res.send(response.data.items);
            })
            .catch(function(error) {
                console.log(error);
                res.status(500).send(error);
            });
    })
;

module.exports = router;
