import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, IndexLink } from 'react-router';

const NavbarLink = ({to, className, component, children}) => {
    const Comp = component || Link;

    return (
        <Comp to={to} className={className} activeStyle={{
      color: '#33e0ff'
    }}>
            {children}
        </Comp>
    );
};

@connect(
        state => ({user: state.auth.user})
)
export default class Home extends Component {
    render() {
        const {user} = this.props;
        return (
            <div>

                <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="#">Mock Data</a>
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

                <header className="header-image">
                    <div className="headline">
                        <div className="container">
                            <h1>Mock Data</h1>
                            <h2>For Engineer</h2>
                            <a className="btn btn-primary start" href="/about">ABOUT US</a>
                        </div>
                    </div>
                </header>

                <div className="container">

                    <hr className="featurette-divider"/>
                    <div className="featurette" id="about">
                        <img className="featurette-image img-responsive pull-right" src="http://i.imgur.com/l1mKM7M.png" />
                        <h2 className="featurette-heading" style={{marginTop:'100px'}}>操作一：
                            <span className="text-muted">配置复杂表</span>
                        </h2>
                        <p className="lead">登陆后自动跳至配置页面，选择复杂类型Array，将其关联至已创建的基本表结构，配置页面如图所示。</p>
                    </div>

                    <hr className="featurette-divider"/>

                    <div className="featurette" id="services">
                        <img className="featurette-image img-responsive pull-left" src="http://i.imgur.com/ZS3d3YT.png" />
                        <h2 className="featurette-heading" style={{marginTop:'100px'}}>第二步：
                            <span className="text-muted">已构造的复杂数据</span>
                        </h2>
                        <p className="lead">第一步生成的数据如右所示。  </p>
                    </div>

                    <hr className="featurette-divider"/>

                    <div className="featurette" id="contact">
                        <h2 className="featurette-heading" style={{marginTop:'0px'}}>第三步：
                            <span className="text-muted">REST API</span>
                        </h2>
                        <p className="lead">点击标题栏中的REST API，即可根据配置来获取数据的URL.</p>
                        <img className="featurette-image img-responsive pull-right" src="http://i.imgur.com/R1EsEEp.png" />
                    </div>

                    <hr className="featurette-divider"/>

                    <footer>
                        <div className="row">
                            <div className="col-lg-12">
                                <p>Copyright --前端架构组--超能全栈队</p>
                            </div>
                        </div>
                    </footer>

                </div>
            </div>
        );
    }
}
