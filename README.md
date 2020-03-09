# react-apps

React应用集合，现在只有一个account-book记账本应用  

## 版本
- 分支`hooks-dev`是默认版本，代码采用react hooks, react-redux hooks和react-router-dom hooks进行了重写
- 分支`master`用react class components书写
- 分支`thunk`用react class components书写，采用redux-thunk管理异步数据流，其他分支均用redux-saga

## 前后端交互

采用JSON Server进行数据mocking  
Axios异步请求

## 项目主要依赖
- react
- react-router-dom
- redux
- redux-saga / redux-thunk
- antd：UI组件
- axios
- json-server
- recharts：组件化react图表
- moment：处理日期

## 通用模块

 - 侧边栏，提供导航
 - Header，提供登录/注册功能
   - 登录/注册功能实现了前端逻辑和校验，并使用mock数据（用户名和密码），登录模块是独立的，不和其他应用有数据关联。

## 记账本
实现了基本的记账功能，可分类记账，编辑、删除记账内容；提供统计数据展示
- 首页：账本记录列表
- 图表页：展示统计
- 编辑页：记账编辑页面

### 截图

#### 首页列表

![列表.png](https://i.loli.net/2020/03/09/cXZhJzwGvNeRPbS.png)

#### 月份过滤数据

![月份.png](https://i.loli.net/2020/03/09/y5C74gGRIO3bwJq.png)

#### 图表统计数据

![图表.png](https://i.loli.net/2020/03/09/DZWVwsvSuYQqHEP.png)

#### 登录校验

![登录校验.png](https://i.loli.net/2020/03/09/r9c4n1ysxVEDj2R.png)
![登录成功.png](https://i.loli.net/2020/03/09/7giwsRxuqWlGzfD.png)

#### 注册校验

输入手机号后会发送ajax请求校验手机号是否已经存在
![注册校验.png](https://i.loli.net/2020/03/09/rSNRAXnsbtMZO7Q.png)
![注册校验2.png](https://i.loli.net/2020/03/09/gHkmxlSofsiPe9D.png)

#### 新建/编辑记账条目

![新建记账.png](https://i.loli.net/2020/03/09/nE62zAgdDwNf1sZ.png)

![修改.png](https://i.loli.net/2020/03/09/Eki4O5AxVDIwlpr.png)

### 目录结构

```
react-apps
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src
│   ├── components
│   │   ├── account-book                           ---记账本
│   │   │   ├── AccountCharts.js
│   │   │   ├── AddNewAccount.js
│   │   │   ├── index.css
│   │   │   └── index.js
│   │   ├── login                                  ---登录模块
│   │   │   ├── index.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── Page.css
│   │   ├── Page.js                                ---页面
│   │   └── SiderMenu.js                           ---侧边栏
│   ├── store
│   │   ├── actions
│   │   │   └── index.js
│   │   ├── reducers
│   │   │   └── index.js
│   │   └── index.js
│   ├── util
│   │   ├── account.js
│   │   └── app.js
│   ├── App.css
│   ├── App.js
│   ├── index.css
│   └── index.js
├── config-overrides.js
├── db.json
├── package.json
└── README.md
```