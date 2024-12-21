import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast, { Toaster } from "react-hot-toast";
import { RollerCoaster } from "lucide-react";
import { io } from "socket.io-client";

const BASE_URL=import.meta.env.MODE==="development" ? "http://localhost:8000":"/"
export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigningUP:false,
    isLoggingIng:false,
    isUpdatingProfile:false,
    onlineUsers:[],
    isCheckingAuth:true,
    socket:null,
    checkAuth:async()=>{
        try {
            const res=await axiosInstance.get("/auth/check");
            set({authUser:res.data});
            get().connectSocket();
        } catch (error) {
            console.log(error)
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false});
        }
    },
    signup :async(data)=>{
        set({isSigningUP:true});
        try{
           const res=  await axiosInstance.post("/auth/signup",data);
           toast.success("Account created successfully");
           set({authUser:res.data});
           get().connectSocket();

        }
        catch (error){
            toast.error(error.response.data.message);

        }
        finally{
            set({isSigningUP:false});
        }
    },
    logout: async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
            
        }
    },
    login:async(data)=>{
        set({isLoggingIng:true});
        try{
            const res=await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Logged in Successfully");
            get().connectSocket();
        }
        catch(error){
            toast.error(error.response.data.message);
        }
        finally{
            set({isLoggingIng:false});
        }

    },

    updateProfile:async(data)=>{
        set({isUpdatingProfile:true});
        try {
            const res=await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data});
            toast.success("Profile updates successfully");
        } catch (error) {
            console.log(error.message);
            toast.error(error.message.data.message);
        }
        finally{
            set({isUpdatingProfile:false});
        }
    },
    connectSocket:()=>{
        const {authUser}=get()
        if(!authUser || get().socket?.connected) return;
        const socket=io(BASE_URL,{
            query:{
                userId:authUser._id
            }
        })
        socket.connect();
        set({socket:socket})
        socket.on("getOnlineUsers", (userIds)=>{
            set({onlineUsers:userIds});
        })


    },
    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnect();

    }


}));