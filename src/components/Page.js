import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Layout, Icon } from 'antd';
import SiderMenu from './SiderMenu';
import Home from './account-book/Home'
import AccountCharts from './account-book/AccountCharts'
import './Page.css'
import AddNewAccount from './account-book/AddNewAccount'

const { Header, Content, Footer, Sider } = Layout;

const Page = (props) => {
    const [collapsed, toggleCollapsed] = useState(false)

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
                    <Header style={{ background: '#fff', padding: 10 }} />
                    <Content style={{ padding: '0 50px', background: '#fff url("/春节-铜钱.svg") no-repeat' }}>
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
        </Router>
    )
}

export default Page;