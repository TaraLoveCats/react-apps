export const generateID = () => {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9)
}

export const id2TypeAndIconName = (categories) => {
    return categories.reduce((map, item) => {
      map[item.id] = {
          type: item.type,
          iconName: item.iconName,
          name: item.name
      };
      return map;
    }, {})
}

export const SET_CURRENT_ID = 'SET_CURRENT_ID'
export const ADD_ACCOUNT = 'ADD_ACCOUNT'
export const EDIT_ACCOUNT = 'EDIT_ACCOUNT'
export const DELETE_ACCOUNT = 'DELETE_ACCOUNT'
export const CHANGE_LOADING = 'CHANGE_LOADING'
export const GET_TOTAL_DATA = 'GET_TOTAL_DATA'
export const GET_CATEGORIES = 'GET_CATEGORIES'
export const TOTAL_DATA_FETCHED = 'TOTAL_DATA_FETCHED'
export const CATEGORIES_FETCHED = 'CATEGORIES_FETCHED'
export const ACCOUNT_ADDED = 'ACCOUNT_ADDED'
export const ACCOUNT_EDITED = 'ACCOUNT_EDITED'
export const ACCOUNT_DELETED = 'ACCOUNT_DELETED'
export const USER_LOGIN = 'USER_LOGIN'
export const USER_REGISTER = 'USER_REGISTER'
export const CHANGE_LOGIN_LOADING = 'CHANGE_LOGIN_LOADING'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const SET_VISIBLE = 'SET_VISIBLE'