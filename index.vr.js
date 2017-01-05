import React from 'react';
import Storage from 'react-native-storage';
import {
  AppRegistry
} from 'react-vr';
import { ApolloProvider } from 'react-apollo';
import Scene from './app/scene.vr';
import './utilities/localStorage';
import makeApolloClient from './utilities/makeApolloClient';

/**
 * Create the apollo client instance. This is passed to the <ApolloProvider /> and will
 * help us enrich our application with data consumed from our GraphQL API.
 */
const client = makeApolloClient('https://us-west-2.api.scaphold.io/graphql/react-vr-graphql');

class VrApp extends React.Component {

  render() {
    return (
      <ApolloProvider client={client}>
        <Scene />
      </ApolloProvider>
    );
  }
};

AppRegistry.registerComponent('VrApp', () => VrApp);
