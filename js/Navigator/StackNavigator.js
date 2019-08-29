import React, {Component} from 'react';
import {createStackNavigator} from "react-navigation";
import Macro from '../Const/Macro';
import BottomTabNavigator from './BottomTabNavigator';
import DynamicBottomNavigator from './DynamicBottomTabNavigator';
import DetailPage from "../Controller/Other/DetailPage";
import ProjectWebViewPage from '../Project/Controller/ProjectWebViewPage';
import AboutPage from "../Controller/Mine/TableHeaderView/AboutPage";
import AboutAuthorPage from "../Controller/Mine/TableHeaderView/AboutAuthorPage";
import CustomKeysAndLanguages from "../Controller/Mine/PopularAndTrendingManagement/CustomKeysAndLanguagesPage";
import SortKeysAndLanguagesPage from "../Controller/Mine/PopularAndTrendingManagement/SortKeysAndLanguagesPage";
import SearchPage from "../Controller/Popular/SearchPage";

const StackNavigator = createStackNavigator({
	// 路由配置
	// BottomTabNavigator: BottomTabNavigator,
	DynamicBottomNavigator: DynamicBottomNavigator,
	DetailPage: DetailPage,
	ProjectWebViewPage: ProjectWebViewPage,
	AboutPage: AboutPage,
	AboutAuthorPage: AboutAuthorPage,
	CustomKeysAndLanguages: CustomKeysAndLanguages,
	SortKeysAndLanguagesPage: SortKeysAndLanguagesPage,
	SearchPage: SearchPage,
}, {
	defaultNavigationOptions: ({navigation}) => {
		// 注意：通过navigationOptions或defaultNavigationOptions的{navigation}获取到的navigation都是它内部包含的路由的navigation属性
		// 而且它内部有几个子路由，这个箭头函数就会走几次，全部获取给你获取到
		// 因此，StackNavigator的navigation属性其实应该在它所在的容器里获取，即SwitchNavigator
		return {
			// 我们全部使用自定义的导航栏
			header: null,
			headerStyle: {
				backgroundColor: Macro.THEME_COLOR,
				// 去除导航栏下面的横线
				borderBottomWidth: 0,
			},
			headerTitleStyle: {
				color: 'white',
			},
			headerBackTitle: '返回',
			headerBackTitleStyle: {
				color: 'white',
			},
			headerTintColor: 'white',
		}
	},
});

export default StackNavigator;