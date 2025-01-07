import express, { Express, Request, Response , Application } from 'express';


const app : Application = express() ;

app.use('/', express.json());

app.use('/:appId', (req: Request, res: Response) => {
    console.log(req.params);
    res.send("Server Up and running");
})

app.listen(3333, () => {
    console.log('Server listening on 3333');
})

