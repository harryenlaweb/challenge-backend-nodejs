'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = Schema({
    picture: {type: String, required: false},
    title: {type: String, required: true},    
    genre: {type: String, required: true},
    release_year: {type: Number, required: true},
    synopsis: {type: String, required: true},
    duration: {type: Number, required: true},
    director: {type: Schema.ObjectId, ref:'director', required: false},
    actors: [{type: Schema.ObjectId, ref:'actor', required: false},],         
    createdAt: {type:Date, default: Date.now, require: true},
});

module.exports = mongoose.model('movie', MovieSchema);