import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as searchActions from 'redux/modules/searchClass';

require('./SearchClass.scss');
@connect(
  state => ({...state.searchClass}),
  dispatch => bindActionCreators(searchActions, dispatch)
)

export default class SearchClass extends Component {
	static propTypes = {
	    sendAjax: PropTypes.func
	}

	searchCloud(event) {
		const classNameValue = $('#form_control_1').val();
		const limitValue = $.trim($('#form_control_2').val());
		if (limitValue == '') {
			$('#form_control_2').parents('.form-group').addClass('has-error');
			return;
		}
		
		const url = "https:leancloud.cn:443/1.1/classes/" + classNameValue + '?limit=' + limitValue;
		this.props.sendAjax(url, classNameValue, limitValue);
		
	}

	searchCloudSingle() {
		const classNameValue = $('#form_control_3').val();
		const idVlaue = $("#form_control_4").val();
		const url = "https:leancloud.cn:443/1.1/classes/" + classNameValue + "/" + idVlaue;
		this.props.sendAjaxSingle(url, classNameValue, idVlaue); 
	}

	classChange(event) {
		const node = $(event.currentTarget);
		if (node.val() != '') {
			node.parents('.form-group').removeClass('has-error');
		} 
	}

	showPortlet(event) {
		const node = $(event.currentTarget);
		const dataName = node.data('name');
		$("." + dataName).toggle(300);
		if (dataName == 'objectAll') {
			this.props.resetAll();
		} else {
			this.props.resetSingle();
		}
	}

	componentWillMount() {
		$.ajax({
			url: "https:leancloud.cn:443/1.1/classes/records",
			type: 'GET',
			headers: {
				"X-LC-Id": "zq0bXlTNKYqP2fJOjewIGhtm-gzGzoHsz",
				"X-LC-Key": "fzLvwMrXq8s2YCyoBdYJ9aIP"
			},
			contentType: "application/json;charset=utf-8"
		}).done(function(res) {
			this.props.getIdList(res);
		}.bind(this)).fail(function(err) {
		});
	}

	render() {
		const {apiUrl, cloudData, cloudData_ERR, statusCode, apiUrlSingle, cloudDataSingle, cloudData_ERR_Single, statusCodeSingle, idList} = this.props;
		var showData,
			showDataSingle;
		if (statusCode == 200) {
			showData = JSON.stringify(cloudData,null,4);
		} else {
			showData = cloudData_ERR;
		}
		if (statusCodeSingle == 200) {
			showDataSingle = JSON.stringify(cloudDataSingle,null,4);
		} else {
			showDataSingle = cloudData_ERR_Single;
		}
	    return (
			<div className="container seaarchContainer">
				<div className="search-head">
					<h1>REST API</h1>
				</div>
				<hr />
				<h2>API列表</h2>
				<div className="portlet box blue">
					<div className="portlet-title">
						<div className="caption"><span>查询对象</span></div>
						<div className="tools"><a href="javascript:;" className="collapse" data-original-title="" title="" data-name="objectAll" onClick={this.showPortlet.bind(this)}></a></div>
					</div>
					<div className="portlet-body clearfix objectAll">
						<form role="form" className="form-horizontal">
					        <div className="form-body clearfix">
					            <div className="form-group form-md-line-input">
					                <label className="col-md-2 control-label de-form-la">Class Name</label>
					                <div className="col-md-8">
					                    <input name="label" type="text" className="form-control" id="form_control_1" name="field1" placeholder="Class Name" value="records"/>
					                    <div className="form-control-focus">
					                    </div>
					                </div>
					                <div className="data-note" style={{marginTop: '14px',fontSize: '18px',color: 'red'}}>*</div>
					            </div>
					            <div className="form-group form-md-line-input">
					                <label className="col-md-2 control-label de-form-la">Limit</label>
					                <div className="col-md-8">
					                    <input name="label" type="number" className="form-control" id="form_control_2" name="field1" placeholder="Limit" defaultValue="1" onChange={this.classChange}/>
					                    <div className="form-control-focus">
					                    </div>
					                    <span className="help-block">只能为数字</span>
					                </div>
					                <div className="data-note" style={{marginTop: '14px',fontSize: '18px',color: 'red'}}>*</div>
					            </div>
					            <div className="col-md-offset-2 col-md-6">
					            	<button className="btn btn-primary buildBtn1" type="button" onClick={this.searchCloud.bind(this)}>发送请求</button>
					            </div>	
					        </div>
					        <div className="col-md-offset-1 col-sm-10 results">
								{ statusCode == 200 && <div className="response-url"><h4>Request URL</h4><pre className='bg-info url'>{apiUrl}</pre></div>}
								{ showData && <div className="response-body"><h4>Response Body</h4><pre className="code"><code>{showData}</code></pre></div>}
							</div>
						</form>
					</div>
				</div>
				<div className="portlet box blue">
					<div className="portlet-title">
						<div className="caption"><span>查询单个对象</span></div>
						<div className="tools"><a href="javascript:;" className="collapse" data-original-title="" title="" data-name="objectSingle" onClick={this.showPortlet.bind(this)}></a></div>
					</div>
					<div className="portlet-body clearfix objectSingle">
						<form role="form" className="form-horizontal">
					        <div className="form-body clearfix">
					            <div className="form-group form-md-line-input">
					                <label className="col-md-2 control-label de-form-la">Class Name</label>
					                <div className="col-md-8">
					                    <input name="label" type="text" className="form-control" id="form_control_3" name="field1" placeholder="Class Name" value="records"/>
					                    <div className="form-control-focus">
					                    </div>
					                </div>
					                <div className="data-note" style={{marginTop: '14px',fontSize: '18px',color: 'red'}}>*</div>
					            </div>
					            <div className="form-group form-md-line-input">
					                <label className="col-md-2 control-label de-form-la">Id</label>
					                <div className="col-md-8">
					                    <select className="form-control" id="form_control_4">
					                    	<option></option>
					                    	{idList.map(function(ele, index){
									            return <option>{ele}</option>;
									        })}
					                    </select>
					                </div>
					                <div className="data-note" style={{marginTop: '14px',fontSize: '18px',color: 'red'}}>*</div>
					            </div>
					            <div className="col-md-offset-2 col-md-6">
					            	<button className="btn btn-primary buildBtn1" type="button" onClick={this.searchCloudSingle.bind(this)}>发送请求</button>
					            </div>	
					        </div>
					        <div className="col-md-offset-1 col-sm-10 results">
								{ statusCodeSingle == 200 && <div className="response-url"><h4>Request URL</h4><pre className='bg-info url'>{apiUrlSingle}</pre></div>}
								{ showDataSingle && <div className="response-body"><h4>Response Body</h4><pre className="code"><code>{showDataSingle}</code></pre></div>}
							</div>
						</form>
					</div>
				</div>
			</div>
	    );
	}
}
