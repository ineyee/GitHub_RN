/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import NavigationUtil from '../../Project/Util/NavigationUtil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SplashScreen from 'react-native-splash-screen';

type Props = {};
export default class WelcomePage extends Component<Props> {
	render() {
		// 可以做做广告了什么的
		return null;
	}

	componentDidMount() {
		// 为什么这里不用先给this对象添加timer属性，再点呢，好像直接使用了呀？
		// 回顾JS对象如何新增属性，我们发现“你不用管它原来有没有，直接给它点就行了”，哦原来给JS对象新增一个属性，直接点就行了
		this.timer = setTimeout(() => {
			SplashScreen.hide();

			// 记得传第二个参数哦，目的是为了把SwitchNavigator的navigation传进去，好能够切换根容器
			NavigationUtil.navigate('StackNavigator');
		}, 1000);
	}

	componentWillUnmount() {
		// 移除timer
		if (this.timer) {
			clearTimeout(this.timer);
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	text: {
		fontSize: 14,
		textAlign: 'center',
		margin: 10,
	},
});