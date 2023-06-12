'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EpisodeSchema = Schema({
    picture: {type: String, required: false},
    title: {type: String, required: true},
    number: {type: Number, required: true},
    date: {type: Date, required: true},
    synopsis: {type: String, required: true},
    duration: {type: Number, required: true},
    director: {type: Schema.ObjectId, ref:'director', required: false},
    actors: [{type: Schema.ObjectId, ref:'actor', required: false},],  
    season: {type: Schema.ObjectId, ref:'season', required: false},       
    createdAt: {type:Date, default: Date.now, require: true},
});

module.exports = mongoose.model('episode', EpisodeSchema);