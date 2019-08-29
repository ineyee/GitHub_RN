/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import {connect} from 'react-redux';
import TrendingTopNavigator from '../../View/Trending/TrendingTopNavigator';
import Action from '../../Redux/action/rootAction';
import ProjectNavigationBar from '../../Project/View/ProjectNavigationBar.js';
import TrendingDateRangeAlertView from '../../View/Trending/TrendingDateRangeAlertView';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {DeviceEventEmitter} from 'react-native';
import Notification from '../../Const/NotificationName';
import ProjectSafeAreaView from "../../Project/View/ProjectSafeAreaView";

const DateRange = [{showText: '今天', searchText: 'since=daily'}, {
	showText: '本周',
	searchText: 'since=weekly'
}, {showText: '本月', searchText: 'since=monthly'}];

class TrendingPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			dateRange: DateRange[0],
		}
	}

	render() {
		return (
			<ProjectSafeAreaView style={styles.container} topViewColor={this.props.themeState.themeColor}>
				<ProjectNavigationBar
					titleView={this.renderTitleView()}
				/>
				{/*顶部添加一个TopNavigator，会自动帮我们添加到顶部*/}
				<TrendingTopNavigator
					themeColor={this.props.themeState.themeColor}
				/>

				<TrendingDateRangeAlertView
					ref={alertView => this.alertView = alertView}// 标识，我们要用这个组件的show()方法
					didSelect={(item) => {
						// 然后改掉state
						this.setState({
							dateRange: item,
						});

						// 这里需要让TopNavigator知道，来刷新界面，我们既然分成两个js文件了，就用通知来实现下
						// 发出通知，以及通知携带的参数
						DeviceEventEmitter.emit(Notification.DID_CHANGE_DATE_RANGE, item);
					}}
				/>
			</ProjectSafeAreaView>
		);
	}

	renderTitleView() {
		return (
			<TouchableOpacity
				onPress={() => {
					this.alertView.show();
				}}
			>
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					<Text style={{fontSize: 17, color: 'white'}}>
						{'趋势 ' + this.state.dateRange.showText}
					</Text>
					<MaterialIcons
						name={'arrow-drop-down'}
						size={22}
						style={{color: 'white'}}
					/>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
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

const TrendingPageContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(TrendingPage);

export default TrendingPageContainer;