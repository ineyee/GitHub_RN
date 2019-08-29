/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import NavigationUtil from "../../Project/Util/NavigationUtil";
import ProjectNavigationBar from '../../Project/View/ProjectNavigationBar.js';
import ViewUtil from "../../Project/Util/ViewUtil";
import {WebView} from 'react-native-webview';
import ProjectBackPressComponent from "../../Project/Util/ProjectBackPressComponent";
import FavoriteUtil from "../../Project/Util/FavoriteUtil";
import {FLAG_STORAGE} from "../../Dao/Request/ProjectRequestWithCache";
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NotificationName from "../../Const/NotificationName";
import ProjectSafeAreaView from "../../Project/View/ProjectSafeAreaView";
import ProjectSingleton from "../../Project/Util/ProjectSingleton.js";

const TRENDING_URL = 'https://github.com/';

export default class DetailPage extends Component {
	constructor(props) {
		super(props);

		// 全部的数据
		this.dataDict = this.props.navigation.state.params.dataDict;
		// 最热还是趋势模块跳过来的
		this.flag = this.props.navigation.state.params.flag;
		// 是否是从收藏模块进来的，好做通知
		this.from =  this.props.navigation.state.params.from;
		// 导航栏标题（因为接口的原因，不同模块要取的字段不一样，我们这里专门处理一下）
		this.title = this.dataDict.full_name || this.dataDict.fullName;
		// 要加载的路径（因为接口的原因，不同模块要取的字段不一样，我们这里专门处理一下）
		this.url = this.dataDict.html_url || TRENDING_URL + this.dataDict.fullName;
		// 当我们发现webView有上一级上就返回上一级页面，没有上一级时才返回上一个界面
		this.canGoBack = false;

		// 处理安卓物理返回键
		this.backPress = new ProjectBackPressComponent({backPress: () => this.onBackPress()});

		this.state = {
			isFavorite: this.dataDict.isFavorite,
		}
	}

	render() {
		return (
			<ProjectSafeAreaView style={styles.container} topViewColor={ProjectSingleton.sharedSingleton().themeColor}>
				<ProjectNavigationBar
					title={this.title}
					titleViewStyle={this.title.length > 20 ? {paddingRight: 40} : null}
					leftButton={ViewUtil.getLeftButton(() => this._leftButtonAction())}
					rightButton={this._getRightButton()}
				/>

				<WebView
					ref={webView => this.webView = webView}
					// 路径
					source={{uri: this.url}}
					// 布尔值，控制WebView第一次加载时是否显示加载视图（如指示器）。当设置了renderLoading时必须将这个属性设置为true 才能正常显示。
					startInLoadingState={true}
					// 当导航状态发生变化的时候调用。
					onNavigationStateChange={webViewState => {
						this.canGoBack = webViewState.canGoBack;
						this.url = webViewState.url;
					}}
				/>
			</ProjectSafeAreaView>
		);
	}

	componentDidMount() {
		// 处理安卓物理返回键
		this.backPress.componentDidMount();
	}

	componentWillUnmount() {
		// 处理安卓物理返回键
		this.backPress.componentWillUnmount();
	}

	_getRightButton() {
		return (
			<View style={{flexDirection: 'row', paddingRight: 10}}>
				{this.getFavoriteButton(() => {
					// 假设这里请求了接口并返回了新数据，同时我们要把这个newItem返回到上个界面的
					const newItem = {
						...this.dataDict,
						isFavorite: !this.dataDict.isFavorite,
					};
					// 替换本页数据
					this.dataDict = newItem;
					// 刷新UI
					this.setState({
						isFavorite: !this.state.isFavorite,
					});

					// 持久化
					FavoriteUtil.didSelectedFavorite(this.flag, this.dataDict);

					// 这里就传过去
					this.props.navigation.state.params.callback(this.dataDict);
				})}
			</View>
		);
	}

	getFavoriteButton(callback) {
		return (
			<TouchableOpacity
				// 增大点击区域
				style={{padding: 6}}
				// 按下去的颜色，透明
				underlayColor={'transparent'}
				onPress={() => {
					callback();
				}}
			>
				<FontAwesome
					name={this.state.isFavorite ? 'star' : 'star-o'}
					size={24}
					style={{color: 'white'}}
				/>
			</TouchableOpacity>
		);
	}

	_leftButtonAction() {
		if (this.canGoBack) {
			this.webView.goBack();
		} else {
			NavigationUtil.goBack();
		}
	}

	// 处理安卓物理返回键
	onBackPress() {
		this._leftButtonAction();
		return true;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
});

