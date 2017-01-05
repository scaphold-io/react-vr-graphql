# react-vr-graphql

A starter kit to help you start building VR application with React Native and GraphQL.

The kit comes loaded with a public GraphQL api hosted on [scaphold.io](https://scaphold.io) that
instantly connects your VR app to a real-time stream of messages.

Getting started is simple.

## Requirements

The starter kit requires react native. Let's install it.

1. If you don't already have node install it. We also need watchman.

    ```
    brew install node
    brew install watchman
    ```

2. Globally install react-native.

      ```
      npm install -g react-native-cli
      ```

3. Install the rest of the dependencies

    ```
    npm install
    ```

## Start the App

```
npm start
```

Open [http://localhost:8081/vr/](http://localhost:8081/vr/) to see your VR application.

## Create a message to see it appear in real-time

Open [https://us-west-2.api.scaphold.io/graphql/react-vr-graphql](https://us-west-2.api.scaphold.io/graphql/react-vr-graphql)
to open our app's api [GraphiQL](https://github.com/graphql/graphiql).

### Fire off a mutation

To create a message in our api we can enter this simple query:

```
mutation CreateMessage($message:CreateMessageInput!) {
  createMessage(input:$message) {
    changedMessage {
      id
      content
    }
  }
}
```

with these variables:

```
{
  "message": {
    "content": "GraphQL Rocks!"
  }
}
```

Click `Cmd-Enter` or click the run button.

# Rejoice!

Open GraphiQL and your VR app side-by-side in two browser windows and watch as your VR app
automatically updates to your messages as you create them.

It's time to play around and start building! We hope this helps you build awesome VR apps!

With love from [scaphold.io](https://scaphold.io)