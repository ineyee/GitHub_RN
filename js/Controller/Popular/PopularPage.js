/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import {connect} from 'react-redux';
import PopularTopNavigator from '../../View/Popular/PopularTopNavigator';
import ProjectNavigationBar from '../../Project/View/ProjectNavigationBar.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationUtil from "../../Project/Util/NavigationUtil";
import ProjectSafeAreaView from "../../Project/View/ProjectSafeAreaView";
import ProjectSingleton from "../../Project/Util/ProjectSingleton.js";
import Notification from "../../Const/NotificationName";

class PopularPage extends Component {
	render() {
		return (
			<ProjectSafeAreaView style={styles.container} topViewColor={this.props.themeState.themeColor}>
				<ProjectNavigationBar
					title={'最热'}
					rightButton={this._getRightButton()}
				/>
				{/*顶部添加一个TopNavigator，会自动帮我们添加到顶部*/}
				<PopularTopNavigator
					themeColor={this.props.themeState.themeColor}
				/>
			</ProjectSafeAreaView>
		);
	}

	_getRightButton() {
		return (
			<TouchableOpacity
				// 增大点击区域
				style={{padding: 6, paddingRight: 15}}
				// 按下去
				onPress={() => {
					NavigationUtil.navigate('SearchPage');
				}}
			>
				<Ionicons
					name={'ios-search'}
					size={24}
					style={{color: 'white'}}
				/>
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

const PopularPageContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(PopularPage);

export default PopularPageContainer;

/**
 * 在集成了Redux和React-Redux之后，我们开发整个项目就是用它俩了，
 *
 * 我们知道数据的流向是用户触发UI --> 发出action --> store把action携带的数据交给reducer --> reducer处理数据后，返回新的state给store更新
 * 因此我们在实际开发的时候，就要逆着这个数据流量来做开发，也就是说要做到按需索取，即我们要首先考虑数据流向的后部分需要什么，这样才好写前面的部分来提供相应的数据
 *
 *
 * Redux部分：
 * 第一步：设计模块State的数据结构
 * 第二步：编写模块reducer
 * 第三步：确定该模块该有哪些action
 * 第四步：编写具体的模块action
 *
 * React-Redux部分：
 * 第一步：先粗略搭个UI组件
 * 第二步：第三步：用connect包裹UI组件，搞好容器组件和应用state、dispatch(action)的映射关系
 * 第四步：在需要发出action的地方，通过调用props里方法的形式发出一个action就可以了
 * 经过以上4步，程序应该就能跑起来了，我们先把数据搞对，然后再细化搭建UI组件，就可以完成模块的开发了
 */