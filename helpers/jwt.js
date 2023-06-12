'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'w1^sVl8GrC3g';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(30,'minutes').unix()
    }

    return jwt.encode(payload,secret);
}