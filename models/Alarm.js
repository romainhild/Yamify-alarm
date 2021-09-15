const mongoose = require('mongoose');

const alarm = mongoose.Schema({
    time: String, // Date,
    repetition: [Boolean],
    volume: Number,
    playlist: String,
    state: Boolean
});

module.exports = mongoose.model("Alarm", alarm);
