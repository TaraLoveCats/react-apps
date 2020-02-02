import { combineReducers } from 'redux';
import moment from 'moment';
import { ADD_ACCOUNT, EDIT_ACCOUNT, DELETE_ACCOUNT, CHANGE_LOADING, GET_TOTAL_DATA, GET_CURRENT_DATA } from '../actions'

const accounts = (state = [], action) => {
    switch (action.type) {
        case GET_TOTAL_DATA:
            return action.items
        case ADD_ACCOUNT:
            return [ ...state, { id: action.id, ...action.item }]
        case EDIT_ACCOUNT:
            return state.map(item => 
                item.id === action.item.id ? action.item : item
            )
        case DELETE_ACCOUNT:
            return state.filter(item => item.id !== action.id)
        default:
            return state
    }
}

const currentAccount = (
    state={ 
        title: '', 
        price: 0, 
        date: moment().format('YYYY-MM-DD'), 
        note: '', 
        cid: null 
    }, 
    action
) => {
    switch (action.type) {
        case GET_CURRENT_DATA:
            return action.item
        default:
            return state
    }
}

const categories = (state = [], action) => {
    switch (action.type) {
        case GET_TOTAL_DATA:
        case GET_CURRENT_DATA:
            return action.categories
        default:
            return state
    }
}

//衍生结构
const id2TypeAndIconName = (state = {}, action) => {
    switch (action.type) {
        case GET_TOTAL_DATA:
        case GET_CURRENT_DATA:
            const id2TypeAndIconName= action.categories.reduce((map, item) => {
                map[item.id] = {
                    type: item.type,
                    iconName: item.iconName,
                    name: item.name
                };
                return map;
            }, {})
            return id2TypeAndIconName
        default:
            return state
    }
}

const loading = (state = false, action) => {
    switch (action.type) {
        case CHANGE_LOADING:
            return action.loading
        default:
            return state
    }
}

const accountApp = combineReducers({
    accounts,
    categories,
    currentAccount,
    id2TypeAndIconName,
    loading
})

export default accountApp;