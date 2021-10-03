'use strict';

const axios = require('axios');
const User = require('./models/User');

function powerUpSB(user, playlist_uri, volume) {
    axios.get(`http://${user.yamaha_ip}/YamahaExtendedControl/v1/main/setPower?power=on`)
        .then(function(response) {
            console.log(response.data);
            setInputSB(user, playlist_uri, volume);
        })
        .catch(function(error) {
            console.log(error);
        });
}

function setInputSB(user, playlist_uri, volume) {
    axios.get(`http://${user.yamaha_ip}/YamahaExtendedControl/v1/main/setInput?input=spotify`)
        .then(function(response) {
            console.log(response.data);
            setTimeout(() => {setVolumeSB(user, 0, () => {setVolumeSpotify(user, playlist_uri, volume)})}, 2000);
        })
        .catch(function(error) {
            console.log(error);
        });
}

function setVolumeSB(user, volume, next) {
    axios.get(`http://${user.yamaha_ip}/YamahaExtendedControl/v1/main/setVolume?volume=${volume}`)
        .then(function(response) {
            console.log('volume '+response.data.response_code);
            next();
        })
        .catch(function(error) {
            console.log(error);
        });
}

function setVolumeSpotify(user, playlist_uri, volume) {
    // axios.put("https://api.spotify.com/v1/me/player/volume", { 'volume_percent': '50' }, {headers: { 'Authorization': 'Bearer ' + user.access_token }})
    //     .then(function(response) {
    //         console.log('ok');
            playPlaylist(user, playlist_uri, volume);
        // })
        // .catch(function(error) {
        //     console.log(error);
        // });
}

function playPlaylist(user, playlist_uri, volume) {
    axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${user.yamaha_id}`, { 'context_uri': playlist_uri }, {headers: { 'Authorization': `Bearer ${user.access_token}` }})
        .then(function(response) {
            console.log(response.data);
            updateVolumeSB(user, volume);
        })
        .catch(function(error) {
            console.log(error);
        });
}

function updateVolumeSB(user, volume) {
    var id = setInterval(increaseVolumeSB, 5000);
    function increaseVolumeSB() {
        axios.get(`http://${user.yamaha_ip}/YamahaExtendedControl/v1/main/getStatus`)
            .then(function(response) {
                let cur_vol = response.data.volume;
                console.log(`current volume ${cur_vol}`);
                if( cur_vol < volume )
                    setVolumeSB(user, cur_vol+1, () => {});
                else
                    clearInterval(id);
            })
            .catch(function(error) {
                console.log(error);
                clearInterval(id);
            });
    };
}

module.exports = async function(username, playlist_uri, volume) {
    const user = await User.findOne({username: username });
    // axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${user.yamaha_id}`, { 'context_uri': playlist_uri }, {headers: { 'Authorization': `Bearer ${user.access_token}` }})
    //     .then(function(response) {
    //         console.log('ok');
    //     })
    //     .catch(function(error) {
    //         console.log(error);
    //         console.log(error.response.data.error);
    //     });
    // axios.get("https://api.spotify.com/v1/me/player/devices", {headers: { 'Authorization': 'Bearer ' + user.access_token }})
    //     .then(function(response) {
    //         console.log(response.data);
    //         console.log('ok');
    //     })
    //     .catch(function(error) {
    //         console.log(error);
    //     });
    powerUpSB(user, playlist_uri, volume);

}
