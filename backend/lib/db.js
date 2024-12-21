import mongoose from "mongoose";
export const connectDB=async ()=>{
    try{
       const conn= await mongoose.connect(process.env.MONGO_URI);
       console.log(`Mongo connected : ${conn.connections}`);
    }
    catch(error){
        console.log(error.message);
    }
};