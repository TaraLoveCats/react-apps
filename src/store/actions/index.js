import { generateID } from '../../util'
import axios from 'axios';

export const ADD_ACCOUNT = 'ADD_ACCOUNT';
export const EDIT_ACCOUNT = 'EDIT_ACCOUNT';
export const DELETE_ACCOUNT = 'DELETE_ACCOUNT';
export const CHANGE_LOADING = 'CHANGE_LOADING';
export const GET_TOTAL_DATA = 'GET_TOTAL_DATA';
export const GET_CURRENT_DATA = 'GET_CURRENT_DATA';

//action creators
const changeLoading = loading => ({
    type: CHANGE_LOADING,
    loading
})

//thunk action creators
export const getTotalData = () => async dispatch => {
    dispatch(changeLoading(true));
    const [ items, categories ] = await Promise.all([ axios.get('/items'), axios.get('/categories') ]);
    dispatch({
        type: GET_TOTAL_DATA,
        items: items.data,
        categories: categories.data
    });
    dispatch(changeLoading(false));
}

export const getCurrentData = (id) => async (dispatch, getState) => {
    if (getState().categories.length > 0) { 
        dispatch({
            type: GET_CURRENT_DATA,
            item: id ? getState().accounts.filter(item => item.id === id)[0] : getState().currentAccount,
            categories: getState().categories,
        })
    } else { 
        //直接刷新新增页面，需要请求categories, id存在还需要请求对应数据
        dispatch(changeLoading(true));
        const promiseArr = [id ? axios.get(`/items/${id}`) : Promise.resolve()];
        promiseArr.push(axios.get('/categories'));
        const [ item, categories ] = await Promise.all(promiseArr);
        dispatch({
            type: GET_CURRENT_DATA,
            item: id ? item.data : getState().currentAccount,
            categories: categories.data
        })
        dispatch(changeLoading(false));
    }

}

export const addAccount = item => async dispatch => {
    dispatch(changeLoading(true));
    const newItem = await axios.post('/items', item);
    dispatch({
        type: ADD_ACCOUNT,
        id: generateID(),
        item: newItem.data
    })
    dispatch(changeLoading(false));
}

export const editAccount = item => async dispatch => {
    dispatch(changeLoading(true));
    const updatedItem = await axios.put(`/items/${item.id}`, item);
    dispatch({
        type: EDIT_ACCOUNT,
        item: updatedItem.data
    })
    dispatch(changeLoading(false));
}

export const deleteAccount = id => async dispatch => {
    dispatch(changeLoading(true));
    axios.delete(`/items/${id}`);
    dispatch({
        type: DELETE_ACCOUNT,
        id
    })
    dispatch(changeLoading(false));
}