import React from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import Login from './Login'
import Register from './Register'

const LoginComp = ({ isLogin, toggle }) => {
    const { TabPane } = Tabs;
    
    return (
        <React.Fragment>
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
        </React.Fragment>
    )
}
LoginComp.propTypes = {
    isLogin: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired
}

export default LoginComp;