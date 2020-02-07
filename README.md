# serverについて

1. serverless frameworkを使っています
2. dynamodb-localも使っています

まずは

```
serverless dynamodb install
```

でDynamoDBをインストールします。

## localのDynamoDBの環境について

dynamodb-localのserverless pluginを使用しています。
dynamodbのtable情報の更新は

```
serverless dynamodb migrate
```

で行います。

dynamodbだけ起動したい場合は

```
serverless dynamodb start
```

でDynamoDBサーバーが立ち上がります。
DynamoDBサーバーが立ち上がったら `http://localhost:8010/shell` これでコンソールが起動します。  
※ `port 8000` Java(おそらくPlantUML)で使われている様なので、今回は `port 8010` を使用しています。

## localでの開発について

serverless offlineを以下のコマンドで起動すると、DynamoDBも一緒に起動します。
```
serverless offline start
```

すでにDynamoDBが起動している中で実行すると衝突するので、すでに起動しているDynamoDBを閉じましょう。

