import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';


const app = express();
const port = process.env.PORT || 4000;

// database connection
mongoose.connect(process.env.DB_URL).then(() => console.log('DataBase is connected')).catch((err) => {console.log("Database Connection Lost"); console.log(err)});

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));


//pages
app.get('/', (req, res) => {
    res.send('Hello World!')
});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);




// server running
app.listen(port, ()=>{
    console.log(`Server is running on port http://localhost:${port}`);
})