import {createSwitchNavigator} from "react-navigation";

import WelcomePage from "../Controller/Other/WelcomePage";
import StackNavigator from './StackNavigator';
import NavigationUtil from "../Project/Util/NavigationUtil";

const SwitchNavigator = createSwitchNavigator({
	// 路由配置
	WelcomePage: WelcomePage,// 启动页、引导页、广告页
	StackNavigator: StackNavigator,
}, {
	defaultNavigationOptions: ({navigation}) => {
		// NavigationUtil的一个静态变量，记录根容器StackNavigator的navigation，用来做整个App内部的跳转
		if (navigation.state.routeName === 'StackNavigator') {
			NavigationUtil.navigation = navigation;
		}
	},
});

export default SwitchNavigator;