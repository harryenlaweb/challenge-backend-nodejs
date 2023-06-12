'use strict'

var express = require('express');
var seasonController = require('../controllers/SeasonController');
var api = express.Router();
var auth = require('../middlewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads'});


api.post('/create_season',[auth.auth,path],seasonController.create_season);
api.put('/update_season/:id',[auth.auth,path],seasonController.update_season);
api.put('/assign_tvshow_to_season/',auth.auth,seasonController.assign_tvshow_to_season);
api.delete('/remove_season/:id',auth.auth,seasonController.remove_season);
api.get('/list_seasons',seasonController.list_seasons);
api.get('/get_image/:img',seasonController.get_image);
api.get('/get_season/:id',auth.auth,seasonController.get_season);

module.exports = api;