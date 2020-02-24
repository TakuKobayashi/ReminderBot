import { NextFunction, Request, Response } from 'express';

const express = require('express');
const twitterCommunicateRouter = express.Router();

twitterCommunicateRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello twitter');
});

twitterCommunicateRouter.get('/auth', (req: Request, res: Response, next: NextFunction) => {
  res.redirect('/');
});

twitterCommunicateRouter.get('/callback', (req: Request, res: Response, next: NextFunction) => {
  res.redirect('/');
});

export { twitterCommunicateRouter };
