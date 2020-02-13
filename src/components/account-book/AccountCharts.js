import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, DatePicker, Empty, Spin } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import moment from 'moment';
import { GET_TOTAL_DATA, id2TypeAndIconName } from '../../util/account'

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

//sort by value, from max to min
const sortByValue = (a, b) => {
    return b.value - a.value;
}

const CustomizedLabel = ({ x, y, width, height, value, total }) => {
    const percent = (value / total * 100).toFixed(1)
    return (
        <text
            x={x + width}
            y={y + height * 0.75}
            fill="#666"
            textAnchor="start"
            style={{ fontSize: '12px' }}
        >
            {`${percent}%`}
        </text>
    )
};

const Chart = ({ data, type, total }) => {
    if (data.length === 0) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }
    return (
        <ResponsiveContainer width={'100%'} height={400}>
            <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" padding={{ right: 40 }} />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Bar
                    dataKey="value"
                    fill={type === 'income' ? '#87d068' : '#8884d8'}
                    maxBarSize={30}
                    label={<CustomizedLabel total={total} />}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}


const AccountCharts = (props) => {
    const [dateString, setDateString] = useState('');
    const totalData = useSelector(state => state.accounts);
    const cidsMap = useSelector(state => id2TypeAndIconName(state.categories));
    const loading = useSelector(state => state.loading);
    const dispatch = useDispatch();

    useEffect(() => {
        if (Object.keys(cidsMap).length === 0) {
            dispatch({ type: GET_TOTAL_DATA })
        }
    }, [])
    //处理数据
    const dataShowed = dateString[0] ? totalData.filter(item => item.date >= dateString[0] && item.date <= dateString[1]) : totalData;
    const cidToPriceSum = {};
    let totalIncome = 0, totalOutcome = 0;
    dataShowed.forEach((item) => {
        //calculate the tatal
        if (cidsMap[item.cid].type === 'income') {
            totalIncome += item.price;
        } else {
            totalOutcome += item.price;
        }
        //total by cid
        if (!cidToPriceSum[item.cid]) {
            cidToPriceSum[item.cid] = item.price;
        } else {
            cidToPriceSum[item.cid] += item.price;
        }
    })
    const outcomeDataByCategory = [], incomeDataByCategory = [];
    Object.keys(cidToPriceSum).forEach(cid => {
        const cidMap = cidsMap[cid];
        if (cidMap.type === 'outcome') {
            outcomeDataByCategory.push({
                name: cidMap.name,
                value: cidToPriceSum[cid],
                iconName: cidMap.iconName
            })
        } else {
            incomeDataByCategory.push({
                name: cidMap.name,
                value: cidToPriceSum[cid],
                iconName: cidMap.iconName
            })
        }
    });
    outcomeDataByCategory.sort(sortByValue);
    incomeDataByCategory.sort(sortByValue);

        return (
            <React.Fragment>
                <Spin tip="加载中..." spinning={loading}>
                    <RangePicker
                        ranges={{
                            '近一周': [moment().subtract(7, 'days'), moment()],
                            '本月': [moment().startOf('month'), moment().endOf('month')],
                            '今年': [moment().startOf('year'), moment().endOf('year')]
                        }}
                        onChange={(date, dateString) => setDateString(dateString)}
                    />
                    <Tabs defaultActiveKey="outcome">
                        <TabPane tab="支出" key="outcome">
                            <Chart
                                data={outcomeDataByCategory}
                                type="outcome"
                                total={totalOutcome}
                            />
                        </TabPane>
                        <TabPane tab="收入" key="income">
                            <Chart
                                data={incomeDataByCategory}
                                type="income"
                                total={totalIncome}
                            />
                        </TabPane>
                    </Tabs>
                </Spin>
            </React.Fragment>
        )
}

export default AccountCharts;