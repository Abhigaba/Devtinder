import express, {Request, Response, NextFunction}  from "express";
import { authMiddle } from "../middleware/authMiddleware";
import connectionRequest from "../database/connection";

export const requestRouter = express.Router();

requestRouter.get('/send/:status/:reqId', authMiddle, async (req: Request, res: Response) => {

    try {

        const senderId = req.user._id;
        const receiverId = req.params.reqId; 
        const status = req.params.status;

        const requests = ['interested', 'ignored']
        if (!requests.includes(status)) {
            throw new Error('Invalid Status');
        }

        const existingRequest = await connectionRequest.findOne({
            $or: [
                {senderId, receiverId},
                {senderId: receiverId, receiverId: senderId}
            ]
        })

        if (existingRequest) { 
            throw new Error('Request already exist!');
        }

        const newReq = await new connectionRequest(
            {senderId, 
            receiverId, 
            status})
            
        await newReq.save()
        
        res.json({
            message: "Connection request successfully sent"
        })


    }
    catch(error: any) { 
        res.status(401).json({message: error.message});
    }

}) 