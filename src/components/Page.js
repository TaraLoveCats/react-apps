import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Layout, Icon, Modal, Spin } from 'antd';
import SiderMenu from './SiderMenu';
import Home from './account-book/Home'
import AccountCharts from './account-book/AccountCharts'
import './Page.css'
import AddNewAccount from './account-book/AddNewAccount'
import Login from './login'
import { SET_VISIBLE } from '../util/app'

const { Header, Content, Footer, Sider } = Layout;

const Page = () => {
    const [collapsed, toggleCollapsed] = useState(false);
    const [isLogin, setIsLogin] = useState(false);//用户点击的是登录或注册
    const visible = useSelector(state => state.modalVisible);
    const loginLoading = useSelector(state => state.loginLoading);
    const { username } = useSelector(state => state.userInfo);
    const loggedIn = useSelector(state => state.loggedIn)
    const dispatch = useDispatch();

    const logIn = () => {
        dispatch({ type: SET_VISIBLE, visible: true })
        setIsLogin(true);
    }

    const register = () => {
        dispatch({ type: SET_VISIBLE, visible: true })
        setIsLogin(false);
    }

    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                >
                    <div style={{ textAlign: 'center' }}>
                        <Icon
                            className="trigger"
                            type={collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={() => toggleCollapsed(!collapsed)}
                        />
                    </div>
                    <SiderMenu />
                </Sider>
                <Layout>
                    <Header style={{ 
                        background: '#fff url("/欢迎.svg") no-repeat',
                        textAlign: 'right',
                        border: '1px solid #eee',
                        padding: '0px 16px',
                        position: 'relative',                        
                        boxShadow: '0px 3px 5px #ddd'
                    }}>
                        {loggedIn ? 
                            <span style={{ fontSize: '16px', }}>{username}</span> :
                            <React.Fragment>
                                <span 
                                role="button" 
                                onClick={logIn}
                                className="loginBtn"
                                >
                                    登录
                                </span>
                                <span style={{fontSize: 18}}>  /  </span>
                                <span 
                                    role="button" 
                                    onClick={register}
                                    className="loginBtn"
                                >
                                    注册
                                </span>
                            </React.Fragment> 
                        }
                    </Header>
                    <Content style={{ background: '#fff', padding: '24px 16px' }}>
                        <Switch>
                            <Route path="/" exact>
                                <Redirect to="/life-apps/account-book" push />
                            </Route>
                            <Route path="/life-apps/account-book" exact>
                                <Home />
                            </Route>
                            <Route path="/life-apps/account-book/create">
                                <AddNewAccount />
                            </Route>
                            <Route path="/life-apps/account-book/edit/:id">
                                <AddNewAccount />
                            </Route>
                            <Route path="/life-apps/account-book/charts">
                                <AccountCharts />
                            </Route>
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>{`Hello Tara@${(new Date()).getFullYear()}`}</Footer>
                </Layout>
            </Layout>
                    
            <Modal 
                visible={visible}   
                footer={null}
                width={420}
                maskClosable={false}
                onCancel={() => dispatch({ type: SET_VISIBLE, visible: false })}
            >
                <Spin tip="加载中..." spinning={loginLoading}>
                    <Login 
                        key={visible}
                        isLogin={isLogin}
                        toggle={(login) => setIsLogin(login)}
                    />
                </Spin>
            </Modal>
        </Router>
    )
}

export default Page;