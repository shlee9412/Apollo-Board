require('dotenv').config();
import { ApolloServer } from 'apollo-server-express';
import express, { Application } from 'express';
import { createServer } from 'http';
import path from 'path';
import { postResolvers, postTypeDefs } from './gql/post';
import { userInfoResolvers, userInfoTypeDefs } from './gql/userInfo';
import query from './gql/_query';

const PORT = process.env.PORT || 4000;

const app: Application = express();
const server = createServer(app);

const apolloServer = new ApolloServer({
  typeDefs: [
    query,
    userInfoTypeDefs,
    postTypeDefs
  ],
  resolvers: [
    userInfoResolvers,
    postResolvers
  ]
});
apolloServer.applyMiddleware({ app, path: '/gql' });

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.resolve(__dirname, '..', 'public')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`> http://localhost:${PORT}${apolloServer.graphqlPath}`);
});