//import { fromJS } from 'immutable'
import Immutable from 'immutable';
import { AV } from 'avoscloud-sdk'

var Approval = AV.Object.extend('Approval');
var Fields = AV.Object.extend('Fields');
var FormData = AV.Object.extend('FormData');
var FormField = AV.Object.extend('FormField');

const LOAD_SUCCESS = 'approval/LOAD_SUCCESS';
const CHANGE_FILTER = 'approval/CHANGE_FILTER';
const CHANGE_PAGE = 'approval/CHANGE_PAGE';
const VAGUE_QUERY = 'approval/VAGUE_QUERY';
const SHOW_SUCCESS = 'approval/SHOW_SUCCESS';
const LOADFORM_SUCCESS = 'approval/LOADFORM_SUCCESS';
const APPR_DATA_FILTER = 'approval/APPR_DATA_FILTER';
const GET_ACTIVE = 'approval/GET_ACTIVE';
const CREATE_SUCCESS = 'approval/CREATE_SUCCESS';
const CREATE_DEPLOY = 'approval/CREATE_DEPLOY';
const INITIAL_LOAD = 'approval/INITIAL_LOAD';
const HIDE_ACTIVE = 'approval/HIDE_ACTIVE';

const PER_PAGE = 5

const QUERY_RULES = {
    'all':[],
    'qj':[
        {
            method:'equalTo',
            params:['applyType', '请假审批']
        }
    ],
    'cg':[
        {
            method:'equalTo',
            params:['applyType', '采购审批']
        }
    ],
    'fromme':[
        {
            method:'equalTo',
            params:['launcher', 'fromme']
        }
    ],
    'mecheck':[
        {
            method:'equalTo',
            params:['launcher', 'mecheck']
        }
    ],
    'tome':[
        {
            method:'equalTo',
            params:['launcher', 'tome']
        }
    ],
    'processing':[
        {
            method:'equalTo',
            params:['status', 2]
        }
    ],
    'rejected':[
        {
            method:'equalTo',
            params:['status', 3]
        }
    ],
    'passed':[
        {
            method:'equalTo',
            params:['status', 4]
        }
    ]
};

const initialState = Immutable.fromJS({
    loaded: false,
    active: false,
    total: 0,
    page: 0,
    perPage: PER_PAGE,
    items: [],
    details:{},
    formlist:[],
    queries: [],
    filter:'all',
    apprComData: [{
        name:'我发起的',id:'fromme'
    },{
        name:'我审批的',id:'mecheck'
    },{
        name:'抄送我的',id:'tome'
    },{
        name:'全部审批',id:'all'
    }]
    })

export default function reducer(state = initialState, action = {}) {
    const payload = action.payload;
    switch (action.type) {
        case CREATE_SUCCESS:
           state = state.set('filter', 'all');
        case LOAD_SUCCESS:
            state = state.update('items', v => Immutable.fromJS(payload.items) )
            state = state.set('total', Math.ceil(payload.total/PER_PAGE))
            state = state.set('page', 0);
            return state;
        case CHANGE_FILTER:
            state = state.update('items', v => Immutable.fromJS(payload.items) )
            state = state.set('total', Math.ceil(payload.total/PER_PAGE))
            state = state.set('page', 0);
            return state.set('filter', payload.filter)
        case CHANGE_PAGE:
            state = state.update('items', v => Immutable.fromJS(payload.items) );
            state = state.set('total', Math.ceil(payload.total/PER_PAGE));
            state = state.set('page', payload.page);
            return state;
        case VAGUE_QUERY:
            state = state.update('items', v => Immutable.fromJS(payload.items) )
            state = state.set('total', Math.ceil(payload.total/PER_PAGE))
            state = state.set('page', 0);
            return state;
        case SHOW_SUCCESS:
            state = state.update('details', v => Immutable.fromJS(payload) );
            return state;
        case LOADFORM_SUCCESS:
            state = state.update('formlist', v => Immutable.fromJS(payload) );
            return state;
        case CREATE_DEPLOY:
            state = state.update('formlist', v => Immutable.fromJS(payload) );
            return state;
        case INITIAL_LOAD:
            state = state.update('items', v => Immutable.fromJS(payload.items) )
            state = state.set('total', Math.ceil(payload.total/PER_PAGE))
            state = state.set('page', 0);
            return state;
        case APPR_DATA_FILTER:

            // var od = state.get('apprComData');
            // od.filter(function(v, key) {
            //    console.log(v._root.entries[0]);
            //     return v.get('name') == '我发起的';
            //   })
            // console.log(od);
            //state = state.map('apprComData',v => (v.get('name') == action.value));
            state = state.update('apprComData', v => v.filter(item =>  item.get('name') == '我发起的') );
            //console.log(state);
            return state
        case GET_ACTIVE:
            state = state.set('active',!state.get('active'));
            return state;
        case HIDE_ACTIVE:
            state = state.set('active',false);
            return state;
        default:
            return state;
    }
}

