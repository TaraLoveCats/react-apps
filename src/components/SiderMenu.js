import React from 'react';
import { Menu, Icon } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const { SubMenu } = Menu;

const SiderMenu = () => {
    const location = useLocation();
    return (
        <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={['sub1']}
        >
            <SubMenu
                key="sub1"
                title={
                    <span>
                        <Icon type="appstore" />
                        <span>生活小应用</span>
                    </span>
                }
            >
                <Menu.ItemGroup
                    key="g1"
                    title="记账本"
                >
                    <Menu.Item key="/life-apps/account-book">
                        <Link to="/life-apps/account-book">
                            <Icon type="ordered-list" />
                            明细
                    </Link>
                    </Menu.Item>
                    <Menu.Item key="/life-apps/account-book/charts">
                        <Link to="/life-apps/account-book/charts">
                            <Icon type="line-chart" />
                            图表
                    </Link>
                    </Menu.Item>
                </Menu.ItemGroup>
            </SubMenu>
        </Menu>
    )
}

export default SiderMenu;


