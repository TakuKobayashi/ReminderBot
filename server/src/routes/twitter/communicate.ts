import { NextFunction, Request, Response } from 'express';
import { setupTwit } from '../../common/twitter';

const express = require('express');
const twitterCommunicateRouter = express.Router();

twitterCommunicateRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const twitter = setupTwit({ access_token: process.env.TWITTER_BOT_ACCESSTOKEN!, access_token_secret: process.env.TWITTER_BOT_ACCESSTOKEN_SECRET! });
  const twitterUserResponse = await twitter.get('statuses/mentions_timeline', { count: 200 });
  console.log(twitterUserResponse.data);
  res.json(twitterUserResponse.data);
});

twitterCommunicateRouter.get('/auth', (req: Request, res: Response, next: NextFunction) => {
  res.redirect('/');
});

twitterCommunicateRouter.get('/callback', (req: Request, res: Response, next: NextFunction) => {
  res.redirect('/');
});

export { twitterCommunicateRouter };
