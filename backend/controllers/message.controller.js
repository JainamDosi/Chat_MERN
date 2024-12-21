import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId ,io} from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsers=async (req,res)=>{
    try {
        const loggedInUserId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        res.status(500).json({
            error:"Internal Server error"
        });
    }
};

export const getMessages= async (req,res)=>{
    try {
        const {id:userToChatId}=req.params;
        const senderId=req.user._id;
        const messages=await Message.find({
            $or:[
                {senderId:senderId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:senderId}
            ]
        });

        res.status(200).json(messages);



    } catch (error) {
        console.log("Error in getting Messages");
        res.status(500).json({error:"Internal server error"});
    }

}


export const sendMessage=async (req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;

        let imageURL;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(iamge);
            imageURL=uploadResponse.secure_url;

        }
        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageURL,
        });

        await newMessage.save();
        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);

        }
        res.status(201).json(newMessage);


        
    } catch (error) {
            console.log("ERROR in message sending");
            res.status(500).json({error:"Internal server error"});
    }
}