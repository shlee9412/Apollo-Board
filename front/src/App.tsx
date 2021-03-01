import React from 'react';
import { HttpLink, ApolloClient, InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from './pages/Login';
import Main from './pages/Main';
import Regist from './pages/Regist';
import Write from './pages/Write';
import Modify from './pages/Modify';
import SelectedPost from './pages/SelctedPost';

const link = new HttpLink({ uri: 'http://localhost:4000/gql' });
const client = new ApolloClient({ link, cache: new InMemoryCache() });

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/regist' component={Regist}/>
        <Route exact path='/' component={Main}/>
        <Route exact path='/write' component={Write}/>
        <Route exact path='/modify' component={Modify}/>
        <Route exact path='/post/:postIdx' render={props => <SelectedPost {...props}/>}/>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
