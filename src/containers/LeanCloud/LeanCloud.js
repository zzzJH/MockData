import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DocumentMeta from 'react-document-meta';
import {query_get_tables} from 'redux/modules/query';
import * as queryActions from 'redux/modules/query';
require('./LeanCloud.scss')

@connect(
  state => ({...state}),
  dispatch => bindActionCreators(queryActions, dispatch)
)
export default class LeanCloud extends Component {
  static fetchDataDeferred(getState,dispatch) {
      const {userId} = getState().auth;
      return dispatch(query_get_tables(userId));
  }
  handleDelete(event){
    this.props.query_delete_table(event.target.id);
  } 
  
  render() {  
    const {tables} = this.props.query;
    const colorArr = ["green","red","blue"];
    
    return (
      <div style={{paddingTop:'50px',marginTop:'60px',marginLeft:'280px'}}>
        <div className="row">
            <div className="col-md-9">
                <div style={{fontSize:'30px',textAlign:'center',marginBottom:'15px'}}>基础表结构展示</div>
            </div>
        </div>
          <div className="row">
              <div className="col-md-offset-1 col-md-7">
                <div className="portlet light">
                    <div className="portlet-body">
                      <div className="todo-tasklist">
                      {tables && tables.map((i,index)=>
                          <div className={"todo-tasklist-item todo-tasklist-item-border-"+colorArr[index]}>
                              <div className="todo-tasklist-item-title">
                                   表名：{i.tableName}
                              </div>
                              <div className="todo-tasklist-item-text">
                                  表结构：
                                  <pre>
                                    <code style={{boxShadow:'none',border:'0'}}>
                                        {JSON.stringify(i.tableStr,null,4)}
                                     </code>
                                   </pre>
                              </div>
                              <div className="todo-tasklist-controls pull-left">
                                  <span className="todo-tasklist-date"><i className="fa fa-calendar"></i></span>
                                  <span className="todo-tasklist-badge badge badge-roundless" id={i.Id} onClick={this.handleDelete.bind(this)}>delete</span>
                              </div>
                          </div>
                        )
                    }
                      </div>
                </div>
            </div>
        </div>
    </div>
      </div>
    );
  }
}
