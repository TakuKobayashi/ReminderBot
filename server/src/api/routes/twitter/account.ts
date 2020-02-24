import { NextFunction, Request, Response } from 'express';

const express = require('express');

twitterRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello twitter');
});

twitterRouter.get('/auth', (req: Request, res: Response, next: NextFunction) => {
  res.redirect('/');
});

twitterRouter.get('/callback', (req: Request, res: Response, next: NextFunction) => {
  res.redirect('/');
});

export { twitterRouter };
