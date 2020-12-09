import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { useAuth0 } from '@auth0/auth0-react';

const Unauthorized = () => {
  const { logout } = useAuth0();
  return (
    <>
      <Typography>This account is not permitted to access this app</Typography>
      <Button variant="contained" onClick={logout}>
        Log in with different account
      </Button>
    </>
  );
};

export default Unauthorized;
