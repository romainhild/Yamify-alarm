const mongoose = require('mongoose');

const alarm = mongoose.Schema({
    time: {type: String, required: true},
    repetition: {type: Map, of: Boolean, required: true},
    volume: {type: Number, required: true},
    playlist: {type: String, required: true},
    state: {type: Boolean, required: true},
    username: {type: String, required: true}
});

module.exports = mongoose.model("Alarm", alarm);
