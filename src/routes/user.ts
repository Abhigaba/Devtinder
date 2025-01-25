import  express, {Response, Request}  from "express";
import { authMiddle } from "../middleware/authMiddleware";
import dUser from '../database/dUser'
import connectionRequest from "../database/connection";
export const userRouter = express.Router();

userRouter.get('/pendingRequests', authMiddle, async (req: Request, res: Response) => { 

    try { 
            const user = req.user._id; 
            
            const getUsers = await connectionRequest.find({
                
                    receiverId: user, 
                    status: 'interested'
                
            }).populate('receiverId', 'Firstname Lastname  photoUrl age about skills')
            
            const data = getUsers.map((n) => {
                return n.receiverId
            })

            res.json({
                data : data
            })
    }
    catch(error: any) { 
        res.status(400).send(error.message);
    }
})

userRouter.get('/connections', authMiddle, async(req: Request, res: Response) => {

    try {

        const user = req.user._id ; 

        const getUsers = await connectionRequest.find({
            $or :[
                {senderId: user, status: "accepted"},
                {receiverId: user, status: "accepted"}
            ] 
        }).populate('receiverId', 'Firstname Lastname  photoUrl age about skills')
        .populate('senderId', 'Firstname Lastname photoUrl age about skills')

        if (!getUsers) { 
            throw new Error('No Connections Yet');
        }

        const id = user.toString()
     
        const data = getUsers.map((n) => {
            if (n.senderId.toString() === id) {
                return n.receiverId
            }
            return n.senderId;
        })
        
        res.json({
            data: data,
        })
    }
    catch(error: any) { 
        res.status(400).send(error.message) ;
    }
})

userRouter.get('/feed', authMiddle, async (req: Request, res: Response) => {

    try { 

        const page = parseInt(req.query.page as string ) || 1 ;
        const limit = parseInt(req.query.limit as string) || 10 


        const skip = (page - 1)*limit
        const user = req.user ;
        const seenUsers = await connectionRequest.find({
        $or : [
            {senderId : user._id},
            {receiverId: user.__id} ]
        }).select('senderId receiverId')

        const seen = new Set() 
        seenUsers.forEach((n) => {
            seen.add(n.senderId.toString())
            seen.add(n.receiverId.toString())
        })

        const feed = await dUser.find({
            _id : {$nin : Array.from(seen)}
        })
        .select('Firstname Lastname photoUrl age about skills _id')
        .skip(skip)
        .limit(limit);

        res.json({
            data: feed
        })

    }
    catch(error :any) {
        res.status(400).send(error.message);
    }
})