import React from 'react';
import {
  AppRegistry,
  asset,
  StyleSheet,
  Pano,
  Text,
  View,
} from 'react-vr';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import get from 'lodash.get';

const SubscribeToMessageQuery = gql`
  subscription NewMessages {
    subscribeToMessage(mutations:[createMessage]) {
      value {
        id
        content
      }
    }
  }
`;

const MostRecentMessageQuery = gql`
  query MostRecentMessage($ordering:[MessageOrderByArgs]) {
    viewer {
      allMessages(first: 1, orderBy: $ordering) {
        edges {
          node {
            id
            content
          }
        }
      }
    }
  }
`;

class Scene extends React.Component {

  componentDidMount() {
    this.subscribeToNewMessages();
  }

  subscribeToNewMessages() {
    this.subscription = this.props.data.subscribeToMore({
      document: SubscribeToMessageQuery,
      variables: {},
      onError: (error) => {
        debugger;
        console.log(error);
      },
      updateQuery: (prev, { subscriptionData }) => {
        debugger;
        const newEdges = [
          {
            node: get(subscriptionData, 'data.subscribeToMessage.value')
          }
        ];
        return {
          viewer: {
            allMessages: {
              edges: newEdges,
            }
          }
        };
      },
    });
  }

  render() {
    const message = this.props.data.loading ?
      'Loading...' :
      get(this.props.data, 'viewer.allMessages.edges.0.node.content', 'Hello!');
    return (
      <View>
        <Pano source={asset('chess-world.jpg')}/>
        <Text
          style={{
            backgroundColor:'blue',
            padding: 0.02,
            textAlign:'center',
            textAlignVertical:'center',
            fontSize: 0.8,
            layoutOrigin: [0.5, 0.5],
            transform: [{translate: [0, 0, -3]}],
          }}>
          {message}
        </Text>
      </View>
    );
  }
};

const SceneWithData = graphql(MostRecentMessageQuery, {
  options: (props) => {
    return {
      returnPartialData: true,
      variables: {
        ordering: {
          field: 'createdAt',
          direction: 'DESC'
        }
      }
    };
  }
})(Scene);

AppRegistry.registerComponent('Scene', () => SceneWithData);

export default SceneWithData;