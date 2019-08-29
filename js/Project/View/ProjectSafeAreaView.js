import React, {Component} from 'react';
import {Platform, StyleSheet, View, SafeAreaView, DeviceInfo} from 'react-native';
import {PropTypes} from 'prop-types';

export default class ProjectSafeAreaView extends React.Component {
	/*-----------生命周期方法-----------*/

	static propTypes = {
		// 是否显示顶部视图
		showTopView: PropTypes.bool,
		// 是否显示底部视图
		showBottomView: PropTypes.bool,

		// 顶部视图颜色
		topViewColor: PropTypes.string,
		// 底部视图颜色
		bottomViewColor: PropTypes.string,
	};

	static defaultProps = {
		showTopView: true,
		showBottomView: false,

		topViewColor: 'transparent',
		bottomViewColor: '#f8f8f8',
	};

	render() {
		return (
			this._genProjectSafeAreaView()
		);
	}


	/*-----------私有方法-----------*/

	_genProjectSafeAreaView() {
		// children为外界使用时，套在ProjectSafeAreaView内部的子组件们，这是系统提供的属性，不要随便改名字
		const {children, showTopView, showBottomView, topViewColor, bottomViewColor} = this.props;
		return (
			<View style={[styles.container, this.props.style]}>
				{this._genTopView(showTopView, topViewColor)}
				{children}
				{this._genBottomView(showBottomView, bottomViewColor)}
			</View>
		);
	}

	_genSafeAreaView() {
		// children为外界使用时，套在ProjectSafeAreaView内部的子组件们，这是系统提供的属性，不要随便改名字
		const {children} = this.props;
		return(
			<SafeAreaView style={[styles.container, this.props.style]} {...this.props}>
				{children}
			</SafeAreaView>
		);
	}

	_genTopView(showTopView, topViewColor) {
		return(
			DeviceInfo.isIPhoneX_deprecated && showTopView ? <View style={[styles.topView, {backgroundColor: topViewColor}]}/> : null
		);
	}

	_genBottomView(showBottomView, bottomViewColor) {
		return(
			DeviceInfo.isIPhoneX_deprecated && showBottomView ? <View style={[styles.bottomView, {backgroundColor: bottomViewColor}]}/> : null
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	topView: {
		// iPhoneX的状态栏比普通机型的高出了顶部的24
		height: 24,
	},
	bottomView: {
		// iPhoneX的TabBar比普通机型的高出了底部的34
		height: 34,
	},
});