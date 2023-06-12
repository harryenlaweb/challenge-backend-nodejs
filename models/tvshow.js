'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TvshowSchema = Schema({
    picture: {type: String, required: false},
    title: {type: String, required: true},    
    genre: {type: String, required: true},
    release_year: {type: Number, required: true},
    synopsis: {type: String, required: true},
    language: {type: String, required: true}, 
    country_of_origin: {type: String, required: true},           
    createdAt: {type:Date, default: Date.now, require: true},

});

module.exports = mongoose.model('tvshow', TvshowSchema);