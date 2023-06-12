'use strict'

var Movie = require('../models/movie');
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs'); //we have to encrypt the password
var jwt = require('../helpers/jwt');

const create_movie = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){
            let data = req.body;                 
            var img_path = req.files.picture.path;            
            var name = img_path.split('/');
            var picture_name = name[1];              
            data.picture = picture_name;            
            
            let reg = await Movie.create(data);

            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const update_movie = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){
            let id = req.params['id'];
            let data = req.body;              
            
            if(req.files){
                //IF THERE IS PICTURE
                var img_path = req.files.picture.path;
                var name = img_path.split('/');
                var picture_name = name[1];
                
                let reg = await Movie.findByIdAndUpdate({_id:id},{
                    title: data.title,
                    genre: data.genre,
                    release_year: data.release_year,
                    synopsis: data.synopsis,                    
                    duration: data.duration,                    
                    picture: picture_name,
                });

                fs.stat('./uploads/'+reg.picture, function(err){
                    if(!err){
                        fs.unlink('./uploads/'+reg.picture, (err)=>{
                            if(err) throw err;
                        });
                    }
                })

                res.status(200).send({data:reg});
                
            }else{
                //THERE IS NO IMAGE
                let reg = await Movie.findByIdAndUpdate({_id:id},{
                    title: data.title,
                    genre: data.genre,
                    release_year: data.release_year,
                    synopsis: data.synopsis,                    
                    duration: data.duration                    
                });
                res.status(200).send({data:reg});
            }            

        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }

}

const remove_movie = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){        
            var id = req.params['id'];            
            let reg = await Movie.findByIdAndRemove({_id:id});
            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const remove_director_to_movie = async function(req, res) {
    if (req.user) {
      if (req.user.role === 'admin') {
        let data = req.body;
  
        let movie = await Movie.findById(data.id_movie);
  
        if (!movie) {
          res.status(404).send({ message: 'Movie not found' });
          return;
        }
  
        movie.director = null;
        let reg = await movie.save();
  
        res.status(200).send({ data: reg });
      } else {
        res.status(500).send({ message: 'NoAccess' });
      }
    } else {
      res.status(500).send({ message: 'NoAccess' });
    }
  };

  const remove_actor_to_movie = async function(req, res) {
    if (req.user) {
      if (req.user.role === 'admin') {
        let data = req.body;
  
        let movie = await Movie.findById(data.id_movie);
  
        if (!movie) {
          res.status(404).send({ message: 'Movie not found' });
          return;
        }
  
        const actorIndex = movie.actors.indexOf(data.id_actor);
        if (actorIndex === -1) {
          res.status(400).send({ message: 'Actor is not assigned to the movie' });
          return;
        }
  
        movie.actors.splice(actorIndex, 1);
        let reg = await movie.save();
  
        res.status(200).send({ data: reg });
      } else {
        res.status(500).send({ message: 'NoAccess' });
      }
    } else {
      res.status(500).send({ message: 'NoAccess' });
    }
  };
  
  

const assign_director_to_movie = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){            
            let data = req.body;  
                          
            let reg = await Movie.findByIdAndUpdate({_id:data.id_movie},{
                director: data.id_director,                
            });
            res.status(200).send({data:reg});
                      

        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }

}

const assign_actor_to_movie = async function(req, res) {
    if (req.user) {
      if (req.user.role === 'admin') {
        let data = req.body;
  
        let movie = await Movie.findById(data.id_movie);
  
        if (!movie) {
          res.status(404).send({ message: 'Movie not found' });
          return;
        }
  
        if (movie.actors.includes(data.id_actor)) {
          res.status(400).send({ message: 'Actor already assigned to the movie' });
          return;
        }
  
        movie.actors.push(data.id_actor);
        let reg = await movie.save();
  
        res.status(200).send({ data: reg });
      } else {
        res.status(500).send({ message: 'NoAccess' });
      }
    } else {
      res.status(500).send({ message: 'NoAccess' });
    }
};

const list_movies = async function(req,res){    
    let reg = await Movie.find({});
    res.status(200).send({data:reg});
}

const list_movies_filter = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){            
            var filter = req.params['filter'];
            let reg = await Movie.find({titulo: new RegExp(filter, 'i')});
            res.status(200).send({data: reg});
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const get_image = async function(req,res){
    var img = req.params['img'];
    
    fs.stat('./uploads/'+img, function(err){
        if(!err){
            let path_img = './uploads/'+img;
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
}

const get_movie = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){            
            var id = req.params['id'];
            try {
                var reg = await Movie.findById({_id:id}).populate('director');
                res.status(200).send({data:reg});
            } catch (error) {
                res.status(200).send({data:undefined});
            }            
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const get_director_movie = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){            
            var id = req.params['id'];
            try {
                var reg = await Movie.findById({_id:id}).populate('director');
                res.status(200).send({data:reg.director});
            } catch (error) {
                res.status(200).send({data:undefined});
            }            
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const get_actors_movie = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){            
            var id = req.params['id'];
            try {
                var reg = await Movie.findById({_id:id}).populate('actors');
                res.status(200).send({data:reg.actors});
            } catch (error) {
                res.status(200).send({data:undefined});
            }            
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}
  

module.exports = {
    create_movie,
    update_movie,
    remove_movie,
    remove_director_to_movie,
    remove_actor_to_movie,
    assign_director_to_movie,
    assign_actor_to_movie,
    list_movies,
    list_movies_filter,
    get_image,
    get_movie,    
    get_director_movie,
    get_actors_movie,
}