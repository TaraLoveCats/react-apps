import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Layout, Icon } from 'antd';
import SiderMenu from './SiderMenu';
import Home from './account-book/Home'
import AccountCharts from './account-book/AccountCharts'
import './Page.css'
import AddNewAccount from './account-book/AddNewAccount'

const { Header, Content, Footer, Sider } = Layout;

export default class Page extends Component {

    state = {
        collapsed: false,
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    render() {
        return (
            <Router>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider
                        trigger={null}
                        collapsible
                        collapsed={this.state.collapsed}
                        onCollapse={this.onCollapse}
                        // style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <Icon
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
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
}