'use strict'

var Season = require('../models/season');
var Tvshow = require('../models/tvshow');
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs'); //we have to encrypt the password
var jwt = require('../helpers/jwt');

const create_season = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){
            let data = req.body;                 
            var img_path = req.files.picture.path;            
            var name = img_path.split('/');
            var picture_name = name[1];              
            data.picture = picture_name;            
            
            let reg = await Season.create(data);

            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const update_season = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){
            let id = req.params['id'];
            let data = req.body;              
            
            if(req.files){
                //IF THERE IS PICTURE
                var img_path = req.files.picture.path;
                var name = img_path.split('/');
                var picture_name = name[1];
                
                let reg = await Season.findByIdAndUpdate({_id:id},{
                    title: data.title,
                    number: data.number,
                    premier_date: data.premier_date,
                    synopsis: data.synopsis,
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
                let reg = await Season.findByIdAndUpdate({_id:id},{
                    title: data.title,
                    number: data.number,
                    premier_date: data.premier_date,
                    synopsis: data.synopsis,                    
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

const assign_tvshow_to_season = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){            
            let data = req.body;  
                          
            let reg = await Season.findByIdAndUpdate({_id:data.id_season},{
                tvshow: data.id_tvshow,                
            });
            res.status(200).send({data:reg});
                      

        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }

}

const remove_season = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){        
            var id = req.params['id'];            
            let reg = await Season.findByIdAndRemove({_id:id});
            res.status(200).send({data:reg});
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const list_seasons = async function(req,res){    
    let reg = await Season.find({});
    res.status(200).send({data:reg});
}

const list_seasons_filter = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){            
            var filter = req.params['filter'];
            let reg = await Season.find({titulo: new RegExp(filter, 'i')});
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

const get_season = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){            
            var id = req.params['id'];
            try {
                var reg = await Season.findById({_id:id});
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
    create_season,
    update_season,
    remove_season,
    list_seasons,
    list_seasons_filter,
    get_image,
    get_season,
    assign_tvshow_to_season
}