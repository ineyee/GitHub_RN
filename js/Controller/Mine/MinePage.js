/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking, Alert} from 'react-native';
import ProjectNavigationBar from '../../Project/View/ProjectNavigationBar.js';
import NavigationUtil from '../../Project/Util/NavigationUtil'
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TableHeaderView from "../../View/Mine/TableHeaderView";
import MineCell from "../../View/Mine/MineCell";
import HeaderView from "../../View/Mine/HeaderView";
import GlobalStyle from "../../Const/GlobalStyle";
import {FLAG_LANGUAGE} from "../../Dao/Storage/LanguageDao";
import ChangeThemeColorPage from "./ChangeThemeColor/ChangeThemeColorPage";
import Action from "../../Redux/action/rootAction";
import {connect} from "react-redux";
import AllThemeColor from "../../Const/AllThemeColor";
import ProjectSafeAreaView from "../../Project/View/ProjectSafeAreaView";

import {NativeModules, NativeEventEmitter} from 'react-native';
const CalendarManager = NativeModules.CalendarManager;
const calendarManagerEmitter = new NativeEventEmitter(CalendarManager);

const subscription = calendarManagerEmitter.addListener(
	'EventReminder',// 和OC类那边约定好的事件名
	(notification) => {
		console.log(notification);
	}
);

const data = {
	tableHeaderView: {
		iconName: 'logo-github',
		title: 'Github_RN',
	},
	popular: {
		title: '最热管理',
		items: [
			{
				iconName: 'md-checkbox-outline',
				title: '自定义标签',
			},
			{
				iconComponent: FontAwesome,
				iconName: 'sort',
				title: '标签排序',
			},
		],
	},
	trending: {
		title: '趋势管理',
		items: [
			{
				iconName: 'md-checkbox-outline',
				title: '自定义语言',
			},
			{
				iconComponent: FontAwesome,
				iconName: 'sort',
				title: '语言排序',
			},
		],
	},
	setting: {
		title: '设置',
		items: [
			{
				iconName: 'ios-color-palette',
				title: '自定义主题',
			},
			{
				iconComponent: MaterialIcons,
				iconName: 'feedback',
				title: '反馈',
			},
		],
	}
};

class MinePage extends Component {
	componentWillUnmount(){
		subscription.remove();
	}

	render() {
		const {themeState} = this.props;

		return (
			<ProjectSafeAreaView style={styles.container} topViewColor={this.props.themeState.themeColor}>
				<ChangeThemeColorPage
					ref={changeThemeColorPage => this.changeThemeColorPage = changeThemeColorPage}
				/>

				<ProjectNavigationBar
					title={'我的'}
				/>

				<ScrollView>
					{/* TableHeaderView */}
					<TableHeaderView
						contentColor={this.props.themeState.themeColor}
						iconName={data.tableHeaderView.iconName}
						title={data.tableHeaderView.title}
						didTapTableHeaderView={() => {
							NavigationUtil.navigate('AboutPage');
						}}
						changeAvatar={() => {
							CalendarManager.addEvent('生日聚会', {
								location: '六国饭点',
								date: new Date().getTime(),
							});
							CalendarManager.findEvents()
								.then(events => {
									console.log(events);
								})
								.catch(error => {
									console.log(error);
								});
							CalendarManager.calendarEventReminderReceived();
						}}
					/>

					{/* 最热管理 */}
					<HeaderView
						title={data.popular.title}
					/>
					{
						data.popular.items.map((item) => (
							<MineCell
								contentColor={this.props.themeState.themeColor}
								iconComponent={item.iconComponent}
								iconName={item.iconName}
								title={item.title}
								didTapCell={() => {
									switch (item.title) {
										case '自定义标签':
											NavigationUtil.navigate('CustomKeysAndLanguages', {flag: FLAG_LANGUAGE.flag_key, title: item.title});
											break;
										case '标签排序':
											NavigationUtil.navigate('SortKeysAndLanguagesPage', {flag: FLAG_LANGUAGE.flag_key, title: item.title});
											break;
									}
								}}
							/>
						))
					}

					{/* 趋势管理 */}
					<HeaderView
						title={data.trending.title}
					/>
					{
						data.trending.items.map((item) => (
							<MineCell
								contentColor={this.props.themeState.themeColor}
								iconComponent={item.iconComponent}
								iconName={item.iconName}
								title={item.title}
								didTapCell={() => {
									switch (item.title) {
										case '自定义语言':
											NavigationUtil.navigate('CustomKeysAndLanguages', {flag: FLAG_LANGUAGE.flag_language, title: item.title});
											break;
										case '语言排序':
											NavigationUtil.navigate('SortKeysAndLanguagesPage', {flag: FLAG_LANGUAGE.flag_language, title: item.title});
											break;
									}
								}}
							/>
						))
					}

					{/* 设置 */}
					<HeaderView
						title={data.setting.title}
					/>
					{
						data.setting.items.map((item) => (
							<MineCell
								contentColor={this.props.themeState.themeColor}
								iconComponent={item.iconComponent}
								iconName={item.iconName}
								title={item.title}
								didTapCell={() => {
									switch (item.title) {
										case '自定义主题':
											this.changeThemeColorPage.show();
											break;
										case '反馈':
											// 发邮件
											const url = 'mailto://crazycodeboy@gmail.com';
											Linking.canOpenURL(url)
												.then(support => {
													if (!support) {
														Alert.alert('提示', '未安装邮件或当前手机不支持发送邮件！', [
															{
																'text': '确定',
															},
														]);
													} else {
														Linking.openURL(url);
													}
												})
												.catch(e => {
													Alert.alert('提示', e.toString(), [
														{
															'text': '确定',
														},
													]);
												})
											break;
									}
								}}
							/>
						))
					}
				</ScrollView>
			</ProjectSafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: GlobalStyle.container,
});


function mapStateToProps(state) {
	return {
		themeState: state.themeState,
	}
}

function mapDispatchToProps(dispatch) {
	return {

	}
}

const MyPageContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(MinePage);

export default MyPageContainer;
