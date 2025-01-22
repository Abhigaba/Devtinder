import  express, {Response, Request}  from "express";
import { authMiddle } from "../middleware/authMiddleware";
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
        }).populate('receiverId', 'Firstname Lastname  photoUrl age about skills').populate('senderId', 'Firstname Lastname photoUrl age about skills')

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