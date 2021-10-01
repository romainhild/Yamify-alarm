const mongoose = require('mongoose');

const alarm = mongoose.Schema({
    time: {type: String, required: true},
    repetition: {type: Map, of: Boolean, required: true},
    volume: {type: Number, required: true},
    playlist_id: {type: String, required: true},
    playlist_name: {type: String, required: true},
    playlist_uri: {type: String, required: true},
    state: {type: Boolean, required: true},
    username: {type: String, required: true}
});

module.exports = mongoose.model("Alarm", alarm);
