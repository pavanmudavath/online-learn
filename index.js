const express=require('express');
const mongoose=require('mongoose');
require('dotenv').config()
const cors=require('cors');
const adminRouter=require("./routes/admin");
const userRouter=require("./routes/user");

const app=express();


app.use(cors());
app.use(express.json());

app.use('/',adminRouter);
app.use('/',userRouter);
app.get('/',(req,res)=>res.json({msg:"hello"}))

// mongodb+srv://ram:<password>@cluster0.u2n9h7y.mongodb.net/courses?retryWrites=true&w=majority

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
// mongoose.connect('mongodb+srv://ram:9teFy6zk19bZJzyN@cluster0.u2n9h7y.mongodb.net/courses',{
//     useNewUrlParser:true,
//     useUnifiedTopology:true,
// })

app.listen(4000,()=>console.log('Server running on the port 4000'));