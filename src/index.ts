import express, { Express, Request, Response ,NextFunction, Application } from 'express';
import connectdb from './config/database';
import d_user  from './database/dUser';
import {validateSignUp} from './helpers/validatorHelper'; 

const app : Application = express() ;

app.all('/', express.json());

app.get('/signup', (req: Request, res : Response) => { 

    validateSignUp(req);
    
    try{
    const {email, password, Firstname, Lastname} = req.body; 

    const user = new d_user({email, password, Firstname, Lastname});
    user.save();
    }
    catch(error : any) {
        res.status(401).send('Unknown error occured');
    }
})

app.get('/feed', (req: Request, res: Response) => {

    try { 
    const all_user = d_user.find({}) || {} ;
    res.send(all_user); } 

    catch(error : any) { 
        res.status(401).send(error);
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

