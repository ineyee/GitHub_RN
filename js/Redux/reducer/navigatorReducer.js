/**
 * navigator的reducer，用来完成navigator的state的修改
 */


import SwitchNavigator from '../../Navigator/SwitchNavigator';

// SwitchNavigator是项目的根容器（当然我们不说AppContainer是根容器，因为那个只是机械地包一层嘛）
// 此处我们读取根容器的根路由WelcomePage页的state，作为navigator的初始state
// 固定写法
const navState = SwitchNavigator.router.getStateForAction(SwitchNavigator.router.getActionForPathAndParams('WelcomePage'));

// navigator的reducer，用来完成navigator的state的修改
const navigatorReducer = (state = navState, action) => {
	const newState = SwitchNavigator.router.getStateForAction(action, state);

	if (!newState) {// 如果newState为null或未定义
		return state;
	} else {
		return newState;
	}
};

export default navigatorReducer;
