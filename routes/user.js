'use strict'

var express = require('express');
var userController = require('../controllers/UserController');
var auth = require('../middlewares/authenticate');
var api = express.Router();

api.post('/register',userController.register);
api.post('/login',userController.login);

module.exports = api;