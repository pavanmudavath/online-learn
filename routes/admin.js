const express = require('express');
const mongoose =require('mongoose');
const {User,Course,Admin}=require('../db');
const jwt=require('jsonwebtoken');
const {SECRET}=require("../middleware/auth");
const {authenticateJwt}=require("../middleware/auth");

const router =express.Router();

router.get("/admin/adminme",authenticateJwt,async(req,res)=>{
    const admin=await Admin.findOne({username:req.user.username});
    if(!admin){
        res.status(403).json({msg:"Admin doesnot exist"});
        return;
    }
    res.json({
        username:admin.username
    })
});


router.post('/admin/adminsignup',async(req,res)=>{
    const {username,password}=req.body;
    const admin=await Admin.findOne({username});
    if(admin){
        res.status(403).json({message:'User already exists'});
    }else{
        const newUser=new Admin({username,password});
        await newUser.save();
        res.json({message:'User created successfully'});
    }
});


router.post('/admin/adminlogin',async(req,res)=>{
    const {username,password}=req.body;
    const admin=await Admin.findOne({username,password});
        if(admin){
            const token=jwt.sign({username,role:'admin'},SECRET,{expiresIn:'1h'});
            res.json({message:'Logged in Successfully',token});
        }else{
           res.status(403).json({message:"Invalid username or password"});
        }
});

router.post('/admin/admincourse',authenticateJwt,async(req,res)=>{
    const course=new Course(req.body);
    await course.save();
    res.json({message:'Course created Successfully',courseId:course.id});
})


router.put('/admin/admincourses/:courseId',authenticateJwt,async(req,res)=>{
    const courseId = req.params.courseId;
    const findcourse=await Course.findById(courseId);
    if(findcourse){
    const course=await Course.findByIdAndUpdate(req.params.courseId,req.body,{new: true});
    if(course){
        res.json({message:"Course updated successfully"});
    }
    }else{
        res.status(404).json({message:"Course not found"});
    }
});

router.get('/admin/admincourses',authenticateJwt,async(req,res)=>{
    const courses=await Course.find({});
    res.json({courses});
});

router.get('/admin/admincourse/:courseId',authenticateJwt,async(req,res)=>{
    const courseId = req.params.courseId;
    const course=await Course.findById(courseId);
    res.json({course});
})

module.exports=router