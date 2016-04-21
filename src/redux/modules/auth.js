import Immutable from 'immutable';
import { AV } from 'avoscloud-sdk'



const LOAD = 'redux-example/auth/LOAD';
const LOAD_SUCCESS = 'redux-example/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/auth/LOAD_FAIL';
const LOGIN = 'redux-example/auth/LOGIN';
const LOGIN_SUCCESS = 'redux-example/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'redux-example/auth/LOGIN_FAIL';
const LOGOUT = 'redux-example/auth/LOGOUT';
const LOGOUT_SUCCESS = 'redux-example/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'redux-example/auth/LOGOUT_FAIL';

const initialState = {
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        user: action.payload,
        userId:action.userId
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.errorNote
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load() {
  // return {
  //   types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
  //   promise: (client) => client.get('/loadAuth')
  // };
   var name = window.document.cookie || null;
   return {
    type:LOAD_SUCCESS,
    result:name
   }
}

export function login(name,pwd) {
  return dispatch => {
      AV.User.logIn(name, pwd, {
          success: function(user) {
            // 成功了，现在可以做其他事情了.
            var userId = user.id;
            var username = user.get("username");
         
            //console.log(userId);
            window.document.cookie = name;
            dispatch({
                  type: LOGIN_SUCCESS,
                  payload: username,
                  userId:userId
              })

          },
          error: function(user, error) {
            var error_note = "用户名或密码错误！"
            // 失败了.
            dispatch({
                  type: LOGIN_FAIL,
                  errorNote: error_note
              })
          }
    });
        
    }
}

// export function login(name) {
//   return {
//     types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
//     promise: (client) => client.post('/login', {
//       data: {
//         name: "aaa"
//       }
//     })
//   };
// }

export function logout() {
  return dispatch =>{
      AV.User.logOut();
      dispatch({
              type: LOGOUT_SUCCESS,
              payload: ""
          })
  }
}
