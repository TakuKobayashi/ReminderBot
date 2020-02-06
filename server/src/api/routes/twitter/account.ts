import { NextFunction, Request, Response } from 'express';

const express = require('express');
const passport = require('passport');
const twitterRouter = express.Router();

twitterRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello twitter');
});

twitterRouter.get('/auth', passport.authenticate('twitter', { session: false }));

twitterRouter.get('/callback', passport.authenticate('twitter'), (req: Request, res: Response, next: NextFunction) => {
  res.redirect('/');
});

export { twitterRouter };
