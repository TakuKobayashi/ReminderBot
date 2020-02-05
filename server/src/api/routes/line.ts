import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import { URLSearchParams } from 'url';

const express = require('express');
const lineRouter = express.Router();

const LINE_NOTIFY_URL = 'https://notify-api.line.me/api/notify';

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESSTOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const line = require('@line/bot-sdk');
const client = new line.Client(config);

lineRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello line');
});

lineRouter.get('/notify', (req: Request, res: Response, next: NextFunction) => {
  const messages = new URLSearchParams();
  messages.append('message', 'aaaa');

  axios.post(LINE_NOTIFY_URL, messages, {
    headers: {
      "Authorization": 'Bearer '+ process.env.LINE_NOTIFY_TOKEN,
    }
  }).then(result => {
    console.log({status: result.status, body: result.data});
    res.send('hello line');
  }).catch(err => {
    console.log(err);
    res.send('error');
  })
});

lineRouter.post('/message', line.middleware(config), (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  Promise
  .all(req.body.events.map(handleEvent))
  .then((result) => res.json(result))
  .catch((err) => {
    console.error(err);
    res.status(500).end();
  });
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

export { lineRouter };
