import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Layout, Icon, Modal, Spin } from 'antd';
import SiderMenu from './SiderMenu';
import Home from './account-book/Home'
import AccountCharts from './account-book/AccountCharts'
import './Page.css'
import AddNewAccount from './account-book/AddNewAccount'
import Login from './login'

const { Header, Content, Footer, Sider } = Layout;

const Page = (props) => {
    const [collapsed, toggleCollapsed] = useState(false);
    const [visible, setVisible] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    const login = () => {
        setVisible(true);
        setIsLogin(true);
    }

    const register = () => {
        setVisible(true);
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
                        boxShadow: '0px 3px 5px #ddd'
                    }}>
                        <span 
                            role="button" 
                            onClick={login}
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
                    </Header>
                    <Content style={{  background: '#fff', padding: '24px 16px' }}>
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
                onCancel={() => setVisible(false)}
            >
                {/* <Spin tip="..."> */}
                <Login 
                    key={visible}
                    isLogin={isLogin}
                    toggle={(login) => setIsLogin(login)}
                />
                {/* </Spin> */}
            </Modal>
        </Router>
    )
}

export default Page;