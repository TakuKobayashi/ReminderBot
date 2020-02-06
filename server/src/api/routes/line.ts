import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import { URLSearchParams } from 'url';

const uuid = require('uuid/v4');
const querystring = require('querystring');
const express = require('express');
const lineRouter = express.Router();

const LINE_NOTIFY_BASE_URL = 'https://notify-api.line.me';
const LINE_NOTIFY_AUTH_BASE_URL = 'https://notify-bot.line.me';

const config = {
  channelAccessToken: process.env.LINE_BOT_CHANNEL_ACCESSTOKEN,
  channelSecret: process.env.LINE_BOT_CHANNEL_SECRET,
};

const line = require('@line/bot-sdk');
const client = new line.Client(config);
const port = 3000;

lineRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello line');
});

lineRouter.get('/auth', (req: Request, res: Response, next: NextFunction) => {
  const stateString = uuid();
  res.cookie('state', stateString);
  const lineOauthParams = {
    response_type: "code",
    client_id: process.env.LINE_NOTIFY_CLIENT_ID,
    scope: "notify",
    state: stateString,
    redirect_uri: req.protocol + '://' + req.hostname + ( port == 80 || port == 443 ? '' : ':' + port ) + "/line/callback"
  }
  res.redirect(LINE_NOTIFY_AUTH_BASE_URL + "/oauth/authorize?" + querystring.stringify(lineOauthParams));
});

lineRouter.get('/callback', (req: Request, res: Response, next: NextFunction) => {
  const lineOauthParams = {
    grant_type: "authorization_code",
    client_id: process.env.LINE_NOTIFY_CLIENT_ID,
    client_secret: process.env.LINE_NOTIFY_CLIENT_SECRET,
    code: req.query.code,
    redirect_uri: req.protocol + '://' + req.hostname + ( port == 80 || port == 443 ? '' : ':' + port ) + "/line/callback"
  }
  axios.post(LINE_NOTIFY_AUTH_BASE_URL + "/oauth/token?" + querystring.stringify(lineOauthParams)).then(result => {
    console.log(result.data.access_token)
    res.redirect("/");
  }).catch(err => {
    console.log(err)
    res.redirect("/");
  })
});

lineRouter.get('/notify', (req: Request, res: Response, next: NextFunction) => {
  const messages = new URLSearchParams();
  messages.append('message', 'aaaa');

  axios.post(LINE_NOTIFY_BASE_URL + "/api/notify", messages, {
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
