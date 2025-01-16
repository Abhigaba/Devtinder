import express, { Express, Request, Response ,NextFunction, Application } from 'express';
import connectdb from './config/database';
import d_user  from './database/dUser';
import {validateSignUp, validateLogIn} from './helpers/validatorHelper'; 
import { signUp, validatePassword } from './helpers/auth';
import  jwt  from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { authMiddle } from './middleware/authMiddleware';

const app : Application = express() ;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', async (req: Request, res : Response) => { 

    console.log(req.body)

    try{
        validateSignUp(req);

        const {email, password, Firstname, Lastname, age} = req.body; 

        const hashedPassword = await signUp(password);

        const user = await new d_user({email, password: hashedPassword, Firstname, Lastname, age});

        await user.save();

        res.send('Sign up successful')

        }
    catch(error : any) {
        
        res.status(401).send(error);
    }
})

app.post('/login', async (req: Request, res : Response) => {

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

app.get('/profile', authMiddle,async (req: Request, res : Response) => {
    try { 
        const user= req.user;
        res.send(user);
    }

    catch(error) {
        res.status(401).send(error);
    }
})

app.patch('/updateProfile', async (req: Request, res : Response) => { 


    try { 
        const body = req.body ;

        const findUser = d_user.findByIdAndUpdate(body);
        res.send('Update successful');

    }
    catch(error : any)  { 
        res.status(401).send('Internal Server Error'); 
    }
})


app.use('/', (req: Request, res: Response) => {
    console.log(req.params);
    res.send("Server Up and running");
})

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send({message: error.message});
})

connectdb().then(() => {
app.listen(3333, () => {
    console.log('Server listening on 3333');
})
}).catch((error) => {
    console.log("Error in connecting to database");
})