import React, { useEffect } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Unauthorized from '../pages/Unauthorized';

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();
  const hasError = window.location.search.includes('error=');

  useEffect(() => {
    if (isLoading || isAuthenticated) {
      return;
    }
    if (hasError) return;

    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl: path },
      });
    };
    fn();
  }, [isLoading, isAuthenticated, loginWithRedirect, path]);

  const render = (props) => {
    if (hasError) return <Unauthorized />;
    if (isAuthenticated) return <Component {...props} />;

    return null;
  };

  return <Route path={path} render={render} {...rest} />;
};

export default withRouter(PrivateRoute);
