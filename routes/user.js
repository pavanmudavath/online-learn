const express =require('express');
const {authenticateJwt,SECRET}=require("../middleware/auth");
const {User,Course,Admin}=require("../db");
const router=express.Router();
const jwt=require('jsonwebtoken');


router.get("/user/userme",authenticateJwt,async(req,res)=>{
    const user=await User.findOne({username:req.user.username});
    if(!user){
        res.status(403).json({msg:"User doesnot exist"});
        return;
    }
    res.json({
        username:user.username
    })
});


router.post('/user/usersignup',async(req,res)=>{
    const {username,password}=req.body;
    const user=await User.findOne({username});
    if(user){
        res.status(403).json({message:"User already Exists"});
    }
    else{
        const newUser=new User({username,password});
        await newUser.save();
        res.json({message:'User created successfully'});
    }
});


router.post('/user/userlogin',async(req,res)=>{
    const {username , password}=req.body;
    const user=await User.findOne({username,password});
    if(user){
        const token=jwt.sign({username,role:'user'},SECRET,{expiresIn:'1h'});
        res.json({message:'Logged in SuccessFully',token});
    }
    else{
        res.status(403).json({message:"Invalid username or password"});
    }
});


router.get('/user/courses',authenticateJwt,async(req,res)=>{
    const courses= await Course.find({published:true});
    res.json({courses});
});


router.post('/user/courses/:courseId',authenticateJwt,async(req,res)=>{
    const course=await Course.findById(req.params.courseId);
    if(course){
       const user=await User.findOne({username:req.user.username});
       if(user){
        user.purchasedCourses.push(course);
        await user.save();
        res.json({message:'Course purchased successfully'});
       }else{
        res.status(403).json({message:'User not found'});
       }
    }else{
        res.status(404).json({message:'Course not found'});
    }
});


router.get('/user/purchasedCourses',authenticateJwt,async(req,res)=>{
    const user=await User.findOne({username:req.user.username}).populate('purchasedCourses');
    if(user){
        res.json({purchasedCourses:user.purchasedCourses || [] });
    }else{
        res.status(403).json({message:'User not found'});
    }
});


router.get('/user/usercourse/:courseId',authenticateJwt,async(req,res)=>{
    const courseId=req.params.courseId;
    const course=await Course.findById(courseId);
    res.json({course});
});

module.exports=router