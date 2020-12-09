import React from 'react';
import { Router, Switch } from 'react-router-dom';
import {
  Layout as Main,
  NavBar,
  ThemeProvider,
  Loading,
  PrivateRoute,
} from 'components';

import Home from 'pages/Home';
import Agencies from 'pages/Agencies';
import InternalUsers from 'pages/InternalUsers';
import NewAgency from 'pages/NewAgency';
import Agency from 'pages/Agency';
import Clients from 'pages/Clients';

import paths from 'constants/paths';
import history from 'utils/history';

import { useAuth0 } from '@auth0/auth0-react';

const App = () => {
  const auth0 = useAuth0();

  if (auth0.isLoading) {
    return <Loading />;
  }

  return (
    <ThemeProvider>
      <Router history={history}>
        <NavBar />
        <Main>
          <Switch>
            <PrivateRoute path={paths.newAgency} component={NewAgency} />
            <PrivateRoute exact path={paths.agencies} component={Agencies} />
            <PrivateRoute path={paths.agency} component={Agency} />
            <PrivateRoute path={paths.clients} component={Clients} />
            <PrivateRoute
              path={paths.internalUsers}
              component={InternalUsers}
            />
            <PrivateRoute path={paths.home} component={Home} />

            {/* <Route render={() => auth0.loginWithRedirect({})} /> */}
          </Switch>
        </Main>
      </Router>
    </ThemeProvider>
  );
};

export default App;
