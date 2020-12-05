import React from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  main: {
    position: 'absolute',
    top: 50,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'auto',
    padding: theme.spacing(3),
  },
}));

const Layout = ({ children }) => {
  const classes = useStyles();

  return <main className={classes.main}>{children}</main>;
};

export default Layout;
