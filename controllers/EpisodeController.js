'use strict'

var Episode = require('../models/episode');
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs'); //we have to encrypt the password
var jwt = require('../helpers/jwt');

const create_episode = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){
            let data = req.body;                 
            var img_path = req.files.picture.path;            
            var name = img_path.split('/');
            var picture_name = name[1];              
            data.picture = picture_name;            
            
            let reg = await Episode.create(data);

            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const update_episode = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){
            let id = req.params['id'];
            let data = req.body;              
            
            if(req.files){
                //IF THERE IS PICTURE
                var img_path = req.files.picture.path;
                var name = img_path.split('/');
                var picture_name = name[1];
                
                let reg = await Episode.findByIdAndUpdate({_id:id},{
                    title: data.title,
                    number: data.number,
                    date: data.date,
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
                let reg = await Episode.findByIdAndUpdate({_id:id},{
                    title: data.title,
                    number: data.number,
                    date: data.date,
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

const remove_episode = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){        
            var id = req.params['id'];            
            let reg = await Episode.findByIdAndRemove({_id:id});
            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const assign_season_to_episode = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){            
            let data = req.body;  
                          
            let reg = await Episode.findByIdAndUpdate({_id:data.id_episode},{
                season: data.id_season,                
            });
            res.status(200).send({data:reg});
                      

        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }

}

const assign_director_to_episode = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){            
            let data = req.body;  
                          
            let reg = await Episode.findByIdAndUpdate({_id:data.id_episode},{
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

const assign_actor_to_episode = async function(req, res) {
    if (req.user) {
      if (req.user.role === 'admin') {
        let data = req.body;
  
        let episode = await Episode.findById(data.id_episode);
  
        if (!episode) {
          res.status(404).send({ message: 'Episode not found' });
          return;
        }
  
        if (episode.actors.includes(data.id_actor)) {
          res.status(400).send({ message: 'Actor already assigned to the episode' });
          return;
        }
  
        episode.actors.push(data.id_actor);
        let reg = await episode.save();
  
        res.status(200).send({ data: reg });
      } else {
        res.status(500).send({ message: 'NoAccess' });
      }
    } else {
      res.status(500).send({ message: 'NoAccess' });
    }
};
  

const list_episodes = async function(req,res){    
    let reg = await Episode.find({});
    res.status(200).send({data:reg});
}

const list_episodes_filter = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){            
            var filter = req.params['filter'];
            let reg = await Episode.find({titulo: new RegExp(filter, 'i')});
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

const get_episode = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){            
            var id = req.params['id'];
            try {
                var reg = await Episode.findById({_id:id});
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
    create_episode,
    update_episode,
    remove_episode,
    assign_season_to_episode,
    assign_director_to_episode,
    assign_actor_to_episode,
    list_episodes,
    list_episodes_filter,
    get_image,
    get_episode
}