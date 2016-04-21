import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router'
import * as authActions from 'redux/modules/auth';
import * as queryAction from 'redux/modules/query';
import {isLoaded as isAuthLoaded, load as loadAuth} from 'redux/modules/auth';

import Mock from 'mockjs';
require('./ConfigTable.scss');

var arrData={
              'string':{
                'string':'无','name':'无','cname':'无','email':'无','url':'无','id':'无',
                'domain':'无','color':'无','county':'无'
              },
              'number':{
                  natural:'无',
                  integer:'无',
                  'float':'无'
              },
              'date':{
                  'datetime':'无',
                  'time':'无',
                  'date':'无'
              },
              'boolean':{
                无:'无'
              },
              'array':{
                '关联已有表结构':'无'
              }
          };
function mockdata(name,type,detail) {
    var str;
    if(type=="boolean"){
        str='{'+name+':"@"+type}';
    }else if(type=="array"){
        return "array";
    }else{
        str='{'+name+':"@"+detail}';
    }
    var obj = eval("("+str+")");
    var data = Mock.mock(obj)
    return data;
}

function objInit(obj){
    return $(obj).html('<option>请选择</option>');
}

function jilian(selectF,selectT,selectC){
  $(selectF).change(function(){
      objInit(selectT);
      objInit(selectC);
      $.each(arrData,function(pF,pS){
          if($(selectF+' option:selected').text()==pF){
              $.each(pS,function(pT,pC){
                  $(selectT).append('<option>'+pT+'</option>');
              });
              $(selectT).change(function(){
                  objInit(selectC);
                  $.each(pS,function(pT,pC){
                      if($(selectT+' option:selected').text()==pT){
                          $.each(pC.split(","),function(){
                              $(selectC).append('<option>'+this+'</option>');
                          })
                      }
                  })
                  
              });
          }
      })
  });
}
function getMockData(data,tables,table_name,count){
    
    var tables_config = JSON.parse(JSON.stringify(tables));
    var table_obj = {};
    $.map(tables_config,function(config){
        if(config.tableName == table_name){
            table_obj = config;
        }
    });
    var table_str = table_obj ? table_obj.tableStr : "";
    var obj = {};
    var name = data[(count-1)*5].value+'|'+data[(count-1)*5+4].value;
    obj[name] = [table_str];
    var content = Mock.mock(obj);
    return content;
}

function dataCheck(data,start,len) {
  var arr = [];
  $.each(data, function (index, ele) {
    if ((index >= start) && (index < start + len)) {
      var val = $.trim(ele.value);
      var node = $("[name=" + ele.name + "]");
      var pars = node.parents('.form-group');
      if (val == '' || val == '请选择') {
        if (pars.css('display') != 'none') {
          arr.push(ele.name);
        }
      }
    }
  });
  $.each(arr, function (index, ele) {
    var node = $("[name=" + ele + "]");
    var pars = node.parents('.form-group');
    pars.addClass('has-error');
  });

  if (arr.length == 0) {
    return true;
  } else {
    return false;
  }
}

@connect(
    state => ({...state}),
    queryAction)
export default
class ConfigTable extends Component {
  static propTypes = {
    user: PropTypes.string,
    logout: PropTypes.func
  }
  // static fetchDataDeferred(getState,dispatch) {
  //   if (!isAuthLoaded(getState())) {
  //     return dispatch(loadAuth());
  //   }
  // }
  componentDidMount(){
      $.each(arrData,function(pF){
          $('#selF').append('<option>'+pF+'</option>');
      });
      jilian('#selF','#selT','#selC');
      const {userId} = this.props.auth;
      this.props.query_get_tables(userId);
  }
  
