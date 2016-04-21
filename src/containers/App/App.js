import React, { Component, PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { pushState } from 'redux-router';
import config from '../../config';
require('./App1.scss')


@connect(
  state => ({user: state.auth.user}),
  {logout, pushState})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.string,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState(null, '/configTable');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState(null, '/');
    }
  }

  componentDidMount() {
    const h = $(window).height();
    $('.brand').css('height',h);
  }

  static fetchData(getState, dispatch) {
    const promises = [];
    
    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }
    return Promise.all(promises);
  }

  handleLogout(event) {
    event.preventDefault();
    this.props.logout();
  }

  render() {
    const {user} = this.props;
    const styles = require('./App.scss');

    return (
          <div className={styles.app}>
              <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="/">Mock Data</a>
                        </div>
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav">
                                <li>
                                  <a href="/">首页</a>
                                </li>
                                <li>
                                    <Link to="/leancloud">查询表</Link>
                                </li>
                                <li>
                                    <Link to="/searchClass">REST API</Link>
                                </li>
                                <li>
                                    <Link to="/configTable">配置表</Link>
                                </li>
                                <li>
                                    <Link to="/about">关于我们</Link>
                                </li>
                            </ul>
                            <ul className="nav navbar-nav navbar-right">
                          {!user && <li><Link to="/login">Login</Link></li>}
                          {user && <li className="logout-link"><a href="/logout" onClick={::this.handleLogout}>Logout</a></li>}
                          {user &&
                            <p className={styles.loggedInMessage + ' navbar-text'}>Logged in as <strong>{user}</strong>.</p>}
                        </ul>
                        </div>
                    </div>
                </nav>
              <div className="brand">
                {this.props.children}
              </div>
          </div>
        
    );
  }
}
