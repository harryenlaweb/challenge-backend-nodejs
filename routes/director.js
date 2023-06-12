'use strict'

var express = require('express');
var directorController = require('../controllers/DirectorController');
var api = express.Router();
var auth = require('../middlewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads'});


api.post('/create_director',[auth.auth,path],directorController.create_director);
api.put('/update_director/:id',[auth.auth,path],directorController.update_director);
api.delete('/remove_director/:id',auth.auth,directorController.remove_director);
api.get('/list_directors',directorController.list_directors);
api.get('/get_image/:img',directorController.get_image);
api.get('/get_director/:id',auth.auth,directorController.get_director);

module.exports = api;