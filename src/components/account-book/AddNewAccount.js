import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, InputNumber, DatePicker, Button, Icon, Row, Col, Tabs, message, Spin } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
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

class AddNewAccount extends Component {

   state = {
        selectedCategoryId: this.props.currentItem.cid,//初始化
        currentItemId: this.props.currentItem.id
    } 

    componentDidMount() {
        const { match, dispatch, categories } = this.props;
        const { id } = match.params;
        dispatch({ type: SET_CURRENT_ID, id }) //同步
        //刷新页面
        if (id && categories.length === 0) {
            //edit
            dispatch({ type: GET_TOTAL_DATA })
        } else if (categories.length === 0) {
            //add，只用请求categories
            dispatch({ type: GET_CATEGORIES })
        }
    }

    // watch for changes to currentItemId
    // a "fully uncontrolled component with a key" fallback
    static getDerivedStateFromProps(props, state) {
        if (props.currentItem.id !== state.currentItemId) {
            return {
                selectedCategoryId: props.currentItem.cid,
                currentItemId: props.currentItem.id
            }
        }
        return null
    }

    submitForm = (e, id) => {
        e.preventDefault();
        const { selectedCategoryId } = this.state;
        if (!selectedCategoryId) {
            message.warning('请务必选择账目种类~~');
            return;
        }
        const { form: { validateFields }, match, dispatch, history } = this.props;
        validateFields((err, fieldsValue) => {
            if (!err) {
                const values = {
                    ...fieldsValue,
                    date: fieldsValue['date'].format('YYYY-MM-DD'),
                    cid: selectedCategoryId
                }
                // console.log(values)
                if (match.params.id) {
                    //editMode
                    values.id = id;
                    dispatch({ type: EDIT_ACCOUNT, payload: { item: values, history } })
                } else {
                    //addMode
                    dispatch({ type: ADD_ACCOUNT, payload: { item: values, history } })
                }
            }
        })
    }

    cancelSubmit = () => {
        const { history } = this.props;
        history.push('/life-apps/account-book');
    }

    selectCategory = (selectedCategoryId) => {
        this.setState({ selectedCategoryId })
    }

    render() {
        const { form: { getFieldDecorator },  currentItem, match, categories, cidsMap, loading } = this.props;
        const { id } = match.params;
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
                                        selectedId={this.state.selectedCategoryId}
                                        onSelect={this.selectCategory}
                                        categories={categories}
                                    />
                                </TabPane>
                                <TabPane tab="收入" key="income">
                                    <CategoryList
                                        type="income"
                                        selectedId={this.state.selectedCategoryId}
                                        onSelect={this.selectCategory}
                                        categories={categories}
                                    />
                                </TabPane>
                            </Tabs>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={14}>
                            <Form {...formItemLayout} onSubmit={e => this.submitForm(e, id)}>
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
                                            <Button onClick={this.cancelSubmit}>取消</Button>
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
}

AddNewAccount.propTypes = {
    currentItem: PropTypes.object.isRequired,
    categories: PropTypes.arrayOf(PropTypes.object).isRequired,
    cidsMap: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
}


const AddNewAccountWithForm = Form.create({ name: 'create_new_account' })(AddNewAccount);
const mapStateToProps = state => {
    const cidsMap = id2TypeAndIconName(state.categories);
    const id = state.currentAccountId;
    const tempItem = state.accounts.filter(item => item.id === id)[0];
    const currentItem = tempItem ? tempItem : initData;
    return {
        categories: state.categories,
        currentItem,
        cidsMap,
        loading: state.loading,
    }
}

export default connect(mapStateToProps)(AddNewAccountWithForm);
