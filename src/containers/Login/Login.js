import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DocumentMeta from 'react-document-meta';
import * as authActions from 'redux/modules/auth';
import {isLoaded as isAuthLoaded, load as loadAuth} from 'redux/modules/auth';


@connect(
  state => ({user: state.auth.user}),
  dispatch => bindActionCreators(authActions, dispatch)
)
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.string,
    login: PropTypes.func,
    logout: PropTypes.func
  }
  // static fetchData(store) {
  //   if (!isAuthLoaded(store.getState())) {
  //     return store.dispatch(loadAuth());
  //   }
  // }

  handleSubmit(event) {
      var inputText = $('input[type="text"]').val();
      var inputPassword = $('input[type="password"]').val();
      this.props.login(inputText,inputPassword);
  }

  render() {
    const {user, logout} = this.props;
    const {loginError} = this.props;
    const styles = require('./Login.scss');
    const logoImage = require('./logo.png');
    return (
      <div className="loginPage">
        <DocumentMeta title="Login"/>
        {!user &&
         <div id="boxes-wrapper" className="boxes-wrapper">
            <div className="error-box">{loginError?loginError:null}</div>
            <div className="loading-box">
                <div className="inner-table">
                    <div className="inner-cell">
                        Doing my job ...
                    </div>
                </div>
            </div>
            <div className="login-box">
              <div className="header">
                  <span>Login</span>
              </div>
              <div className="content">
                <div className="input-group">
                  <label>用户名</label>
                  <input type="text" placeholder="" required ref="username"/>
                </div>
                <div className="input-group password-group">
                  <label>密码</label>
                  <input type="password" placeholder="12345678" ref="pwd" required />
                </div>
                <div className="input-group">
                  <input type="submit" value="Login" onClick={this.handleSubmit.bind(this)}/>
                </div>
              </div>
              <div className="footer-password">
                <div className="question">
                    LOGIN
                </div>
                <div className="button back-login">
                    Back to the Login
                </div>
              </div>
          </div>
        </div>
      }
      </div>
    );
  }
}
