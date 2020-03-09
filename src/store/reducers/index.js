import { combineReducers } from 'redux';
import { 
    ACCOUNT_ADDED, 
    ACCOUNT_EDITED, 
    ACCOUNT_DELETED, 
    CHANGE_LOADING, 
    TOTAL_DATA_FETCHED,
    CATEGORIES_FETCHED, 
    SET_CURRENT_ID,
} from '../../util/account'
import { 
    ALREADY_EXISTED,
    CHANGE_LOGIN_LOADING,
    LOGIN_SUCCESS,
    SET_VISIBLE
} from '../../util/app'

function accounts(state = [], action) {
    switch (action.type) {
        case TOTAL_DATA_FETCHED:
            return action.items
        case ACCOUNT_ADDED:
            return [ ...state, { ...action.item }]
        case ACCOUNT_EDITED:
            return state.map(item => 
                item.id === action.item.id ? action.item : item
            )
        case ACCOUNT_DELETED:
            return state.filter(item => item.id !== action.id)
        default:
            return state
    }
}

function currentAccountId(state = null, action) {
    switch (action.type) {
        case SET_CURRENT_ID:
            return action.id ? action.id : null
        default:
            return state
    }
}

function categories(state = [], action) {
    switch (action.type) {
        case TOTAL_DATA_FETCHED:
        case CATEGORIES_FETCHED:
            return action.categories
        default:
            return state
    }
}

function loading(state = false, action) {
    switch (action.type) {
        case CHANGE_LOADING:
            return action.loading
        default:
            return state
    }
}

function loginLoading(state = false, action) {
    switch (action.type) {
        case CHANGE_LOGIN_LOADING:
            return action.loading
        default:
            return state
    }
}

function userInfo(state = {}, action) {
    switch(action.type) {
        case LOGIN_SUCCESS:
            return action.userInfo
        default:
            return state
    }
}

function modalVisible(state = false, action) {
    switch(action.type) {
        case SET_VISIBLE:
        case LOGIN_SUCCESS:
            return action.visible
        default: 
            return state
    }
}

function loggedIn(state = false, action) {
    switch(action.type) {
        case LOGIN_SUCCESS:
            return action.loggedIn
        default:
            return state
    }
}

function alreadyExisted(state = false, action) {
    switch(action.type) {
        case ALREADY_EXISTED:
            return action.alreadyExisted
        default:
            return state
    }
}

const accountApp = combineReducers({
    accounts,
    categories,
    currentAccountId,
    loading,
    loginLoading,
    userInfo,
    modalVisible,
    loggedIn,
    alreadyExisted
})

export default accountApp;