  buildData(){
      var count = $("input[name='countData']").val();//随机生成的数目
      var data = JSON.parse(JSON.stringify($(".configData").serializeArray()));
      var data1;
      var endData;
      if(count=='1'){
        if (!dataCheck(data,0,5)) {
          return;
        }
          var table_name = $.trim(data[3].value);
          endData = JSON.parse(JSON.stringify(mockdata(data[0].value,data[1].value,data[2].value)));
          if(endData=="array"){
              var tables_config = JSON.parse(JSON.stringify(this.props.query.tables));
              var content = getMockData(data,tables_config,table_name,1);
              $('#configMock').show(300);
              $('.show1 code').html(JSON.stringify(content,null,4));
              this.props.query_store(JSON.stringify(content),'5694d00d60b24909ebc9f03e');
          }else{
             $('#configMock').show(300); 
             $('.show1 code').html(JSON.stringify(endData,null,4));
          }
      }
      if(count=='2'){
        if (!dataCheck(data,0,10)) {
          return;
        }
          var data2 = JSON.parse(JSON.stringify(mockdata(data[0].value,data[1].value,data[2].value)));
          var data3 = JSON.parse(JSON.stringify(mockdata(data[5].value,data[6].value,data[7].value)));
         
          if(data2 =='array'){
            var tables_config = JSON.parse(JSON.stringify(this.props.query.tables));
            var table_name = data[3].value;
            var content1 = getMockData(data,tables_config,table_name,1);
          }else{
            var content1 = data2;
          }
          if(data3 =='array'){

            var tables_config = JSON.parse(JSON.stringify(this.props.query.tables));
            var table_name = data[8].value;
            var content2 = getMockData(data,tables_config,table_name,2);;
          }else{
            var content2 = data3;
          }
          var content3 = $.extend(content1,content2);
          $('#configMock').show(300);
          $('.show1 code').html(JSON.stringify(content3,null,4));
          this.props.query_store(JSON.stringify(content3),'5694d00d60b24909ebc9f03e');
      }
      if(count =='3'){
        if (!dataCheck(data,0,15)) {
          return;
        }
          var data2 = JSON.parse(JSON.stringify(mockdata(data[0].value,data[1].value,data[2].value)));
          var data3 = JSON.parse(JSON.stringify(mockdata(data[5].value,data[6].value,data[7].value)));
          var data4 = JSON.parse(JSON.stringify(mockdata(data[10].value,data[11].value,data[12].value)));
          
          if(data2 =='array'){
            var tables_config = JSON.parse(JSON.stringify(this.props.query.tables));
            var table_name = data[3].value;
            var content1 =  getMockData(data,tables_config,table_name,1);
          }else{
            var content1 = data2;
          }
          if(data3 =='array'){
            var tables_config = JSON.parse(JSON.stringify(this.props.query.tables));
            var table_name = data[8].value;
            var content2 = getMockData(data,tables_config,table_name,2);
          }else{
            var content2 = data3;
          }
          if(data4 =='array'){
            var tables_config = JSON.parse(JSON.stringify(this.props.query.tables));
            var table_name = data[8].value;
            var content3 = getMockData(data,tables_config,table_name,3);;
          }else{
            var content3 = data4;
          }
          var content4 = $.extend(content1,content2,content3);
          $("#mockNew").slideDown();
          $('#configMock').show(300);
          $('.show1 code').html(JSON.stringify(content4,null,4));
          this.props.query_store(JSON.stringify(content4),'5694d00d60b24909ebc9f03e');
      }
      if ($(document.body).width() >= 1200) $(document.body).scrollTop(0);
  }
  buildAnyData1(){
    $(".field1").slideDown();
    $(".buildBtn1").css("display",'none');
    $.each(arrData,function(pF){
          $('#selF1').append('<option>'+pF+'</option>');
    });
    jilian('#selF1','#selT1','#selC1');
    $("input[name='countData']").val(2);
  }
  buildAnyData2(){
    $(".field2").slideDown();
    $(".buildBtn2").css("display",'none');
    $.each(arrData,function(pF){
        $('#selF2').append('<option>'+pF+'</option>');
    });
    jilian('#selF2','#selT2','#selC2');
    $("input[name='countData']").val(3);
  }
  
