import { Request, Response, NextFunction } from "express";
import  jwt  from "jsonwebtoken";
import d_user from "../database/dUser";

declare global {
    namespace Express {
      interface Request {
        user: any
      }
    }
  }

export const authMiddle = async (req: Request, res: Response, next: NextFunction) => { 

    try { 

        const {token} = req.cookies;
        if (!token) { 
            throw new Error('Token expired');
        }

        const decoded = await jwt.verify(token, 'shhhhh') 

        const user = await d_user.findById(decoded); 
        if (!user) { 
            throw new Error('Session Expired');
        }
        req.user = user ;
        next();
    }
    catch(error) {
        res.status(400).send(error)
    }

}