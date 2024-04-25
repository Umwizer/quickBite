
import express from 'express'
import configs from './configs/index.js';
import mongoose from 'mongoose';
import ErrorHandler from './middleware/ErrorHandler.js';
import cors from 'cors';
import router from './routes/index.js';

const corsOptions = {
    allowedHeaders:["Authorization","content-type"],
    methods:["GET","POST","UPDATE","DELETE"]
}

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/v1',router)

mongoose.connect(configs.MONGODB_CONNECTION_STRING)
.then(()=> console.log('connected to MongoDB'))
.catch(err=>console.log(err))

app.listen(configs.PORT,() => console.log(`server listening on port ${configs.PORT}`))
app.use(ErrorHandler)