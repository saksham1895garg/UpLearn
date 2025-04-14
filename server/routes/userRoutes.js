import express from 'express';
import { getUserData, startSession, endSession, createVideoSession, joinVideoSession } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.post('/start-session', userAuth, startSession);
userRouter.post('/end-session', userAuth, endSession);
userRouter.post('/create-video-session', userAuth, createVideoSession);
userRouter.post('/join-video-session/:sessionId', userAuth, joinVideoSession);

export default userRouter;