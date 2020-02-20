import axios from 'axios';
import { all, call, put, takeLatest, fork } from 'redux-saga/effects'
import { message, notification } from 'antd';
import {
    ADD_ACCOUNT,
    EDIT_ACCOUNT, 
    DELETE_ACCOUNT, 
    CHANGE_LOADING,
    GET_TOTAL_DATA, 
    GET_CATEGORIES,
    TOTAL_DATA_FETCHED,
    CATEGORIES_FETCHED, 
    ACCOUNT_ADDED, 
    ACCOUNT_EDITED, 
    ACCOUNT_DELETED, 
} from '../../util/account'
import { 
    CHECK_IF_EXISTED, 
    ALREADY_EXISTED,
    USER_LOGIN,
    USER_REGISTER,
    LOGIN_SUCCESS,
    SET_VISIBLE,
    CHANGE_LOGIN_LOADING,
} from '../../util/app'

//sagas
function *register({ payload }) {
    yield put({ type: CHANGE_LOGIN_LOADING, loading: true })
    try {
        yield call(axios.post, '/users', payload)
        yield fork(message.success, '注册成功')
        yield put({ type: SET_VISIBLE, visible: false })
    } catch(e) {
        //message和notification都有延时，需要无阻塞
        yield fork(notification.error, {
            message: '出错了，请稍后再试', 
            description: e.message
        })
    } finally {
        yield put({ type: CHANGE_LOGIN_LOADING, loading: false })
    }
}

function *logIn({ payload: {phone, password}}) {
    yield put({ type: CHANGE_LOGIN_LOADING, loading: true })
    try {
        const { data } = yield call(axios.get, `/users?phone=${phone}&password=${password}`);
        if (data.length === 1) {
            const account = data[0];
            yield put({ 
                type: LOGIN_SUCCESS, 
                visible: false,
                loggedIn: true,
                userInfo: { username: account.username } 
            }) //应返回用户相关的数据
            yield fork(message.success, '登录成功')
            yield put({ type: SET_VISIBLE, visible: false })
        } else {
            yield fork(message.error, '用户名或密码错误')
        }
    } catch (e) {
        yield fork(notification.error, {
            message: '出错了，请稍后再试', 
            description: e.message
        })
    } finally {
        yield put({ type: CHANGE_LOGIN_LOADING, loading: false })
    }
}

function *checkIfExisted({ payload: phone }) {
    const { data } = yield call(axios.get, `/users?phone=${phone}`);
    if (data.length > 0) {
        yield put({ type: ALREADY_EXISTED, alreadyExisted: true })
    } else {
        yield put({ type: ALREADY_EXISTED, alreadyExisted: false })
    }
}

function *getCategories() {
    let categories;
    yield put({ type: CHANGE_LOADING, loading: true })
    try {
        categories = yield call(axios.get, '/categories')
        yield put({ type: CATEGORIES_FETCHED, categories: categories.data })
    } catch(e) {
        //message和notification都有延时，需要无阻塞
        yield fork(notification.error, {
            message: '出错了，请稍后再试', 
            description: e.message
        })
    } finally {
        yield put({ type: CHANGE_LOADING, loading: false })
    }
}

function *getTotalData() {
    let items, categories;
    yield put({ type: CHANGE_LOADING, loading: true })
    try {
        [ items, categories ] = yield all([call(axios.get, '/items'), call(axios.get, '/categories')])
        yield put({ type: TOTAL_DATA_FETCHED, items: items.data, categories: categories.data })
    } catch(e) {
        yield fork(notification.error, {
            message: '数据获取失败', 
            description: e.message
        })
    } finally {
        yield put({ type: CHANGE_LOADING, loading: false })
    }
}

function *addAccount({ payload: { item, history } }) {
    let newItem;
    yield put({ type: CHANGE_LOADING, loading: true })
    try {
        newItem = yield call(axios.post, '/items', item)
        yield put({ type: ACCOUNT_ADDED, item: newItem.data }) //id由后端传过来
        yield fork(message.success, '添加成功')
        yield call(history.push, '/life-apps/account-book')
    } catch (e) {
        yield fork(notification.error, {
            message: '添加失败', 
            description: e.message
        })
    } finally {
        yield put({ type: CHANGE_LOADING, loading: false })
    }
}

function *editAccount({ payload: { item, history } }) {
    let updatedItem;
    yield put({ type: CHANGE_LOADING, loading:  true })
    try {
        updatedItem = yield call(axios.put, `/items/${item.id}`, item)
        yield put({ type: ACCOUNT_EDITED, item: updatedItem.data })
        yield fork(message.success, '修改成功')
        yield call(history.push, '/life-apps/account-book')
    } catch (e) {
        yield fork(notification.error, {
            message: '修改失败', 
            description: e.message
        })
    } finally {
        yield put({ type: CHANGE_LOADING, loading: false })
    }
}

function *deleteAccount({ payload: { id } }) {
    yield put({ type: CHANGE_LOADING, loading: true })
    try {
        yield call(axios.delete, `/items/${id}`)
        yield put({ type: ACCOUNT_DELETED, id })
        yield fork(message.success, '删除成功')
    } catch (e) {
        yield fork(notification.error, {
            message: '删除失败', 
            description: e.message
        })
    } finally {
        yield put({ type: CHANGE_LOADING, loading: false })
    }
}

export function *sagaMonitor() {
    //匹配generator之前，会尝试同步从reducer中返回state
    yield takeLatest(ADD_ACCOUNT, addAccount);
    yield takeLatest(EDIT_ACCOUNT, editAccount);
    yield takeLatest(DELETE_ACCOUNT, deleteAccount);
    yield takeLatest(GET_TOTAL_DATA, getTotalData);
    yield takeLatest(GET_CATEGORIES, getCategories);
    yield takeLatest(USER_LOGIN, logIn);
    yield takeLatest(USER_REGISTER, register)
    yield takeLatest(CHECK_IF_EXISTED, checkIfExisted)
}
