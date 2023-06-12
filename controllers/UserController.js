'use strict'

var User = require('../models/user');

var bcrypt = require('bcrypt-nodejs'); //we have to encrypt the password
var jwt = require('../helpers/jwt');

const register = async function(req,res){
    
    var data = req.body;    

    //let's check if the email exists
    var users_arr = [];
    var user_arr = await User.find({email:data.email});

    if (user_arr.length == 0){        
        //first we check if you send me a password
        if(data.password){
            bcrypt.hash(data.password,null,null, async function(err,hash){
                if(hash){    
                    data.password = hash;
                    var reg = await User.create(data);                
                    res.status(200).send({data:reg});
                }else{
                    res.status(200).send({message:'Error Server', data:undefined});            
                }
            })
        }else{
            res.status(200).send({message:'there is no password', data:undefined});    
        }

        
    }else{
        res.status(200).send({message:'The email already exists in the database', data:undefined});
    }
}

const login = async function(req,res){
    var data = req.body;    
    var user_arr = []; //I have to verify that the email does not exist in the database

    user_arr = await User.find({email:data.email});

    if (user_arr.length == 0){
        res.status(200).send({message: 'Mail not found', data: undefined});
    }else{
        //LOGIN
        let user = user_arr[0];

        bcrypt.compare(data.password,user.password, async function(error,check){
            if(check){
                res.status(200).send({
                    data:user,
                    token: jwt.createToken(user)
                });
            }else{
                res.status(200).send({message: 'Password does not match', data: undefined});
            }
        });        
    }    
}


module.exports = {
    register,
    login
}