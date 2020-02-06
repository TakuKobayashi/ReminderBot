import 'source-map-support/register';

import { APIGatewayEvent, APIGatewayProxyHandler, Context } from 'aws-lambda';
import * as awsServerlessExpress from 'aws-serverless-express';
import * as express from 'express';

import { twitterRouter } from './api/routes/twitter/account';
import { lineBotRouter } from './api/routes/line/bot';
import { lineNotifyRouter } from './api/routes/line/notify';

const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

const app = express();
const server = awsServerlessExpress.createServer(app);
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(passport.initialize());

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: '/twitter/callback',
  },
  function(token, tokenSecret, profile, done) {
    done(undefined, profile);
  }
));

app.use(cors({ origin: true }));

app.use('/twitter/acount', twitterRouter);
app.use('/line/bot', lineBotRouter);
app.use('/line/notify', lineNotifyRouter);

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

export const handler: APIGatewayProxyHandler = (event: APIGatewayEvent, context: Context) => {
  awsServerlessExpress.proxy(server, event, context);
};
