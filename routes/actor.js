'use strict'

var express = require('express');
var actorController = require('../controllers/ActorController');
var api = express.Router();
var auth = require('../middlewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads'});


api.post('/create_actor',[auth.auth,path],actorController.create_actor);
api.put('/update_actor/:id',[auth.auth,path],actorController.update_actor);
api.delete('/remove_actor/:id',auth.auth,actorController.remove_actor);
api.get('/list_actors',actorController.list_actors);
api.get('/get_image/:img',actorController.get_image);
api.get('/get_actor/:id',auth.auth,actorController.get_actor);

module.exports = api;