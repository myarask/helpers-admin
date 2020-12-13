import React from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Link,
  Box,
} from '@material-ui/core';
import { useAuth0 } from '@auth0/auth0-react';
import paths from '../constants/paths';

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
    color: 'inherit',
    textDecoration: 'none',
  },
  navButton: {
    width: 'fit-content',
    padding: '0px 30px',
    color: 'inherit',

    '&:': {
      textDecoration: 'none',
    },
  },
});

const NavBar = () => {
  const classes = useStyles();
  const { isAuthenticated, logout } = useAuth0();
  const logoutWithRedirect = () => logout({ returnTo: window.location.origin });

  if (!isAuthenticated) return null;

  return (
    <AppBar position="fixed">
      <Toolbar variant="dense">
        <Typography
          variant="h6"
          className={classes.title}
          component={NavLink}
          to={paths.home}
        >
          Helpers Admin
        </Typography>

        <Link component={NavLink} to={paths.agencies} color="textSecondary">
          <Box mx={1}>Agencies</Box>
        </Link>
        <Link component={NavLink} to={paths.clients} color="textSecondary">
          <Box mx={1}>Clients</Box>
        </Link>
        <Link
          component={NavLink}
          to={paths.internalUsers}
          color="textSecondary"
        >
          <Box mx={1}>Internal Users</Box>
        </Link>

        <Button
          className={classes.navButton}
          onClick={() => logoutWithRedirect()}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
