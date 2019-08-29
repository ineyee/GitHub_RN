/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking} from 'react-native';
import ProjectNavigationBar from '../../../Project/View/ProjectNavigationBar.js';
import NavigationUtil from '../../../Project/Util/NavigationUtil'
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TableHeaderView from "../../../View/Mine/TableHeaderView";
import MineCell from "../../../View/Mine/MineCell";
import HeaderView from "../../../View/Mine/HeaderView";
import Macro from "../../../Const/Macro";
import AboutCommon, {FLAG_ABOUT} from "./AboutCommon";
import ProjectSingleton from "../../../Project/Util/ProjectSingleton.js";

// 导入本地文件
import TableHeaderViewData from '../../../Source/Data/TableHeaderViewData';

const data = {
	items: [
		{
			iconComponent: Octicons,
			iconName: 'smiley',
			title: '关于作者',
		},
	],
};

export default class AboutPage extends Component {
	render() {
		const contentView = data.items.map((item) => (
			<MineCell
				contentColor={ProjectSingleton.sharedSingleton().themeColor}
				iconComponent={item.iconComponent}
				iconName={item.iconName}
				title={item.title}
				didTapCell={() => {
					switch (item.title) {
						case '关于作者':
							NavigationUtil.navigate('AboutAuthorPage');
							break;
					}
				}}
			/>
		));

		return(
			<AboutCommon
				params={TableHeaderViewData.app}
				contentView={contentView}
			/>
		);
	}
}

