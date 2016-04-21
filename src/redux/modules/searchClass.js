import Immutable from 'immutable';

const GET_SUCCESS = 'redux-example/searchClass/GET_SUCCESS';
const GET_ERROR = 'redux-example/searchClass/GET_ERROR';
const GET_SUCCESS_SINGLE = 'redux-example/searchClass/GET_SUCCESS_SINGLE';
const GET_ERROR_SINGLE = 'redux-example/searchClass/GET_ERROR_SINGLE';
const RESET_DATA = 'redux-example/searchClass/RESET_DATA';
const RESET_DATA_SINGLE = 'redux-example/searchClass/RESET_DATA_SINGLE';
const GET_ID_LIST = 'redux-example/searchClass/GET_ID_LIST';

const headers = {
    "X-LC-Id": "zq0bXlTNKYqP2fJOjewIGhtm-gzGzoHsz",
    "X-LC-Key": "fzLvwMrXq8s2YCyoBdYJ9aIP"
};

const initialState = {
    apiUrl: '',
    cloudData: '',
    cloudData_ERR: '',
    statusCode: 0,
    apiUrlSingle: '',
    cloudDataSingle: '',
    cloudData_ERR_Single: '',
    statusCodeSingle: 0,
    idList: []
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case GET_SUCCESS:
            const responseJSON = action.cloudData.results;
            const url = "GET http://localhost:3000/api?class=" + action.query['pathname'] + '&limit=' + action.query['limit'];
            console.log(url)
            return {
                ...state,
                cloudData: responseJSON,
                apiUrl: url,
                statusCode: 200
            };
        case GET_ERROR:
            const resContent = action.errData.responseJSON['error'];
            return {
                ...state,
                cloudData_ERR: resContent,
                statusCode: 404
            };
        case GET_SUCCESS_SINGLE:
            const responseJSONSingle = action.cloudData;
            if (responseJSONSingle.objectId == undefined) {
                return {
                    ...state,
                    cloudData_ERR_Single: "Id不存在",
                    statusCodeSingle: 404
                };
            } else {
                const urlSingle = "GET http://localhost:3000/api?class=" + action.query['pathname'] + '&id=' + action.query['id'];
                return {
                    ...state,
                    cloudDataSingle: responseJSONSingle,
                    apiUrlSingle: urlSingle,
                    statusCodeSingle: 200
                };
            }
        case GET_ERROR_SINGLE:
            const resContentSingle = action.errData['statusText'];
            return {
                ...state,
                cloudData_ERR_Single: resContentSingle,
                statusCodeSingle: 404
            };
        case RESET_DATA:
            return {
                ...state,
                cloudData: '',
                cloudData_ERR: '',
                apiUrl: '',
                statusCode: 0
            };
        case RESET_DATA_SINGLE:
            return {
                ...state,
                cloudDataSingle: '',
                cloudData_ERR_Single: '',
                apiUrlSingle: '',
                statusCodeSingle: 0
            };
        case GET_ID_LIST:
            var ids = action.idData.results;
            var idArray = [];
            $.each(ids, function(index, el) {
                idArray.push(el.objectId);
            });
            return {
                ...state,
                idList: idArray
            }
        default:
            return state
    }
}

export function sendAjax(data, pathnameValue, limitValue) {
    return dispatch => {
        $.ajax({
            method: "GET",
            url: data,
            headers: headers,
            contentType: "application/json;charset=utf-8"
        }).done(function(res) {
            dispatch({
                type: GET_SUCCESS,
                cloudData: res,
                query: {
                    pathname: pathnameValue,
                    limit: limitValue
                }
            })
        }).fail(function (err) {
            dispatch({
                type: GET_ERROR,
                errData: err
            })
        });
    }
}

export function sendAjaxSingle(data, pathnameValue, idValue) {
    return dispatch => {
        $.ajax({
            url: data,
            type: 'GET',
            headers: headers,
            contentType: "application/json;charset=utf-8"
        }).done(function(res) {
            dispatch({
                type: GET_SUCCESS_SINGLE,
                cloudData: res,
                query: {
                    pathname: pathnameValue,
                    id: idValue
                }
            })
        }).fail(function(err) {
            console.log(err)
            dispatch({
                type: GET_ERROR_SINGLE,
                errData: err
            })
        });
    }
}

export function resetAll() {
    return dispatch => {
        dispatch({
            type: RESET_DATA
        })
    }
}

export function resetSingle() {
    return dispatch => {
        dispatch({
            type: RESET_DATA_SINGLE
        })
    }
}

export function getIdList(data) {
    return dispatch => {
        dispatch({
            type: GET_ID_LIST,
            idData: data
        })
    }
}