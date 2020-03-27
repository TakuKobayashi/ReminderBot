import * as Twit from 'twit';

import { setupFireStore } from './firestore';

const ReminderBotConfigDocKey = "config";

export function setupTwit(extToken: { [s: string]: any }): Twit {
  const twitter = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY!,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET!,
    ...extToken,
  });
  return twitter;
}

export async function recordMentionsCommand(): Promise<void> {
  const twitter = setupTwit({ access_token: process.env.TWITTER_BOT_ACCESSTOKEN!, access_token_secret: process.env.TWITTER_BOT_ACCESSTOKEN_SECRET! });
  const firestore = setupFireStore();
  const configDoc = await firestore.collection("ReminderBot").doc(ReminderBotConfigDocKey)
  const twitterUserResponse = await twitter.get('statuses/mentions_timeline', { count: 200, since_id: (configDoc.data() || {}).last_checked_tweet_id});
  const mentionTweets = twitterUserResponse.data
  const writeBatch = firestore.batch();
  
  for(const mentionTweet of mentionTweets){
    const tweetUser = mentionTweet.user;
    writeBatch.set(firestore.collection("TwitterUsers").doc(tweetUser.id_str), {
      screen_name: tweetUser.screen_name,
    })
    const remindDoc = firestore.collection("RemindSchedule").doc(["twitter", mentionTweet.id].join(":"))
    // 内容によってはsetではなくdeleteもありうる
    writeBatch.set(remindDoc, {
      source_id: mentionTweet.id_str,
      record_from: "twitter",
      user_id: tweetUser.id_str,
      // tweetするときにmenthonをつけたい
      menthon_user_ids: [tweetUser.id_str],
      // remindするmessage
      message: mentionTweet.text,
      // 次にremindしてほしい時間
      next_remind_at: new Date(),
      // 繰り返し実行する場合はtrue
      is_period: true,
      // 繰り返し実行する
      period_minutes: 20,
    });
  }
  writeBatch.set(firestore.collection("ReminderBot").doc(ReminderBotConfigDocKey), {
    last_checked_tweet_id: mentionTweets[0].id_str,
    last_checked_at: new Date(),
  })
  const result = await writeBatch.commit();
  console.log(result);
}