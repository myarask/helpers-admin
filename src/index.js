/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

import App from './App';
import * as serviceWorker from './serviceWorker';

const AuthorizedApolloProvider = ({ children }) => {
  const { getAccessTokenSilently } = useAuth0();

  const httpLink = createHttpLink({
    uri:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001/api/graphql'
        : '/api/graphql',
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUTH_AUDIENCE,
    });

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

ReactDOM.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH_DOMAIN}
    clientId={process.env.REACT_APP_AUTH_CLIENT_ID}
    redirectUri={window.location.origin}
  >
    <AuthorizedApolloProvider>
      <CssBaseline />
      <App />
    </AuthorizedApolloProvider>
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
