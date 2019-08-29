import React, {Component} from 'react';

import {createBottomTabNavigator} from "react-navigation";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import Macro from '../Const/Macro';

import FavoritePage from "../Controller/Favorite/FavoritePage";
import TrendingPage from "../Controller/Trending/TrendingPage";
import PopularPage from "../Controller/Popular/PopularPage";
import MyPage from "../Controller/Mine/MinePage";

const BottomTabNavigator = createBottomTabNavigator({
	// 路由配置
	PopularPage: {
		screen: PopularPage,
		navigationOptions: {
			tabBarLabel: '最热',
			tabBarIcon: ({tintColor}) => (
				<MaterialIcons
					name={'whatshot'}
					size={26}
					style={{color: tintColor}}
				/>
			),
		},
	},
	TrendingPage: {
		screen: TrendingPage,
		navigationOptions: {
			tabBarLabel: '趋势',
			tabBarIcon: ({tintColor}) => (
				<Ionicons
					name={'md-trending-up'}
					size={26}
					style={{color: tintColor}}
				/>
			),
		},
	},
	FavoritePage: {
		screen: FavoritePage,
		navigationOptions: {
			tabBarLabel: '收藏',
			tabBarIcon: ({tintColor}) => (
				<MaterialIcons
					name={'favorite'}
					size={26}
					style={{color: tintColor}}
				/>
			),
		},
	},
	MyPage: {
		screen: MyPage,
		navigationOptions: {
			tabBarLabel: '我的',
			tabBarIcon: ({tintColor}) => (
				<Entypo
					name={'user'}
					size={26}
					style={{color: tintColor}}
				/>
			),
		},
	},
}, {
	tabBarOptions: {
		// 选中颜色
		activeTintColor: Macro.THEME_COLOR,
		// 未选中颜色
		inactiveTintColor: Macro.INACTIVE_TINT_COLOR,
	}
});

export default BottomTabNavigator;