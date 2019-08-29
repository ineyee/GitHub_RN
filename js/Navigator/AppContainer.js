import React, {Component} from 'react';

import {createAppContainer} from "react-navigation";
import SwitchNavigator from './SwitchNavigator';

import {createReactNavigationReduxMiddleware, createReduxContainer} from 'react-navigation-redux-helpers';
import {connect} from 'react-redux';

// 不使用Redux之前，我们是直接导出AppContainer，现在就不直接导出它了，而是给它包裹几层再到出去
const AppContainer = createAppContainer(SwitchNavigator);


{/* 第1步，使用react-navigation-redux-helpers，给AppContainer包裹一层ReduxContainer，下面都是固定写法，直接复制就行*/}

// 1.1 初始化react-navigation与redux的中间件
const reactNavigationReduxMiddleware = createReactNavigationReduxMiddleware(// 返回一个可用于store的middleware
	// 读取应用state的nav
	state => state.navigatorState,
	// 这个参数对于Redux Store来说必须是唯一的，并且与createReduxContainer下面的调用一致。
	'root',
);

// 1.2 把根组件先包装一层
const AppContainer_ReduxContainer = createReduxContainer(// 返回包装根导航器的高阶组件，用于代替根导航器的组件
	// 我们的根导航器
	AppContainer,
	// 和上面createReactNavigationReduxMiddleware设置的key一致
	'root',
);


{/* 第2步，使用React-Redux，创建AppContainer_ReduxContainer的容器组件，即我们最终要使用的根组件 */}

// 2.1 编写UI组件
// 即AppContainer_ReduxContainer

// 2.2 建立UI组件的props与外界的映射关系
// 你可能会问“这个UI组件是什么添加上这些props的呢”？没错，正是这个添加映射关系的过程为该UI组件添加上了这些props
// 输入逻辑类属性要和应用state里该组件state里的属性建立映射关系
function mapStateToProps(state) {
	return {
		state: state.navigatorState,
	}
}
// 输出逻辑类属性要和dispatch(addAction)建立映射关系
function mapDispatchToProps(dispatch) {
	return {

	}
}

// 2.3 使用connect方法生成UI组件对应的容器组件
// 将来我们就是使用UI组件的容器组件了，而不是使用UI组件
const AppContainer_ReduxContainer_Container = connect(
	mapStateToProps,
	// mapDispatchToProps,
)(AppContainer_ReduxContainer);

export {AppContainer_ReduxContainer_Container, reactNavigationReduxMiddleware};