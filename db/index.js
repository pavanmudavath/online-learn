const mongoose =require('mongoose');

//Define Mongoose Schemas 
const UserSchema=new mongoose.Schema({
    username:{type: String},
    password:String,
    purchasedCourses:[{type:mongoose.Schema.Types.ObjectId,ref:'Course'}]
});
const AdminSchema=new mongoose.Schema({
    username:{type:String,unique:true},
    password:String
})
const courseSchema=new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    imageLink:String,
    published:Boolean
})
const User=mongoose.model('User',UserSchema);
const Admin=mongoose.model('Admin',AdminSchema);
const Course=mongoose.model('Course',courseSchema);


module.exports={
    User,
    Admin,
    Course
}