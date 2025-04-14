import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// database connection
mongoose.connect(process.env.DB_URL)
    .then(() => console.log('DataBase is connected'))
    .catch((err) => {
        console.log("Database Connection Lost");
        console.log(err);
    });

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];

// middlewares
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Configure static file serving - make it before routes
const uploadsPath = path.join(__dirname, '../public/uploads');
console.log('Serving static files from:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Test endpoint for uploads
app.get('/test-image/:filename', (req, res) => {
    const filePath = path.join(uploadsPath, req.params.filename);
    console.log('Attempting to serve file:', filePath);
    res.sendFile(filePath);
});

//routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// server running
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});