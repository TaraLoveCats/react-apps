import { combineReducers } from 'redux';
import { 
    ACCOUNT_ADDED, 
    ACCOUNT_EDITED, 
    ACCOUNT_DELETED, 
    CHANGE_LOADING, 
    TOTAL_DATA_FETCHED,
    CATEGORIES_FETCHED, 
    SET_CURRENT_ID
} from '../../util/account'

const accounts = (state = [], action) => {
    switch (action.type) {
        case TOTAL_DATA_FETCHED:
            return action.items
        case ACCOUNT_ADDED:
            return [ ...state, { ...action.item, id: action.id }]
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

const currentAccountId = (state = null, action) => {
    switch (action.type) {
        case SET_CURRENT_ID:
            console.log(action)
            return action.id ? action.id : null
        default:
            return state
    }
}

const categories = (state = [], action) => {
    switch (action.type) {
        case TOTAL_DATA_FETCHED:
        case CATEGORIES_FETCHED:
            return action.categories
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
    currentAccountId,
    loading,
})

export default accountApp;