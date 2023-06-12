'use strict'

var express = require('express');
var tvshowController = require('../controllers/TvshowController');
var api = express.Router();
var auth = require('../middlewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads'});


api.post('/create_tvshow',[auth.auth,path],tvshowController.create_tvshow);
api.put('/update_tvshow/:id',[auth.auth,path],tvshowController.update_tvshow);
api.delete('/remove_tvshow/:id',auth.auth,tvshowController.remove_tvshow);
api.get('/list_tvshows',tvshowController.list_tvshows);
api.get('/list_tvshows_filter/:filter?',auth.auth,tvshowController.list_tvshows_filter);
api.get('/get_image/:img',tvshowController.get_image);
api.get('/get_tvshow/:id',auth.auth,tvshowController.get_tvshow);

module.exports = api;