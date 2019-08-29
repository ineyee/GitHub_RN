/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import NavigationUtil from "../../Project/Util/NavigationUtil";
import ProjectNavigationBar from '../../Project/View/ProjectNavigationBar.js';
import ViewUtil from "../../Project/Util/ViewUtil";
import {WebView} from 'react-native-webview';
import ProjectBackPressComponent from "./../Util/ProjectBackPressComponent";
import ProjectSafeAreaView from "../../Project/View/ProjectSafeAreaView";
import ProjectSingleton from "./../Util/ProjectSingleton.js";

export default class ProjectWebViewPage extends Component {
	constructor(props) {
		super(props);

		// 当我们发现webView有上一级上就返回上一级页面，没有上一级时才返回上一个界面
		this.canGoBack = false;

		// 处理安卓物理返回键
		this.backPress = new ProjectBackPressComponent({backPress: () => this.onBackPress()});
	}

	render() {
		let {title, url} = this.props.navigation.state.params;

		return (
			<ProjectSafeAreaView style={styles.container} topViewColor={ProjectSingleton.sharedSingleton().themeColor}>
				<ProjectNavigationBar
					title={title}
					titleViewStyle={title.length > 20 ? {paddingRight: 40} : null}
					leftButton={ViewUtil.getLeftButton(() => this._leftButtonAction())}
				/>

				<WebView
					ref={webView => this.webView = webView}
					// 路径
					source={{uri: url}}
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

