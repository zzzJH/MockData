import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router'

import * as queryActions from 'redux/modules/query';
import {isLoaded as isAuthLoaded, load as loadAuth} from 'redux/modules/auth';
import Mock from 'mockjs';


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
              }
          };

function objInit(obj){
    return $(obj).html('<option>请选择</option>');
}

function jilian(selectF,selectT,selectC){
  $(selectF).change(function(){
      objInit(selectT);
      $.each(arrData,function(pF,pS){
          if($(selectF+' option:selected').text()==pF){
              $.each(pS,function(pT,pC){
                  $(selectT).append('<option>'+pT+'</option>');
              });
          }
      })
  });
}

function dataCheck(data,start,len) {
  var arr = [];
  $.each(data, function (index, ele) {
    var val = $.trim(ele.value);
    var node = $("[name=" + ele.name + "]");
    var pars = node.parents('.form-group');
    if ((index >= start) && (index < start + len)) {
      if (val == '' || val == '请选择') {
          arr.push(ele.name);
      }
    }
    if (index == data.length - 1) {
      if (val == '' || val == '请选择') {
          arr.push(ele.name);
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

function filterBool(name,type,detail) {
    var obj = {};
    if(type=="boolean"){
        obj[name] = "@"+type;
    }else{
        obj[name] = "@"+detail;
    }
    return obj;
}
            

@connect(
    state => ({...state}),
    queryActions)
export default
class BasicTable extends Component {
  static propTypes = {
    user: PropTypes.string,
    logout: PropTypes.func
  }
  
  static fetchDataDeferred(getState,dispatch) {
    if (!isAuthLoaded(getState())) {
      return dispatch(loadAuth());
    }
  }
  componentDidMount(){
      $.each(arrData,function(pF){
          $('#selF').append('<option>'+pF+'</option>');
      });
      jilian('#selF','#selT');
  }

  buildData(){
      var count = $("input[name='countData']").val();
      var tableName = $("#table_name").val();  //随机生成的数目
      
      var data = JSON.parse(JSON.stringify($(".makeTable").serializeArray()));
      var data1;
      var endData;
      if(count=='1'){
          if (!dataCheck(data,0,3)) {
            return;
          }
          data1 = data.slice(0, 3);
          endData = filterBool(data1[0].value,data1[1].value,data1[2].value);
      }
      if(count=='2'){
          if (!dataCheck(data,0,6)) {
            return;
          }
          data1 = data.slice(0, 6);
          var data2 = filterBool(data1[0].value,data1[1].value,data1[2].value);
          var data3 = filterBool(data1[3].value,data1[4].value,data1[5].value);
          for(var tem in data3){
            data2[tem]=data3[tem];
          }
          endData = data2;
      }
      if(count=='3'){
          if (!dataCheck(data,0,9)) {
            return;
          }
          data1 = data.slice(0, 9);
          var data2 = filterBool(data1[0].value,data1[1].value,data1[2].value);
          var data3 = filterBool(data1[3].value,data1[4].value,data1[5].value);
          var data4 = filterBool(data1[6].value,data1[7].value,data1[8].value);
          for(var tem in data3){
            data2[tem]=data3[tem];
          }
          for(var i in data2){
            data4[i]=data2[i];
          }

          endData = data4;
      }
      var newArr = JSON.stringify(endData);
      var {userId} = this.props.auth;
      this.props.query_store_table(tableName,newArr,userId);
      this.props.query_get_tables(userId);
      $("#mockNew").slideDown();
      if ($(document.body).width() >= 1200) $(document.body).scrollTop(0);
  }
  buildAnyData1(){
    $(".field1").slideDown();
    $(".buildBtn1").css("display",'none');
    $.each(arrData,function(pF){
          $('#selF1').append('<option>'+pF+'</option>');
    });
    jilian('#selF1','#selT1');
    $("input[name='countData']").val(2);
  }
  buildAnyData2(){
    $(".field2").slideDown();
    $(".buildBtn2").css("display",'none');
    $.each(arrData,function(pF){
        $('#selF2').append('<option>'+pF+'</option>');
    });
    jilian('#selF2','#selT2');
    $("input[name='countData']").val(3);
  }
  changeTableClass(event) {
    const node = $(event.currentTarget);
    if ((node.val() != '请选择') || (node.val() != '')){
      node.parents('.form-group').removeClass('has-error');
    } 
  }
  render() {
    const {user} = this.props.auth;
    const {mockdata} = this.props.query;
    const jsonItems = JSON.stringify(mockdata,null,4);

    return (user &&
      <div className="container">
          <div className="starter" style={{padding: '100px 15px',float:'left',textAlign:'center',width:'540px'}}>
            <input type="hidden" value="1" name="countData" />
            <div className="search-head"><h1>构建基本表结构</h1></div>
            <form role="form" className="form-horizontal makeTable">
              <div className="portlet light bg-inverse">
                <div className="form-body">
                  <div className="form-group form-md-line-input">
                      <label className="col-md-3 control-label de-form-la">字段名</label>
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
                        <select id="selF" name="selF1" className="form-control" onChange={this.changeTableClass}>
                            <option>请选择</option>
                        </select>
                    </div>
                  </div>
                  <div className="form-group form-md-line-input">
                      <label className="col-md-3 control-label de-form-la">详细类型</label>
                      <div className="col-md-9">
                        <select id="selT" name="detail1" className="form-control" onChange={this.changeTableClass}><option>请选择</option></select>
                    </div>
                  </div>
                  <button className="btn btn-primary buildBtn1" type="button" onClick={this.buildAnyData1}>继续生成数据</button>
                </div>
              </div>
              <div className="portlet light bg-inverse field1">
                <div className="form-body ">
                  <div className="form-group form-md-line-input">
                      <label className="col-md-3 control-label de-form-la">字段名</label>
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
                        <select id="selF1" name="selF2" className="form-control" onChange={this.changeTableClass}>
                            <option>请选择</option>
                        </select>
                    </div>
                  </div>
                  <div className="form-group form-md-line-input">
                      <label className="col-md-3 control-label de-form-la">详细类型</label>
                      <div className="col-md-9">
                        <select id="selT1" name="detail2" className="form-control" onChange={this.changeTableClass}><option>请选择</option></select>
                    </div>
                  </div>
                </div>
                  <button className="btn btn-primary buildBtn2" type="button" onClick={this.buildAnyData2}>继续生成数据</button>
              </div>
              <div className="portlet light bg-inverse field2">
                <div className="form-body">
                  <div className="form-group form-md-line-input">
                      <label className="col-md-3 control-label de-form-la">字段名</label>
                      <div className="col-md-8">
                          <input name="label" type="text" className="form-control" id="form_control_3" name="field3" placeholder="" onChange={this.changeTableClass}/>
                          <div className="form-control-focus">
                          </div>
                          <div className="data-note2" style={{marginTop: '-25px',marginLeft: '331px',fontSize: '18px',color: 'red'}}>*</div>
                      </div>
                  </div>
                  <div className="form-group form-md-line-input">
                      <label className="col-md-3 control-label de-form-la">字段类型</label>
                      <div className="col-md-9">
                        <select id="selF2" name="selF3" className="form-control" onChange={this.changeTableClass}>
                            <option>请选择</option>
                        </select>
                    </div>
                  </div>
                  <div className="form-group form-md-line-input">
                      <label className="col-md-3 control-label de-form-la">详细类型</label>
                      <div className="col-md-9">
                        <select id="selT2" name="detail3" className="form-control" onChange={this.changeTableClass}><option>请选择</option></select>
                    </div>
                  </div>
                </div>
              </div>
                <div className="form-group form-md-line-input">
                      <label className="col-md-3 control-label de-form-la">表名</label>
                      <div className="col-md-9">
                          <input name="label" type="text" className="form-control" id="table_name" placeholder="" onChange={this.changeTableClass}/>
                          <div className="form-control-focus">
                          </div>
                      </div>
                </div>
                <div className="form-actions">
                  <div className="row">
                    <div className="col-md-offset-3 col-md-7">
                        <button className="btn btn-primary" type="button" onClick={this.buildData.bind(this)}>生成基础表</button>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <a className="btn btn-primary" href="/configTable">
                            构建表 <i className="m-icon-swapright m-icon-white" style={{backgroundImage:'url("http://metronic.beisen.co/theme/assets/global/img/syncfusion-icons-white.png")'}}></i>
                            </a>
                    </div>
                  </div>
                </div>
              </form>
              
          </div>
          <div id="mockNew" style={{width:'500px',padding: '166px 15px',float:'left',display:'none'}}>
              <pre>
                  <code style={{boxShadow:'none',border:'0'}}>{jsonItems}</code>
              </pre>
          </div>
      </div>
    );
  }
}
