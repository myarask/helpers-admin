import React from 'react';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Card, CardContent, CardHeader, Chip } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import paths from 'constants/paths';
import { Loading } from 'components';

const GET_AGENCIES = gql`
  query {
    agencies {
      id
      name
    }
  }
`;

const newAgency = (
  <Button component={Link} to={paths.newAgency}>
    New Agency
  </Button>
);

const useStyles = makeStyles((theme) => ({
  agencies: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const Agencies = () => {
  const classes = useStyles();
  const { loading, data } = useQuery(GET_AGENCIES, {
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return <Loading />;
  if (!data) return null;

  return (
    <Card style={{ height: '100%', overflow: 'auto' }}>
      <CardHeader title="Agencies" action={newAgency} />
      <CardContent className={classes.agencies}>
        {data.agencies.map((agency) => (
          <Chip
            color="primary"
            key={agency.id}
            component={Link}
            to={paths.agency.replace(':id', agency.id)}
            label={agency.name}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default Agencies;
