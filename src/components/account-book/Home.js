import React, { useState, useEffect } from 'react';
import { Button, List, Descriptions, Affix, DatePicker, Popconfirm, Icon, Row, Col, Avatar, Empty, Collapse, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import moment from 'moment';
import './Home.css'
import { DELETE_ACCOUNT, GET_TOTAL_DATA, id2TypeAndIconName } from '../../util/account'

const { MonthPicker } = DatePicker;
const { Panel } = Collapse;
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1615528_i5wu517bic.js'
});

const Home = () => {
    const [dateString, setDateString] = useState(moment().format('YYYY-MM'));
    const history = useHistory();
    const match = useRouteMatch();
    const totalData = useSelector(state => state.accounts);
    const cidsMap = useSelector(state => id2TypeAndIconName(state.categories));
    const loading = useSelector(state => state.loading);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: GET_TOTAL_DATA })
    }, [dispatch])

    const deleteItem = (id) => {
        dispatch({ type: DELETE_ACCOUNT, payload: { id } })
    }

    const editItem = (id) => {
        history.push(`${match.url}/edit/${id}`)
    }

    const addNewAccount = () => {
        history.push(`${match.url}/create`)
    }

    const monthData = totalData.filter(item => {
        return item.date.startsWith(dateString)
    });
    const dataMapByDay = monthData.reduce((map, item) => {
        if (!map[item.date]) {
            map[item.date] = [item]
        } else {
            map[item.date].push(item);
        }
        return map;
    }, {});
    // console.log(dataMapByDay);
    const orderedDateKeys = Object.keys(dataMapByDay);
    orderedDateKeys.sort(); //排序
    const len = orderedDateKeys.length;

    let totalIncome = 0, totalOutcome = 0;
    monthData.forEach(item => {
        const type = cidsMap[item.cid].type
        if (type === 'income') {
            totalIncome += item.price
        } else if (type === 'outcome') {
            totalOutcome += item.price;
        }
    });

    return (
        <React.Fragment>
            <Row style={{ marginBottom: '20px' }} >
                <Col span={8}>
                    <MonthPicker
                        onChange={(date, dateString) => setDateString(dateString)}
                        defaultValue={moment()}
                        format='YYYY-MM'
                    />
                </Col>
                <Col span={7} offset={8}>
                    <Descriptions column={2}>
                        <Descriptions.Item label={<span style={{ fontSize: '16px' }}>收入</span>}>{<span style={{ fontSize: '16px' }}>{totalIncome.toFixed(2)}</span>}</Descriptions.Item>
                        <Descriptions.Item label={<span style={{ fontSize: '16px' }}>支出</span>}>{<span style={{ fontSize: '16px' }}>{totalOutcome.toFixed(2)}</span>}</Descriptions.Item>
                    </Descriptions>
                </Col>
                <Col span={1}>
                    <Affix offsetTop={50}>
                        <Button
                            type="primary"
                            icon="plus"
                            shape="circle"
                            size="large"
                            onClick={addNewAccount}
                        />
                    </Affix>
                </Col>
            </Row>
            {!orderedDateKeys.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            <Spin tip="加载中..." spinning={loading}>
                {orderedDateKeys.map((date, index) => {
                    const dayList = dataMapByDay[date];
                    let dayIncome = 0, dayOutcome = 0;
                    dayList.forEach(item => {
                        const type = cidsMap[item.cid].type
                        if (type === 'income') {
                            dayIncome += item.price;
                        } else if (type === 'outcome') {
                            dayOutcome += item.price;
                        }
                    });

                    return (
                        <React.Fragment key={date}>
                            {/* 默认全部展开 */}
                            <Collapse defaultActiveKey={[...Array(len).keys()]}>
                                <Panel
                                    style={{ padding: '5px' }}
                                    header={
                                        <Row>
                                            <Col span={8}>
                                                <Descriptions>
                                                    <Descriptions.Item><strong>{date}</strong></Descriptions.Item>
                                                </Descriptions>
                                            </Col>
                                            <Col span={6} offset={10}>
                                                <Descriptions column={2}>
                                                    <Descriptions.Item label="收入">{dayIncome.toFixed(2)}</Descriptions.Item>
                                                    <Descriptions.Item label="支出">{dayOutcome.toFixed(2)}</Descriptions.Item>
                                                </Descriptions>
                                            </Col>
                                        </Row>
                                    }
                                >
                                    <List
                                        size="small"
                                        dataSource={dayList}
                                        renderItem={item => {
                                            const categoryId = cidsMap[item.cid];
                                            const priceWithSign = categoryId.type === 'income' ? (<span>{`+${item.price}`}</span>) : (<span>{`-${item.price}`}</span>);
                                            return (
                                                <List.Item
                                                    key={item.id}
                                                    actions={[
                                                        <span
                                                            role="button"
                                                            onClick={() => editItem(item.id)}
                                                        >
                                                            <Icon type='edit' className="action-edit" />
                                                        </span>,
                                                        <Popconfirm title="确定删除？" onConfirm={() => deleteItem(item.id)} okText="确定" cancelText="取消">
                                                            <Icon type='delete' className="action-delete" />
                                                        </Popconfirm>
                                                    ]}
                                                >
                                                    <List.Item.Meta
                                                        avatar={
                                                            <Avatar
                                                                icon={<IconFont type={categoryId.iconName} />}
                                                                style={{ background: categoryId.type === 'income' ? '#87d068' : '#8884d8' }}
                                                            />
                                                        }
                                                        title={item.title}
                                                        description={item.note}
                                                    />
                                                    <span>{priceWithSign}</span>
                                                </List.Item>
                                            )

                                        }}
                                    />
                                </Panel>
                            </Collapse>

                        </React.Fragment>
                    )
                })}
            </Spin>
        </React.Fragment>
    )
}

export default Home;