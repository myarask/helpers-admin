/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import './index.css';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

import App from './App';
import * as serviceWorker from './serviceWorker';

const AuthorizedApolloProvider = ({ children }) => {
  const { getAccessTokenSilently } = useAuth0();

  const request = async (operation) => {
    const token = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUTH_AUDIENCE,
    });

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  };

  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle;
        Promise.resolve(operation)
          .then((oper) => request(oper))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      })
  );

  const client = new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError) {
          console.log(`[Network error]: ${networkError}`);
        }
      }),
      requestLink,
      new HttpLink({
        uri:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3001/api/graphql'
            : '/api/graphql',
        credentials: 'same-origin',
      }),
    ]),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

console.log(process.env);

// ReactDOM.render(
//   <Auth0Provider
//     domain={process.env.REACT_APP_AUTH_DOMAIN}
//     clientId={process.env.REACT_APP_AUTH_CLIENT_ID}
//     redirectUri={window.location.origin}
//   >
//     <AuthorizedApolloProvider>
//       <CssBaseline />
//       <App />
//     </AuthorizedApolloProvider>
//   </Auth0Provider>,
//   document.getElementById('root')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