function fetchDataList(cb, page=0, queryRules=[]){
    const query = new AV.Query(Fields)
    queryRules.forEach(rule => {
        query[rule.method].apply(query, rule.params)
    });
    query.descending("createdAt")
    query.select('name','applyType','reason','createdAt','status')
    query.skip(PER_PAGE*page)
    query.limit(PER_PAGE)

    const countQuery = new AV.Query(Fields)
    queryRules.forEach(rule => {
        countQuery[rule.method].apply(countQuery, rule.params)
    });
    AV.Promise.when(query.find(), countQuery.count()).then((records, total)=>{
        let items = records.map(record =>({
            id: record.getObjectId(),
            name: record.get('name'),
            applyType: record.get('applyType'),
            reason:record.get('reason'),
            status:record.get('status').toString(),
            createdAt:record.createdAt.toLocaleDateString()
        }));
        cb(items, total)
    })

}
function fetchFormList(cb){
    const query = new AV.Query(FormField)
    AV.Promise.when(query.find()).then((results)=>{
        let items = results.map(result =>({
            id:result.getObjectId(),
            type: result.get('type'),
            label: result.get('label'),
            fieldname: result.get('fieldname'),
            value:result.get('value'),
            required:result.get('required'),
            classname:result.get('classname'),
            options:result.get('options')
        }));  
        cb(items)
    })

}

export function isLoaded(globalState) {
    return globalState.approval && globalState.approval.loaded;
}

export function load(queries){
    return dispatch => {
        fetchDataList( (items,total) => {
            dispatch({
                type: LOAD_SUCCESS,
                payload: {items,total}
            })
        })
    }
}

export function changeFilter(filter){
  return dispatch => {
    const queryRules = QUERY_RULES[filter]
    fetchDataList((items, total) => {
      dispatch({
        type: CHANGE_FILTER,
        payload: {
          items,
          filter,
          total
        }
      })
    }, 0, queryRules)
  }
}

export function changePage(page){
  return (dispatch,getState) => {
    const filter = getState().approval.get('filter')
    const queryRules = QUERY_RULES[filter]
    fetchDataList( (items,total) => {
      dispatch({
        type: CHANGE_PAGE,
        payload: {items,total,page}
      })
    }, page, queryRules)
  }
}

export function vagueQuery(param){
    return (dispatch,getState) => {
        const filter = getState().approval.get('filter')
        const queryRules = [{method:'contains',params:['name', param]}];
        fetchDataList((items, total) => {
          dispatch({
            type: VAGUE_QUERY,
            payload: {
              items,
              filter,
              total
            }
          })
        }, 0, queryRules)    
    }
}

//显示每条数据的详情
export function showAlldata(param){
   return function(dispatch) {
       const query = new AV.Query(Fields);
       query.get(param, {
           success: function (results) {
            var items = {};
            items.name = results.get('name');
            items.applyType = results.get('applyType');
            items.reason = results.get('reason');
            items.qjType = results.get('qjType');
            items.other = results.get('other');
            items.notes = results.get('notes');
            items.createAt = results.createdAt.toLocaleDateString();
            items.days = results.get('days');
            items.startTime = results.get('startTime').toLocaleString();
            items.endTime = results.get('endTime').toLocaleString();
            items.approvers = results.get('approvers');
            if(results.get('attachment')){
                items.attachment = results.get('attachment')._name;
            }
            dispatch({
               type: SHOW_SUCCESS,
               payload: items
            });
            results.set('visited',true);
            results.save();
           }
       });
   }
}

//根据地址中的不同参数获取构造表单的不同数据
export function loadForm() {
   return function (dispatch) {
      fetchFormList(items=>{
            dispatch({
                type: LOADFORM_SUCCESS,
                payload: items
            })
        })
   }
}

export function createData(data,file,filename) {
   return function (dispatch) {
       var newObj = new Fields();
       if(file){
            var avFile = new AV.File(filename, file);
            newObj.set('attachment',avFile);
       }
       newObj.save({
           'name':data.name,
           'applyType':data.applyType,
           'visited':data.visited,
           'reason':data.reason,
           'status':data.status,
           'launcher':data.launcher,
           'qjType':data.qjType,
           'startTime':data.startTime,
           'endTime':data.endTime,
           'approvers':data.approvers,
            'cc':data.cc,
            'days':data.days,
            'content':data.content
       }).then(record => {
        fetchDataList( (items,total) => {
            dispatch({
                type: CREATE_SUCCESS,
                payload: {items,total}
            })
        })
       })
   }
}

export function handleDeploy(data) {
    return function (dispatch) {
        new FormField().save({
            'value':data.value,
            'type':data.type,
            'label':data.label,
            'required':data.required,
            'fieldname':'content'
        }).then(records => {
            fetchFormList(items=>{
              dispatch({
                  type: CREATE_DEPLOY,
                  payload: items
              })
            })
            
        })
    }
}

export function apprDataFilter(inputValue) {
   return (
      {
        type: APPR_DATA_FILTER,
        value: inputValue
      }
    )
}

export function changeActive() {
   return {type:GET_ACTIVE};
}

