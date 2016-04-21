import { AV } from 'avoscloud-sdk';

const QUERY_GET_ID = 'mockdata/query/QUERY_GET_ID';
const QUERY_STORE = 'mockdata/query/QUERY_STORE';
const QUERY_STORE_TABLE = "mockdata/query/QUERY_STORE_TABLE";
const QUERY_GET_DATA = 'mockdata/query/QUERY_GET_DATA';
const QUERY_DELETE_ID = 'mockdata/query/QUERY_DELETE_ID';
const QUERY_GET_TABLES = 'mockdata/query/QUERY_GET_TABLES';
const QUERY_GET_TABLE = 'mockdata/query/QUERY_GET_TABLE';
const QUERY_DELETE_TABLE = 'mockdata/query/QUERY_DELETE_TABLE';
const QUERY_GET_TABLE_NAME = 'mockdata/query/QUERY_GET_TABLE_NAME';
const initialState = {
  loaded: false
};

var Records = AV.Object.extend('records');
var BaseStr = AV.Object.extend('base_str');

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case QUERY_GET_ID:
      return {
        ...state,
        loading: false,
        loaded: true,
        obj: action.payload
      };
    case QUERY_STORE:
    	return {
        ...state,
        loading: false,
        loaded: true,
        obj: action.payload
      };
    case QUERY_STORE_TABLE:
    	return {
		 ...state,
        loading: false,
        loaded: true,
        mockdata: action.payload
    };
    case QUERY_GET_DATA : 
    	return {
        ...state,
        loading: false,
        loaded: true,
        items: action.payload
      };
      case QUERY_GET_TABLES : 
    	return {
        ...state,
        loading: false,
        loaded: true,
        tables: action.payload
      };
      case QUERY_GET_TABLE :
      	return {
        ...state,
        loading: false,
        loaded: true,
        obj: action.payload
      };
      case QUERY_DELETE_ID : 
      return {
      	...state,
        loading: false,
        loaded: true,
        items: action.payload
      };
      case QUERY_DELETE_TABLE : 
      return {
      	...state,
        loading: false,
        loaded: true,
        tables: action.payload
      };
      case QUERY_GET_TABLE_NAME : 
      return {
      	...state,
        loading: false,
        loaded: true,
        table: action.payload
      }
    default:
      return state;
  }
}

//获取用户记录
export function query_get_data(user_id) {
  return dispatch => {
      var query = new AV.Query("records");
      query.equalTo('user_id',user_id);
      query.find({
		  success: function(resp) {
		  	var items = [];
		  	for(var i=0;i<resp.length;i++){
		  		var item = {};
		  		item.Content = resp[i].get('content');
		  		item.Id = resp[i].id;
		  		items.push(item);
		  	}
		  	dispatch({
		  		type : QUERY_GET_DATA,
		  		payload : items
		  	})
		  },
		  error: function(error) {
		    // 失败了.
		  }
		});
        
    }
}

//根据用户取表
export function query_get_tables(user_id){
	return dispatch =>{
		var query = new AV.Query('base_str');
		query.equalTo('user_id',user_id);
		query.find({
			success :  function(resp){
				var tables = [];
				for(var i in resp){
					var item = {};
					item.tableName = resp[i].get('table_name');
					item.Id = resp[i].id;
					item.tableStr = JSON.parse(resp[i].get('table_str'));
					tables.push(item);
				}
				dispatch({
			  		type : QUERY_GET_TABLES,
			  		payload : tables
			  	})
			},
			error : function(error){

			}
		});
	}
}

//根据id取表信息
export function query_get_table(obj_id){
	return dispatch =>{
		var query = new AV.Query("base_str");
		query.get(obj_id,{
			success : function (resp){
				var obj = {};
				obj.tableName = resp.get('table_name');
				obj.Id = resp.id;
				obj.tableStr = resp.get('table_str');
				dispatch({
                  type: QUERY_GET_TABLE,
                  payload: obj
              })
			},
			error :function(){

			}
		});
	}
}

export function query_get_table_name(table_name,user_id){
	return dispatch => {
      var query = new AV.Query("base_str");
      query.equalTo('user_id',user_id);
      query.equalTo('table_name',table_name);
      query.find({
		  success: function(resp) {
		  	var table = {};
		  	table.tableName = resp[0].get('table_name');
		  	table.tableStr = resp[0].get('table_str');
		  	table.Id = resp[0].id;
		  	dispatch({
		  		type : QUERY_GET_TABLE_NAME,
		  		payload : table
		  	})
		  },
		  error: function(error) {
		    // 失败了.
		  }
		});
        
    }
}

//根据id 取出记录详情
export function query_get_id(obj_id){
	return dispatch =>{
		var query = new AV.Query("records");
		query.get(obj_id,{
			success : function (resp){
				var obj = {};
				obj.Content = resp.get('content');
				obj.Id = resp.id;
				dispatch({
                  type: QUERY_GET_ID,
                  payload: obj
              })
			},
			error :function(){

			}
		});
	}
}

//根据删除表详情
export function query_delete_table(objId){
	return dispatch =>{
		const query = new AV.Query('base_str');
		query.get(objId).then(record=>{
			record.destroy()
			dispatch({
				type : QUERY_DELETE_TABLE,
				payload : objId
			})
		});
	}
}

//根据id删除记录详情
export function query_delete_id(objId){
	return dispatch =>{
		const query = new AV.Query('records');
		query.get(objId).then(record=>{
			record.destroy()
			dispatch({
				type : QUERY_DELETE_ID,
				payload : objId
			})
		});
	}
}

//添加记录
export function query_store(content,user_id){
	return dispatch =>{
		var record = new Records();
		record.save({
			'content' : content,
			'user_id' : user_id
		},{
			success : function(resp){
				var obj = {};
				obj.Content = resp.get('content');
				obj.Id = resp.get('Id');
				dispatch({
					type: QUERY_STORE,
                  	payload: obj
				});
			},
			error : function(error){

			}
		});
	}	
}

//添加用户表信息
export function query_store_table(table_name,table_str,user_id){
	return dispatch =>{
		var base_str = new BaseStr();
		base_str.save({
			'table_str' : table_str,
			'user_id' : user_id,
			'table_name' : table_name
		},{
			success : function(resp){
				
				var obj = {};
				obj.tableStr = JSON.parse(resp.get('table_str'));
				obj.Id = resp.id;
				obj.tableName = resp.get('table_name');
				dispatch({
					type: QUERY_STORE_TABLE,
                  	payload: obj
				});
			},
			error : function(error){

			}
		});
	}
	
}