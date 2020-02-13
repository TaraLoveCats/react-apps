import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, InputNumber, DatePicker, Button, Icon, Row, Col, Tabs, message, Spin } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { ADD_ACCOUNT, EDIT_ACCOUNT, GET_TOTAL_DATA, SET_CURRENT_ID, GET_CATEGORIES, id2TypeAndIconName } from '../../util/account'

const { TextArea } = Input;
const { TabPane } = Tabs;
const formItemLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 4 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 12, offset: 4 }
    }
}
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1615528_i5wu517bic.js'
});
const initData = {
    id: null,
    title: '',
    price: 0,
    date: moment().format('YYYY-MM-DD'),
    note: '',
    cid: null
}

const CategoryList = ({ type, selectedId, onSelect, categories }) => {
    return categories.map((item, index) => {
        if (item.type === type) {
            const color = selectedId === item.id ? '#1890ff' : 'initial';
            return (
                <div
                    key={index}
                    role="button"
                    style={{ float: 'left', margin: '0 8px', cursor: 'pointer' }}
                    onClick={() => onSelect(item.id)}
                >
                    <IconFont
                        type={item.iconName}
                        style={{ fontSize: '36px', color: `${color}` }}
                    />
                    <p>{item.name}</p>
                </div>
            )
        } else {
            return null;
        }
    })
}

const AddNewAccount = (props) => {
    const { form: { validateFields, getFieldDecorator } } = props;
    const history = useHistory();
    const { id: paramsId } = useParams();
    const categories = useSelector(state => state.categories);
    const cidsMap = id2TypeAndIconName(categories);
    const loading = useSelector(state => state.loading);
    const currentId = useSelector(state => state.currentAccountId);
    const tempItem = useSelector(state => state.accounts).filter(item => item.id === currentId)[0];
    const currentItem = tempItem ? tempItem : initData;
    const dispatch = useDispatch();
    const [selectedCategoryId, setCategoryId] = useState(currentItem.cid);
    const [currentItemId, setItemId] = useState(currentId);

    useEffect(() => {
        dispatch({ type: SET_CURRENT_ID, id: paramsId }) //同步
        //刷新页面
        if (paramsId && categories.length === 0) {
            //edit
            dispatch({ type: GET_TOTAL_DATA })
        } else if (categories.length === 0) {
            //add，只用请求categories
            dispatch({ type: GET_CATEGORIES })
        }
    }, [paramsId, categories])

    // watch for changes to currentItemId
    // a "fully uncontrolled component with a key" fallback
    useEffect(() => {
        if (currentItem.id !== currentItemId) {
            setCategoryId(currentItem.cid);
            setItemId(currentItem.id);
        }
    }, [currentItem, currentItemId])

    const submitForm = (e) => {
        e.preventDefault();
        if (!selectedCategoryId) {
            message.warning('请务必选择账目种类~~');
            return;
        }
        validateFields((err, fieldsValue) => {
            if (!err) {
                const values = {
                    ...fieldsValue,
                    date: fieldsValue['date'].format('YYYY-MM-DD'),
                    cid: selectedCategoryId
                }
                // console.log(values)
                if (paramsId) {
                    //editMode
                    values.id = paramsId;
                    dispatch({ type: EDIT_ACCOUNT, payload: { item: values, history } })
                } else {
                    //addMode
                    dispatch({ type: ADD_ACCOUNT, payload: { item: values, history } })
                }
            }
        })
    }

    const cancelSubmit = () => {
        history.push('/life-apps/account-book');
    }

    const selectCategory = (selectedCategoryId) => {
        setCategoryId(selectedCategoryId)
    }

    const initActiveKey = (cidsMap[currentItem.cid] && cidsMap[currentItem.cid].type) || 'outcome'
    return (
        <React.Fragment>
            <Spin tip="加载中..." spinning={loading}>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={10}>
                        <Tabs defaultActiveKey={initActiveKey}>
                            <TabPane tab="支出" key="outcome">
                                <CategoryList
                                    type="outcome"
                                    selectedId={selectedCategoryId}
                                    onSelect={selectCategory}
                                    categories={categories}
                                />
                            </TabPane>
                            <TabPane tab="收入" key="income">
                                <CategoryList
                                    type="income"
                                    selectedId={selectedCategoryId}
                                    onSelect={selectCategory}
                                    categories={categories}
                                />
                            </TabPane>
                        </Tabs>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={14}>
                        <Form {...formItemLayout} onSubmit={e => submitForm(e)}>
                            <Form.Item label="标题">
                                {getFieldDecorator('title', {
                                    rules: [{ required: true, message: '请输入标题' }],
                                    initialValue: currentItem.title
                                })(
                                    <Input
                                        placeholder="请输入标题"
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label="金额">
                                {getFieldDecorator('price', {
                                    rules: [{ required: true, message: '请输入金额' }],
                                    initialValue: currentItem.price
                                })(
                                    <InputNumber
                                        min={0}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label="日期">
                                {getFieldDecorator('date', {
                                    rules: [{ required: true, message: '请选择时间' }],
                                    initialValue: moment(currentItem.date, 'YYYY-MM-DD')
                                })(
                                    <DatePicker />
                                )}
                            </Form.Item>
                            <Form.Item label="备注">
                                {getFieldDecorator('note', {
                                    initialValue: currentItem.note
                                })(
                                    <TextArea
                                        allowClear
                                        autoSize={{ maxRows: 4 }}
                                        placeholder="备注"
                                    />
                                )}
                            </Form.Item>
                            <Form.Item {...tailFormItemLayout}>
                                <Row>
                                    <Col xs={10} sm={8}>
                                        <Button type="primary" htmlType="submit">提交</Button>
                                    </Col>
                                    <Col span={10} offset={2}>
                                        <Button onClick={cancelSubmit}>取消</Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Form>

                    </Col>
                </Row>
            </Spin>
        </React.Fragment>
    )
}

AddNewAccount.propTypes = {
    form: PropTypes.object.isRequired,
}
const AddNewAccountWithForm = Form.create({ name: 'create_new_account' })(AddNewAccount);

export default AddNewAccountWithForm;
