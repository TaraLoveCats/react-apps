import axios from 'axios';
import { all, call, put, takeLatest, fork } from 'redux-saga/effects'
import { message, notification } from 'antd';
import {
    generateID, 
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

const openNotification = (mesg, desc) => {
    notification.error({
        message: mesg,
        description: desc
    })
}
//sagas
function *getCategories() {
    let categories;
    yield put({ type: CHANGE_LOADING, loading: true })
    try {
        categories = yield call(axios.get, '/categories')
        yield put({ type: CATEGORIES_FETCHED, categories: categories.data })
    } catch(e) {
        //message和notification都有延时，需要无阻塞
        yield fork(openNotification('获取数据失败', e))
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
        yield fork(openNotification('获取数据失败', e))
    } finally {
        yield put({ type: CHANGE_LOADING, loading: false })
    }
}

function *addAccount({ payload: { item, history } }) {
    let newItem;
    yield put({ type: CHANGE_LOADING, loading: true })
    try {
        newItem = yield call(axios.post, '/items', item)
        yield put({ type: ACCOUNT_ADDED, id: generateID(), item: newItem.data }) //实际id应该是后端传过来的
        yield fork(message.success, '添加成功')
        yield call(history.push, '/life-apps/account-book')
    } catch (e) {
        yield fork(openNotification('添加失败', e))
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
        yield fork(openNotification('修改失败', e))
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
        yield fork(openNotification('删除失败', e))
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
}