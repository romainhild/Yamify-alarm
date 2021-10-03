const mongoose = require('mongoose');

const user = mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    salt: {type: String, required: true},
    token: {type: String, default: ""},
    name: {type: String, default: ""},
    access_token: {type: String, default: ""},
    refresh_token: {type: String, default: ""},
    yamaha_ip: {type: String, default: ""},
    yamaha_id: {type: String, default: ""}
});

module.exports = mongoose.model("User", user);
