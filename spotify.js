'use strict';

const axios = require('axios');

function refresh(user, next) {
    let options = {
        url: 'https://accounts.spotify.com/api/token',
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64')
        },
        params: {
            grant_type: 'refresh_token',
            refresh_token: user.refresh_token
        }
    };
    axios(options)
        .then(async function(response) {
            user.access_token = response.data.access_token;
            await user.save();
            next(user);
        })
        .catch(function(error) {
            console.log(error.response.data.error);
        });
}

function playlist(user, next) {
    let options = {
        url: 'https://api.spotify.com/v1/me/playlists?limit=50',
        headers: { 'Authorization': 'Bearer ' + user.access_token },
    };
    axios(options)
        .then(function(response) {
            next(response.status, response.data.items);
        })
        .catch(function(error) {
            let errorData = error.response.data.error;
            if( errorData.status == 401 && errorData.message == 'The access token expired' ) {
                refresh(user, (u) => { playlist(u, next) });
            } else {
                next(error.response.data.error.status, error.response.data.error.message);
            }
        });
}
module.exports.playlist = playlist;

function devices(user, next) {
    let options = {
        url: 'https://api.spotify.com/v1/me/player/devices',
        headers: { 'Authorization': 'Bearer ' + user.access_token },
    };
    axios(options)
        .then(function(response) {
            next(response.status, response.data.items);
        })
        .catch(function(error) {
            let errorData = error.response.data.error;
            if( errorData.status == 401 && errorData.message == 'The access token expired' ) {
                refresh(user, (u) => { playlist(u, next) });
            } else {
                next(error.response.data.error.status, error.response.data.error.message);
            }
        });
}
module.exports.devices = devices;

function play(user, playlist_uri, volume, next) {
    axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${user.yamaha_id}`,
              { 'context_uri': playlist_uri },
              {headers: { 'Authorization': `Bearer ${user.access_token}` }})
        .then(function(response) {
            next();
        })
        .catch(function(error) {
            if( errorData.status == 401 && errorData.message == 'The access token expired' ) {
                refresh(user, (u) => { play(u, playlist_uri, volume, next) });
            } else {
                console.log(error);
            }
        });
}
module.exports.play = play;
