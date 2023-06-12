'use strinct'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'w1^sVl8GrC3g';

exports.auth = function(req,res,next){    
    if(!req.headers.authorization){
        return res.status(403).send({message: 'NoHeadersError'});
    }

    var token = req.headers.authorization.replace(/['"]+/g,'');

    var segment = token.split('.'); //separate the token into 3 parts

    if(segment.length != 3){
        return res.status(403).send({message: 'InvalidToken'});
    }else{
        try {
            var payload = jwt.decode(token,secret);
            if(payload.exp <= moment().unix()){
                return res.status(403).send({message: 'TokenExpired'});
            }
        } catch (error) {
            return res.status(403).send({message: 'InvalidToken'});
            
        }
    }

    req.user = payload;

    next();
}