  changeArrayClass(event) {
    const node = $(event.currentTarget);
    if (node.val() != '请选择') {
      node.parents('.form-group').removeClass('has-error');
    }
    const par = node.parents('.form-group');
    if (node.val() == 'array') {
      par.siblings('.hasTable, .itemCount').show(300);
    } else {
      par.siblings('.hasTable, .itemCount').hide(300);
    }
  }

  changeTableClass(event) {
    const node = $(event.currentTarget);
    if ((node.val() != '请选择') || (node.val() != '')){
      node.parents('.form-group').removeClass('has-error');
    } 
  }

  render() {
    const {user} = this.props.auth;
    const {tables} = this.props.query;
    return (user &&
      <div className="container">
          <input type="hidden" value="1" name="countData" />
          <div className="starter" style={{padding: '100px 15px',float:'left',textAlign:'center',width:'540px'}}>
            <div className="alert alert-danger" style={{display:"none"}}></div>
            <div className="search-head"><h1>配置表</h1></div>
            <form role="form" className="form-horizontal configData">
              <div className="portlet light bg-inverse">
                <div className="form-body">
                  <div className="form-group form-md-line-input">
                      <label className="col-md-3 control-label de-form-la">展示名称</label>
                      <div className="col-md-8">
                          <input name="label" type="text" className="form-control" id="form_control_1" name="field1" placeholder="必填项" onChange={this.changeTableClass}/>
                          <div className="form-control-focus">
                          </div>
                      </div>
                      <div className="data-note" style={{marginTop: '14px',fontSize: '18px',color: 'red'}}>*</div>
                  </div>
                  <div className="form-group form-md-line-input">
                      <label className="col-md-3 control-label de-form-la">字段类型</label>
                      <div className="col-md-9">
                        <select id="selF" name="selF" className="form-control" onChange={this.changeArrayClass}>
                            <option>请选择</option>
                        </select>
                    </div>
                  </div>
                  <div className="form-group form-md-line-input">
                      <label className="col-md-3 control-label de-form-la">详细类型</label>
                      <div className="col-md-9">
                        <select id="selT" name="selT" className="form-control" onChange={this.changeTableClass}><option>请选择</option></select>
                    </div>
                  </div>
                  <div className="form-group form-md-line-input hasTable">
                      <label className="col-md-3 control-label de-form-la">已有表</label>
                      <div className="col-md-9">
                        <select name="tablename1" className="form-control" onChange={this.changeTableClass}>
                        <option>请选择</option>
                        {tables && tables.map(i=>(
                          <option>{i.tableName}</option>))}
                        </select>
                    </div>
                  </div>
                  <div className="form-group form-md-line-input itemCount">
                    <label className="col-md-3 control-label de-form-la">数量</label>
                    <div className="col-md-9">
                      <input type="text" className="form-control" id="random_name" name="randomnumber1" onChange={this.changeTableClass}/>
                      <div className="form-control-focus">
                          </div>
                    </div>
                  </div>
                  
                  <button className="btn btn-primary buildBtn1" type="button" onClick={this.buildAnyData1}>继续生成数据</button>

                </div>
              </div>
              <div className="portlet light bg-inverse field1">
                <div className="form-body ">
                  <div className="form-group form-md-line-input">
                      <label className="col-md-3 control-label de-form-la">展示名称</label>
                      <div className="col-md-8">
                          <input name="label" type="text" className="form-control" id="form_control_2" name="field2" placeholder="" onChange={this.changeTableClass}/>
                          <div className="form-control-focus">
                          </div>
                          <div className="data-note1" style={{marginTop: '-25px',marginLeft: '331px',fontSize: '18px',color: 'red'}}>*</div>
                      </div>
                  </div>
                  <div className="form-group form-md-line-input">
                      <label className="col-md-3 control-label de-form-la">字段类型</label>
                      <div className="col-md-9">
                        <select id="selF1" name="selF1" className="form-control" onChange={this.changeArrayClass}>
                            <option>请选择</option>
                        </select>
                    </div>
                  </div>
                  <div className="form-group form-md-line-input">
                      <label className="col-md-3 control-label de-form-la">详细类型</label>
                      <div className="col-md-9">
                        <select id="selT1" name="selT1" className="form-control" onChange={this.changeTableClass}><option>请选择</option></select>
                    </div>
                  </div>
                  <div className="form-group form-md-line-input hasTable">
                      <label className="col-md-3 control-label de-form-la">已有表</label>
                      <div className="col-md-9">
                        <select name="tablename2" className="form-control" onChange={this.changeTableClass}>
                        <option>请选择</option>
                        {tables && tables.map(i=>(
                          <option>{i.tableName}</option>))}
                        </select>
                    </div>
                  </div>
                  <div className="form-group form-md-line-input itemCount">
                    <label className="col-md-3 control-label de-form-la">数量</label>
                    <div className="col-md-9">
                        <input type="text" className="form-control" id="random_name" name="randomnumber2" onChange={this.changeTableClass}/>
                        <div className="form-control-focus">
                          </div>
                    </div>
                  </div>
                </div>
                  <button className="btn btn-primary buildBtn2" type="button" onClick={this.buildAnyData2}>继续生成数据</button>
              </div>
              <div className="portlet light bg-inverse field2">
                <div className="form-body">
                  <div className="form-group form-md-line-input">
                      <label className="col-md-3 control-label de-form-la">展示名称</label>
                      <div className="col-md-8">
                          <input name="label" type="text" className="form-control" id="form_control_3" name="field3" placeholder="" onChange={this.changeTableClass} />
                          <div className="form-control-focus">
                          </div>
                          <div className="data-note2" style={{marginTop: '-25px',marginLeft: '331px',fontSize: '18px',color: 'red'}}>*</div>
                      </div>
                  </div>
                  <div className="form-group form-md-line-input">
                      <label className="col-md-3 control-label de-form-la">字段类型</label>
                      <div className="col-md-9">
                        <select id="selF2" name="selF2" className="form-control" onChange={this.changeArrayClass}>
                            <option>请选择</option>
                        </select>
                    </div>
                  </div>
                  <div className="form-group form-md-line-input">
                      <label className="col-md-3 control-label de-form-la">详细类型</label>
                      <div className="col-md-9">
                        <select id="selT2" name="selT2" className="form-control" onChange={this.changeTableClass}><option>请选择</option></select>
                    </div>
                  </div>
                  <div className="form-group form-md-line-input hasTable">
                      <label className="col-md-3 control-label de-form-la">已有表</label>
                      <div className="col-md-9">
                        <select name="tablename3" className="form-control" onChange={this.changeTableClass}>
                        <option>请选择</option>
                        {tables && tables.map(i=>(
                          <option>{i.tableName}</option>))}
                        </select>
                    </div>
                  </div>
                  <div className="form-group form-md-line-input itemCount">
                    <label className="col-md-3 control-label de-form-la">数量</label>
                    <div className="col-md-9">
                        <input type="text" className="form-control" id="random_name" name="randomnumber3" onChange={this.changeTableClass}/>
                        <div className="form-control-focus">
                          </div>
                    </div>
                  </div>
                </div>
                </div>
                <div className="form-actions">
                  <div className="row">
                    <div className="col-md-offset-1 col-md-4">
                       <Link className="btn btn-primary" to="/basicTable">
                          新建表结构 <i className="m-icon-swapright m-icon-white" style={{backgroundImage:'url("http://metronic.beisen.co/theme/assets/global/img/syncfusion-icons-white.png")'}}></i>
                        </Link>
                    </div>
                    <div className="col-md-offset-1 col-md-4">
                        <button className="btn btn-primary" type="button" onClick={this.buildData.bind(this)}>生成数据</button>
                    </div>

                  </div>
                </div>
              </form>

          </div>
          <div id="configMock" style={{width:'500px',padding: '166px 15px',float:'left',display:'none'}} className="show1">
              <pre><code></code></pre>
          </div>
      </div>
    );
  }
}
