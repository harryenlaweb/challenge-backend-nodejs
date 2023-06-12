'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SeasonSchema = Schema({
    picture: {type: String, required: false},
    title: {type: String, required: true},
    number: {type: Number, required: true},
    premier_date: {type: Date, required: true},
    synopsis: {type: String, required: true},
    tvshow: {type: Schema.ObjectId, ref:'tvshow', required: false},       
    createdAt: {type:Date, default: Date.now, require: true},

});

module.exports = mongoose.model('season', SeasonSchema);