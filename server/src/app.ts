import 'source-map-support/register';

import { APIGatewayEvent, APIGatewayProxyHandler, Context } from 'aws-lambda';
import * as awsServerlessExpress from 'aws-serverless-express';
import * as express from 'express';

import { twitterAccountRouter } from './api/routes/twitter/account';
import { twitterCommunicateRouter } from './api/routes/twitter/communicate';
import { lineBotRouter } from './api/routes/line/bot';
import { lineNotifyRouter } from './api/routes/line/notify';

const app = express();
const server = awsServerlessExpress.createServer(app);
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(cors({ origin: true }));

app.use('/twitter/account', twitterAccountRouter);
app.use('/twitter/communicate', twitterCommunicateRouter);
app.use('/line/bot', lineBotRouter);
app.use('/line/notify', lineNotifyRouter);

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

export const handler: APIGatewayProxyHandler = (event: APIGatewayEvent, context: Context) => {
  awsServerlessExpress.proxy(server, event, context);
};
