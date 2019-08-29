/**
 * 项目唯一的store
 */

import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducer/rootReducer';

import {reactNavigationReduxMiddleware} from '../../Navigator/AppContainer';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';

// 中间件
const logger = createLogger();
const middlewares = [
	reactNavigationReduxMiddleware,
	thunk,
	logger,// logger一定要放在最后面
];

// 第1步：
// 创建项目唯一的store，发现需要一个reducer
// 所以接下来第2步，我们去创建一个reducer，回过头来填在这里，详见rootReducer.js文件
const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;

