import React from 'react';
import { Typography } from '@material-ui/core';
import { useAuth0 } from '@auth0/auth0-react';

const Home = () => {
  const { user } = useAuth0();

  return (
    <>
      <Typography variant="h1">Home</Typography>

      {user && (
        <p>
          <>You are logged in as </>
          <strong>{user.name}</strong>
          <> and your nickname is </>
          <strong>{user.nickname}</strong>
        </p>
      )}
    </>
  );
};

export default Home;
