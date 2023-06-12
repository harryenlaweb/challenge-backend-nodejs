'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 4201;

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: '*' }
});



const actor_route = require('./routes/actor');
const user_route = require('./routes/user');
const director_route = require('./routes/director');
const episode_route = require('./routes/episode');
const movie_route = require('./routes/movie');
const season_route = require('./routes/season');
const tvshow_route = require('./routes/tvshow');

mongoose.connect('mongodb://127.0.0.1:27017/challenge', { useUnifiedTopology: true, useNewUrlParser: true }, (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log('server running');
    server.listen(port, function () {
      console.log('Server running on the port ' + port);
    });
  }
});

app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
  next();
});

app.use('/api', actor_route);
app.use('/api', user_route);
app.use('/api', director_route);
app.use('/api', episode_route);
app.use('/api', movie_route);
app.use('/api', season_route);
app.use('/api', tvshow_route);

module.exports = app;
