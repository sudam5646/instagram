const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/key');
const requireLogin = require('../middleware/requireLogin')

router.get('/protected',requireLogin, (req,res) => {
    res.send("hello")
})

router.post('/signup', (req,res) =>{
    const {name,email,password,pic} = req.body

    if(!name || !email || !password){
       return res.status(422).json({error:"please add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser => {
        if(savedUser){
            return res.status(422).send({error:"user already exist"})
        }
        else{
            bcrypt.hash(password,12)
            .then(hashedpassword =>{
                const user = new User({
                    email,
                    password:hashedpassword,
                    name,
                    pic
                })
                user.save()
                .then(user => {
                    res.json({message :"saved successfully"})
                }).catch(err => {
                    console.log(err)
                })
            }).catch(err =>{
                console.log(err)
            })
            
        }
    })).catch(err => {
        console.log(err)
    })
})

router.post('/signin', (req,res) =>{
    const {email,password} = req.body;
    if(!email || !password){
        res.status(400).send({error:"please add email and password both"})
    }
    else{
        User.findOne({email:email})
        .then(savedUser =>{
            if(!savedUser){
                return res.status(400).send({error:"Email is not registered"})
            }
            bcrypt.compare(password,savedUser.password)
            .then(doMath =>{
                if(doMath){
                    //res.send({message:"Signed in successfully"});
                    const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                    const {_id,name,email,followers,following,pic} = savedUser
                    res.json({token,user:{_id,name,email,followers,following,pic}});
                }else{
                    return res.status(400).send({error:"invalid email or password"})
                }
            })
        })
    }
})

module.exports = router