const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const makeModels = require('helpers-database/models/_make');
const createAuth0 = require('./createAuth0');
const authConfig = require('../src/auth_config.json');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const directives = require('./directives');
const config = require('./config');

const models = makeModels(config);
const app = express();

const port = process.env.API_PORT || 3001;
const origin = process.env.REACT_APP_APP_URL || 'http://localhost:3000';

if (!authConfig.domain || !authConfig.audience) {
  throw new Error(
    'Please make sure that auth_config.json is in place and populated'
  );
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  directiveResolvers: directives.directiveResolvers,
});

const init = async () => {
  const auth0 = await createAuth0();

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => ({
      models,
      user: req.user,
      auth0,
    }),
  });

  // Unprotected Routes
  app.get('/api/users/:auth0Id/apps', async (req, res) => {
    const { auth0Id } = req.params;

    try {
      const user = await models.User.findOne({
        where: {
          auth0Id,
        },
        include: [models.InternalUser, models.AgencyUser],
      });
      res.send({
        admin: !!user.InternalUser,
        agency: !!(user.AgencyUsers || []).length,
      });
    } catch (e) {
      console.error(e);
      res.send({
        admin: false,
        agency: false,
      });
    }
  });

  app.use(morgan('dev'));
  app.use(helmet());
  app.use(cors({ origin }));
  app.use(
    jwt({
      secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
      }),

      audience: authConfig.audience,
      issuer: `https://${authConfig.domain}/`,
      algorithm: ['RS256'],
    })
  );
  server.applyMiddleware({ app, path: '/api/graphql' });

  app.listen(port, () => {
    console.log(`API Server listening on port ${port}`);
  });
};

init();
