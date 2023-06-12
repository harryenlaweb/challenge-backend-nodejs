'use strict'

var express = require('express');
var movieController = require('../controllers/MovieController');
var api = express.Router();
var auth = require('../middlewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads'});


api.post('/create_movie',[auth.auth,path],movieController.create_movie);
api.put('/update_movie/:id',[auth.auth,path],movieController.update_movie);
api.delete('/remove_movie/:id',auth.auth,movieController.remove_movie);
api.put('/assign_director_to_movie/',auth.auth,movieController.assign_director_to_movie);
api.put('/assign_actor_to_movie/',auth.auth,movieController.assign_actor_to_movie);
api.put('/remove_director_to_movie/',auth.auth,movieController.remove_director_to_movie);
api.put('/remove_actor_to_movie/',auth.auth,movieController.remove_actor_to_movie);
api.get('/list_movies',movieController.list_movies);
api.get('/get_image/:img',movieController.get_image);
api.get('/get_movie/:id',auth.auth,movieController.get_movie);
api.get('/get_director_movie/:id',auth.auth,movieController.get_director_movie);
api.get('/get_actors_movie/:id',auth.auth,movieController.get_actors_movie);

module.exports = api;