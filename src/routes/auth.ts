import  express, {Request, Response, NextFunction}  from "express";
import { validateSignUp, validateLogIn } from "../helpers/validatorHelper";
import { validatePassword } from "../helpers/auth";

import { signUp } from "../helpers/auth";
import d_user from "../database/dUser";
import { hash } from "bcrypt";

export const authRouter = express.Router() 

authRouter.post('/signup', async (req: Request, res : Response) => { 

    console.log(req.body)

    try{
        validateSignUp(req);
        
        if (!validateSignUp){
            throw new Error('validation failed');
        }
        
        const hashedPassword = await signUp(req.body.password);
        
        const user = await new d_user({...req.body, password: hashedPassword});

        await user.save();
        
        res.send('Sign up successful')
        }
    catch(error : any) {
        res.status(401).send(error.message);
    }
})

authRouter.post('/login', async (req: Request, res : Response) => {

    try { 
        validateLogIn(req) ;
        const {email, password} = req.body
        const findUser = await d_user.findOne({email}) ; 

        if (!findUser) {throw new Error('Invalid Credentials')}

        const token = await validatePassword(findUser, password)   
        
        res.cookie('token',token, {expires: new Date(Date.now() + 8*3600000) })
        res.send('Login successful');
    }
    catch(error : any) {
        res.status(401).send('Invalid Credentials');
    }
})


authRouter.post('/logout' , async (req: Request, res : Response) =>{

    res.cookie('token', null, {expires: new Date(Date.now())})
    res.json({
        message: "Logout Successful"
    })
})

