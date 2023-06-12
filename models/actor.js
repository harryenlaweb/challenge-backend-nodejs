'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActorSchema = Schema({
    picture: {type: String, required: false},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    country: {type: String, required: true},
    gender: {type: String, required: true},
    birth: {type: String, required: true},        
    createdAt: {type:Date, default: Date.now, require: false},

});

module.exports = mongoose.model('actor', ActorSchema);