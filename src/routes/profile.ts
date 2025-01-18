import  express, {Request, Response, NextFunction}  from "express";
import { authMiddle } from "../middleware/authMiddleware";
import { validateEditableFields } from "../helpers/validatorHelper";
import { validChangePassword } from "../helpers/validatorHelper";
import bcrypt from 'bcrypt';

export const profileRouter = express.Router() ;

profileRouter.get('/', authMiddle,async (req: Request, res : Response) => {
    try { 
        const user= req.user;
        res.json({
            message: "Profile successfully fetched",
            user: user
        }    
        );
    }
    catch(error) {
        res.status(401).send(error);
    }
})

profileRouter.patch('/edit',authMiddle,async (req: Request, res : Response) => {

    try { 
    const isEditable = validateEditableFields(req);

    if (!isEditable) { 
        throw new Error('Invalid Details');
    }
    const user = req.user;

    for(let element in req.body) {
        user[element] = req.body[element];
    }

    await user.save();
    res.send('Edited successfully')    
    
    }
    catch(error: any) { 
        res.status(401).send(error.message);
    }

})

profileRouter.patch('/password', authMiddle, async (req: Request, res: Response) => {

    try { 
        if (!validChangePassword(req)) {
            throw new Error('Invalid Password');
        };

        const user = req.user ; 
        const hashedPass = await bcrypt.hash(req.body.newPassword, 10); 
        user.password = hashedPass; 

        await user.save();
        res.json({message: "Password Changed Successfully"});
    }
    catch(error: any) { 
        res.status(401).send(error.message);
    }
})