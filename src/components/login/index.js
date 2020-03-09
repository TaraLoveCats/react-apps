import React from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import Login from './Login'
import Register from './Register'

export default function LoginComp({ isLogin, toggle }) {
    const { TabPane } = Tabs;
    
    return (
        <>
            <Tabs
                activeKey={isLogin ? 'login' : 'register'}
                onChange={(key) => key === 'login' ? toggle(true) : toggle(false)}
            >
                <TabPane tab="登录" key="login">
                    <Login />
                </TabPane>
                <TabPane tab="注册" key="register">
                    <Register />
                </TabPane>
            </Tabs>
        </>
    )
}
LoginComp.propTypes = {
    isLogin: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired
}