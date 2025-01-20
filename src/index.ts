import express, { Express, Request, Response ,NextFunction, Application } from 'express';
import connectdb from './config/database';
import d_user  from './database/dUser';
import { authRouter } from './routes/auth';
import { profileRouter } from './routes/profile';
import { requestRouter } from './routes/request';
import cookieParser from 'cookie-parser';


const app : Application = express() ;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/',authRouter);
app.use('/profile', profileRouter)
app.use("/request", requestRouter)


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