import { combineReducers } from 'redux';
import multireducer from 'multireducer';
import { routerStateReducer } from 'redux-router';

import auth from './auth';
//import counter from './counter';
import {reducer as form} from 'redux-form';
//import info from './info';
//import widgets from './widgets';
import approval from './approval';
import searchClass from './searchClass';
import query from './query';

export default combineReducers({
  router: routerStateReducer,
  auth,
  form,
  approval,
  searchClass,
  query
});

