'use strict'

var Actor = require('../models/actor');
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs'); //we have to encrypt the password
var jwt = require('../helpers/jwt');

const create_actor = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){
            let data = req.body;                 
            var img_path = req.files.picture.path;            
            var name = img_path.split('/');
            var picture_name = name[1];              
            data.picture = picture_name;            
            
            let reg = await Actor.create(data);

            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const update_actor = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){
            let id = req.params['id'];
            let data = req.body;              
            
            if(req.files){
                //IF THERE IS PICTURE
                var img_path = req.files.picture.path;
                var name = img_path.split('/');
                var picture_name = name[1];
                
                let reg = await Actor.findByIdAndUpdate({_id:id},{
                    first_name: data.first_name,
                    last_name: data.last_name,
                    country: data.country,
                    gender: data.gender,                    
                    birth: data.birth,                    
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
                let reg = await Actor.findByIdAndUpdate({_id:id},{
                    first_name: data.first_name,
                    last_name: data.last_name,
                    country: data.country,
                    gender: data.gender,                    
                    birth: data.birth                    
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

const remove_actor = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){        
            var id = req.params['id'];            
            let reg = await Actor.findByIdAndRemove({_id:id});
            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const assign_movie_to_actor = async function(req, res) {
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

const list_actors = async function(req,res){    
    let reg = await Actor.find({});
    res.status(200).send({data:reg});
}

const list_actors_filter = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){            
            var filter = req.params['filter'];
            let reg = await Actor.find({titulo: new RegExp(filter, 'i')});
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

const get_actor = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){            
            var id = req.params['id'];
            try {
                var reg = await Actor.findById({_id:id});
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

module.exports = {
    create_actor,
    update_actor,
    remove_actor,
    list_actors,
    list_actors_filter,
    get_image,
    get_actor
}