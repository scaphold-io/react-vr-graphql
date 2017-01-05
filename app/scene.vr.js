import React from 'react';
import {
  AppRegistry,
  asset,
  StyleSheet,
  Pano,
  Text,
  View,
  Image,
  VrButton,
  Animated,
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

  constructor(props) {
    super(props);
    this.state = {
      isOnRight: true,
      translation: new Animated.Value(-1), // init opacity 0
    };
  }

  componentDidMount() {
    this.subscribeToNewMessages();
    Animated.spring(          // Uses easing functions
      this.state.translation,    // The value to drive
      {toValue: 1, duration: 5000}            // Configuration
    ).start();                // Don't forget start!
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

  onButtonClicked() {
    console.log('Button clicked');
    if (this.state.isOnRight) {
      Animated.spring(
        this.state.translation,
        {toValue: -1, duration: 5000}
      ).start();
      this.setState({
        isOnRight: false,
      })
    } else {
      Animated.spring(
        this.state.translation,
        {toValue: 1, duration: 5000}
      ).start();
      this.setState({
        isOnRight: true,
      })
    }
  }

  render() {
    const message = this.props.data.loading ?
      'Loading...' :
      get(this.props.data, 'viewer.allMessages.edges.0.node.content', 'Hello!');
    return (
      <View>
        <Pano source={asset('chess-world.jpg')}/>
        <VrButton
          onClick={()=>this.onButtonClicked()}
        >
          <Animated.View
            style={{
              layoutOrigin: [0, 0],
              transform: [{
                translateX: this.state.translation,
            }]}}
          >
            <Image
              style={{
                width: 1,
                height: 1,
                transform: [
                  {translate: [0, 0, -7]}
                ],
              }}
              source={require('../static_assets/scaphold.png')}
            />
            <Text
              style={{
                fontSize: 0.3,
                color: 'white',
                transform: [
                  {translate: [0, 0, -7]}
                ],
              }}>
              Click Me!
            </Text>
          </Animated.View>
        </VrButton>
        <Text
          style={{
            backgroundColor:'rgba(51, 153, 153, .85)',
            padding: 0.02,
            textAlign:'center',
            textAlignVertical:'center',
            fontSize: 0.8,
            layoutOrigin: [0.5, 0.75],
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