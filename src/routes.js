import React from 'react';
import { Router, Route } from 'react-router';
import { Provider } from 'react-redux';
import Chat from './components/chat';
import Members from './components/members';
import AuthorizedLayout from './components/authorized-layout';
import AppContainer from './components/app-container';
import CreateChatChannel from './components/create-chat-channel';
import CreatedChat from './components/created-chat';
import ChatConnector from './components/chat-connector';
import JoinChat from './components/join-chat';

// register SPA routers
export function createRouter(store, history) {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route component={AppContainer} >
          <Route path="/" component={CreateChatChannel} />
          <Route path="channel" component={CreateChatChannel} />
          <Route component={ChatConnector}>
            <Route path="join-channel/:channelName" component={JoinChat} />
            <Route component={AuthorizedLayout} >
              <Route path="channel/:channelName" component={Chat} />
              <Route path="created-channel/:channelName" component={CreatedChat} />
              <Route path="channel/:channelName/members" component={Members} />
            </Route>
          </Route>
        </Route>
      </Router>
    </Provider>
  );
}
