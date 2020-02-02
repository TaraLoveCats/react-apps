import React from 'react';
import Page from './components/Page'
import { ConfigProvider, Empty } from 'antd';
import { Provider } from 'react-redux';
import store from './store'
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

export default () => (
    <Provider store={store}>
        <ConfigProvider 
            locale={zhCN} 
            renderEmpty={() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        >
            <Page />
        </ConfigProvider>
    </Provider>
)
