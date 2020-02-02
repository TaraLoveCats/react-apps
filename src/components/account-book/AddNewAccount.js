import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, InputNumber, DatePicker, Button, Icon, Row, Col, Tabs, message, Spin } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { addAccount, editAccount, getCurrentData } from '../../store/actions';

const { TextArea } = Input;
const { TabPane } = Tabs;
const formItemLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 4 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 8, offset: 4 }
    }
}
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1615528_i5wu517bic.js'
});

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
        selectedCategoryId: null,
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.getCurrentData(id);
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.selectedCategoryId === null) {
            return {
                selectedCategoryId: props.currentItem.cid,
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
        const { form: { validateFields } } = this.props;
        validateFields((err, fieldsValue) => {
            if (!err) {
                const values = {
                    ...fieldsValue,
                    date: fieldsValue['date'].format('YYYY-MM-DD'),
                    cid: selectedCategoryId
                }
                // console.log(values)
                if (this.props.match.params.id) {
                    //editMode
                    values.id = id;
                    this.props.editItem(values);
                } else {
                    //addMode
                    this.props.addItem(values);
                }
                this.props.history.push('/life-apps/account-book')
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
        const { getFieldDecorator } = this.props.form;
        const { currentItem, match, categories, id2TypeAndIconName, loading } = this.props;
        const { id } = match.params;
        const initActiveKey = (id2TypeAndIconName[currentItem.cid] && id2TypeAndIconName[currentItem.cid].type) || 'outcome'
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
                                    <Button type="primary" htmlType="submit">提交</Button>
                                    <Button
                                        onClick={this.cancelSubmit}
                                        style={{ marginLeft: '20px' }}
                                    >
                                        取消
                                </Button>
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
    id2TypeAndIconName: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    addItem: PropTypes.func.isRequired,
    editItem: PropTypes.func.isRequired,
    getCurrentData: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
}

const WrappedAddNewAccount = Form.create({ name: 'create_new_account' })(AddNewAccount);
const mapStateToProps = state => ({
    currentItem: state.currentAccount,
    categories: state.categories,
    id2TypeAndIconName: state.id2TypeAndIconName,
    loading: state.loading
})
const mapDispatchToProps = dispatch => ({
    addItem: item => dispatch(addAccount(item)),
    editItem: item => dispatch(editAccount(item)),
    getCurrentData: id => dispatch(getCurrentData(id)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedAddNewAccount);