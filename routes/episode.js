'use strict'

var express = require('express');
var episodeController = require('../controllers/EpisodeController');
var api = express.Router();
var auth = require('../middlewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads'});


api.post('/create_episode',[auth.auth,path],episodeController.create_episode);
api.put('/update_episode/:id',[auth.auth,path],episodeController.update_episode);
api.delete('/remove_episode/:id',auth.auth,episodeController.remove_episode);
api.put('/assign_season_to_episode/',auth.auth,episodeController.assign_season_to_episode);
api.put('/assign_director_to_episode/',auth.auth,episodeController.assign_director_to_episode);
api.put('/assign_actor_to_episode/',auth.auth,episodeController.assign_actor_to_episode);
api.get('/list_episodes',episodeController.list_episodes);
api.get('/get_image/:img',episodeController.get_image);
api.get('/get_episode/:id',auth.auth,episodeController.get_episode);

module.exports = api;