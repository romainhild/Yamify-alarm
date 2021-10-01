'use strict;'

const jwt = require('jsonwebtoken');

module.exports.verify = function(req, res, next) {
    if(!req.cookies.jwt)
        return res.status(403).send('Token needed');
    try
    {
        let payload = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
        res.locals.username = payload.username;
        next();
    }
    catch(e){
        return res.status(403).send('Token invalid: '+e.message);
    }
}
