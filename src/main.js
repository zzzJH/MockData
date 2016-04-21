/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/lib/createBrowserHistory';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import io from 'socket.io-client';
import {Provider} from 'react-redux';
import {reduxReactRouter, ReduxRouter} from 'redux-router';

import getRoutes from './routes';
import makeRouteHooksSafe from './helpers/makeRouteHooksSafe';

import { AV } from 'avoscloud-sdk'
AV.initialize(__LC_APP_ID__, __LC_APP_KEY__);

const client = new ApiClient();

window.__data = require('./data.json');


// TODO: inline styles and remove global $
// require('styles/index.scss');
//require('../app/styles/index.scss');
window.$ = require('jquery');

window.dd = function (){
  console.log.apply(console, arguments);
}

const dest = document.getElementById('content');
const store = createStore(reduxReactRouter, makeRouteHooksSafe(getRoutes), createHistory, client, window.__data);

function initSocket() {
  const socket = io('', {path: '/api/ws', transports: ['polling']});
  socket.on('news', (data) => {
    console.log(data);
    socket.emit('my other event', { my: 'data from client' });
  });
  socket.on('msg', (data) => {
    console.log(data);
  });

  return socket;
}

// global.socket = initSocket();

const component = (
  <ReduxRouter routes={getRoutes(store)} />
);

ReactDOM.render(
  <Provider store={store} key="provider">
    {component}
  </Provider>,
  dest
);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}

if (__DEVTOOLS__) {
  const DevTools = require('./containers/DevTools/DevTools');
  ReactDOM.render(
    <Provider store={store} key="provider">
      <div>
        {component}
        <DevTools />
      </div>
    </Provider>,
    dest
  );
}