export function hideActive() {
   return {type:HIDE_ACTIVE};
}

export function initalData(){
    return dispatch => {
        var Fields = AV.Object.extend('Fields');
        var FormField = AV.Object.extend('FormField');

        var base64 = "6K+077yM5L2g5Li65LuA5LmI6KaB56C06Kej5oiR77yf";

        AV.Object.saveAll(
          [
            {
                fieldname:'applyType',type:'statictext',label:'审批类型',value:'请假审批',classname:'',required:'false'
            },
            {
                fieldname:'id',type:'idgrow',label:'编号',value:'',classname:'',required:'false'
            },
            {
                fieldname:'reason',type:'textarea',label:'申请理由',value:'',classname:'',required:'false'
            },
            {
                fieldname:'qjType',type:'select',label:'请假类型',value:'',classname:'',required:'',
                options:[{"sign": 1,"note": "请假","selected": "selected"},{"sign": 2,"note": "事假","selected": ""}]
            },
            {
                fieldname:'days',type:'textinput',label:'请假天数',value:'',classname:'',required:'false'
            },
            {
                fieldname:'startTime',type:'selectdate',label:'开始时间',value:'',classname:'',required:'',
                options:[{"sign": 1,"note": new Date(),"selected": "selected"},{"sign": 2,"note": new Date(),"selected": ""}]
            },
            {
                fieldname:'endTime',type:'selectdate',label:'结束时间',value:'',classname:'',required:'',
                options:[{"sign": 1,"note": new Date(),"selected": "selected"},{"sign": 2,"note": new Date(),"selected": ""}]
            },
            {
                fieldname:'approvers',type:'inputWithButton',label:'审批人',value:'',classname:'s-input-btn',required:''
            },
            {
                fieldname:'cc',type:'textinput',label:'抄送人',value:'',classname:'pop-form-input',required:''
            },
            {
                fieldname:'attachment',type:'file',label:'附件',value:'',classname:'',required:''
            }
          ].map(field => new FormField(field)));

        AV.Object.saveAll(
          [
            { name:"小王",reason:"外出",applyType:"请假审批",launcher:"mecheck",status:2,visited:false,
              startTime:new Date(),endTime:new Date(),days:7,cc:"一一",approvers:'果果',content:'',
              qjType:'事假',notes:'无',other:"无",attachment:new AV.File("myfile.txt", { base64: base64 })
            },
            { name:"小何",reason:"外出",applyType:"请假审批",launcher:"mecheck",status:3,visited:false,
              startTime:new Date(),endTime:new Date(),days:3,cc:"小七",approvers:'果果',content:'',
              qjType:'事假',notes:'无',other:"无",attachment:new AV.File("aa.txt", { base64: base64 })
            },
            { name:"小美",reason:"出差",applyType:"请假审批",launcher:"mecheck",status:3,visited:false,
              startTime:new Date(),endTime:new Date(),days:4,cc:"大大",approvers:'果果',content:'',
              qjType:'事假',notes:'无',other:"无",attachment:new AV.File("bb.txt", { base64: base64 })
            },
            { name:"小及",reason:"休假",applyType:"请假审批",launcher:"mecheck",status:3,visited:false,
              startTime:new Date(),endTime:new Date(),days:2,cc:"米米",approvers:'小小',content:'',
              qjType:'事假',notes:'无',other:"无",attachment:new AV.File("test.txt", { base64: base64 })
            },
            { name:"小伊",reason:"生病",applyType:"请假审批",launcher:"mecheck",status:4,visited:false,
              startTime:new Date(),endTime:new Date(),days:6,cc:"果果",approvers:'小小',content:'',
              qjType:'事假',notes:'无',other:"无",attachment:new AV.File("mytest.txt", { base64: base64 })
            },
            { name:"大值",reason:"采购",applyType:"采购审批",launcher:"mecheck",status:4,visited:false,
              startTime:new Date(),endTime:new Date(),days:5,cc:"常常",approvers:'小小',content:'',
              qjType:'事假',notes:'无',other:"无",attachment:new AV.File("myfile.txt", { base64: base64 })
            },
            { name:"北森",reason:"购置办公用品",applyType:"采购审批",launcher:"mecheck",status:4,visited:false,
              startTime:new Date(),endTime:new Date(),days:1,cc:"红红",approvers:'果果',content:'',
              qjType:'事假',notes:'无',other:"无",attachment:new AV.File("mytest.txt", { base64: base64 })
            },
            { name:"果果",reason:"拜访客户",applyType:"请假审批",launcher:"mecheck",status:2,visited:false,
              startTime:new Date(),endTime:new Date(),days:1,cc:"米米",approvers:'小小',content:'',
              qjType:'事假',notes:'无',other:"无",attachment:new AV.File("mytest.txt", { base64: base64 })
            }
              
          ].map( data => new Fields(data)))
            .then(records => {
            fetchFormList((items,total)=>{
              dispatch({
                  type: INITIAL_LOAD,
                  payload: {items,total}
              })
            })
            
        })  
           
    }
}




