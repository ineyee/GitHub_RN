/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Clipboard, Linking} from 'react-native';
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
import GlobalStyle from "../../../Const/GlobalStyle";
import AboutCommon from "./AboutCommon";
import Toast from 'react-native-easy-toast';
import ProjectSingleton from "../../../Project/Util/ProjectSingleton.js";

// 导入本地文件
import TableHeaderViewData from '../../../Source/Data/TableHeaderViewData';

const data = TableHeaderViewData.aboutAuthor;

export default class AboutAuthorPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showTutorial: true,// 是否展开教程，默认展开
			showBlog: false,
			showQQ: false,
			showContact: false,
		}
	}

	render() {
		const contentView = data.map((item) => {
			const upDownList = item.items.map((smallItem) => (
				<MineCell
					contentColor={ProjectSingleton.sharedSingleton().themeColor}
					title={smallItem.account ? smallItem.title + '：' + smallItem.account : smallItem.title}
					titleColor={'#666666'}
					didTapCell={() => {
						if (smallItem.url) {// 有url的，我们直接跳转网页
							NavigationUtil.navigate('ProjectWebViewPage', {
								url: smallItem.url,
								title: smallItem.title,
							});
							return;
						}
						if (smallItem.account && smallItem.account.indexOf('@') > -1) {// 说明是邮箱，我们调用发邮件
							const url = 'mailto://' + smallItem.account;
							Linking.canOpenURL(url)
								.then(support => {
									if (!support) {
										alert('不支持发邮件');
									} else {
										Linking.openURL(url);
									}
								})
								.catch(e => {
									alert(e);
								})
							return;
						}
						if (smallItem.account) {// QQ或QQ群的，我们复制QQ号码到剪切板
							Clipboard.setString(smallItem.account);
							this.toast.show(smallItem.account + '已复制到剪切板');
							return;
						}
					}}
				/>
			));

			return <View>
				<MineCell
					contentColor={ProjectSingleton.sharedSingleton().themeColor}
					iconComponent={item.iconComponent}
					iconName={item.icon}
					title={item.name}
					arrowIconName={this.state[`show${item.type}`] ? 'ios-arrow-up' : 'ios-arrow-down'}
					didTapCell={() => {
						// 改变状态，刷新界面
						let key = `show${item.type}`;
						this.setState({
							// 记住这里要使用[]把变量变成属性
							[key]: !this.state[key],
						});
					}}
				/>

				{this.state[`show${item.type}`] ? upDownList : null}
			</View>
		});

		return (
			<View style={GlobalStyle.container}>
				<AboutCommon
					params={TableHeaderViewData.author}
					contentView={contentView}
				/>
				<Toast
					ref={toast => this.toast = toast}
					position={'bottom'}
				/>
			</View>
		);
	}
}

