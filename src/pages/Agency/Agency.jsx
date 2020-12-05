import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { Typography } from '@material-ui/core';
import { useParams, Switch, Route, Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import paths from 'constants/paths';
import AgencyNav from './AgencyNav';
import AgencyDanger from './AgencyDanger';
import AgencyDetails from './AgencyDetails';
import AgencyUsers from './AgencyUsers';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.custom.drawerWidth,
  },
}));

const GET_AGENCY = gql`
  query($id: ID!) {
    agency(id: $id) {
      name
    }
  }
`;

const Agency = () => {
  const { id } = useParams();

  const classes = useStyles();
  const variables = { id };
  const options = { variables };
  const { data, error } = useQuery(GET_AGENCY, options);

  return (
    <>
      <AgencyNav />
      <div className={classes.root}>
        {data && (
          <Typography variant="h1" gutterBottom>
            {data.agency.name}
          </Typography>
        )}
        {error && <Typography color="error">Error</Typography>}

        <Switch>
          <Route path={paths.agencyDetails} component={AgencyDetails} />
          <Route path={paths.agencyUsers} component={AgencyUsers} />
          <Route path={paths.agencyAdvanced} component={AgencyDanger} />
          <Redirect to={paths.agencyDetails} />
        </Switch>
      </div>
    </>
  );
};

export default Agency;
