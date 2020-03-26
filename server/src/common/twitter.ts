import * as Twit from 'twit';

export function setupTwit(extToken: { [s: string]: any }): Twit {
  const twitter = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY!,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET!,
    ...extToken,
  });
  return twitter;
}
