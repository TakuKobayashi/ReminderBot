import { NextFunction, Request, Response } from 'express';
import axios from 'axios';

const crypto = require('crypto');
const express = require('express');
const twitterAccountRouter = express.Router();
const querystring = require('querystring')

const twitterRequestTokenUrl = 'https://api.twitter.com/oauth/request_token';

twitterAccountRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello twitter');
});

twitterAccountRouter.get('/auth', async (req: Request, res: Response, next: NextFunction) => {
  const params = requestTokenTwitterParams();
  const signatureString = signature(encodeURIComponent(sortJoinParamsString(params, "&")));
  params.oauth_signature = encodeURIComponent(signatureString);
  const oauthString = sortJoinParamsString(params, ",");
  const response = await axios.post(twitterRequestTokenUrl, null,  {
    headers:{
      'Authorization': 'OAuth ' + oauthString,
    }
  }).catch(err => {
    res.send('error');
  });
  const tokenData = querystring.parse(response.data);
  const token = response.data.match(/[0-9a-zA-Z¥_]+&/)[0].replace(/&/g, "");
  res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + token);
});

twitterAccountRouter.get('/callback', async (req: Request, res: Response, next: NextFunction) => {
  const response = await axios.post("https://api.twitter.com/oauth/access_token?", sortJoinParamsString(req.query, "&")).catch(err => {
    res.send('error');
  });
  const accessTokenData = querystring.parse(response.data);
  //{"oauth_token":"...","oauth_token_secret":"...","user_id":"...","screen_name":"..."}
  res.json(accessTokenData);
});

function requestTokenTwitterParams(): { [s: string]: string } {
  const date = new Date();
  const params = {
    oauth_callback: 'http://localhost:3000/twitter/account/callback',
    oauth_consumer_key: process.env.TWITTER_CONSUMER_KEY,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(date.getTime() / 1000),
    oauth_nonce: date.getTime(),
    oauth_version: '1.0'
  };
  Object.keys(params).forEach(item => {
    params[item] = encodeURIComponent(params[item]);
  });
  return params;
}

function sortJoinParamsString(requestParams: { [s: string]: string }, joinString: string): string {
  const params = Object.keys(requestParams).map(item => {
    return item + '=' + requestParams[item];
  });
  params.sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
  return params.join(joinString);
}

function signature(queryString: string): string {
  const dataOfSign = encodeURIComponent('POST') + '&' + encodeURIComponent(twitterRequestTokenUrl) + '&' + queryString;
  return crypto.createHmac('sha1', encodeURIComponent(process.env.TWITTER_CONSUMER_SECRET) + "&").update(dataOfSign).digest('base64');
}

export { twitterAccountRouter };
