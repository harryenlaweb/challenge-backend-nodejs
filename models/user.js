'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    first_name: {type: String, required: false},
    last_name: {type: String, required: false},
    email: {type: String, required: true},
    password: {type: String, required: true},    
    phone: {type: String, required: false},    
    role: {type: String, required: false},//admin|viewer
    dni: {type: String, required: false},

});

module.exports = mongoose.model('user', UserSchema);