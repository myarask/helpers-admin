import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import paths from 'constants/paths';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: theme.custom.drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    top: 50,
    width: theme.custom.drawerWidth,
  },
}));

const AgencyNav = () => {
  const { id } = useParams();
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      anchor="left"
      open
      classes={{ paper: classes.drawerPaper }}
    >
      <List component="nav" aria-label="secondary mailbox folders">
        <ListItem
          button
          component={NavLink}
          to={paths.agencyDetails.replace(':id', id)}
        >
          <ListItemText primary="Details" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to={paths.agencyUsers.replace(':id', id)}
        >
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to={paths.agencyAdvanced.replace(':id', id)}
        >
          <ListItemText primary="Advanced" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default AgencyNav;
