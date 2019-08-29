/**
 * 自定义导航栏
 *
 * 至于为什么要自定义导航栏，详见DynamicBottomNavigator.js，DynamicBottomNavigator.navigationOptions = ......那里有提到
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, StatusBar, ViewPropTypes} from 'react-native';
import {PropTypes} from 'prop-types';
import {connect} from "react-redux";

// 高度
const STATUS_BAR_HEIGHT = (Platform.OS === 'ios' ? 20 : 0);// 安卓自己保留了StatusBar的高度，我们不设置了
const NAVIGATION_BAR_HEIGHT = (Platform.OS === 'ios' ? 44 : 50);

// StatusBar其实是系统提供的组件，这里我们在StatusBarShape里写的属性，其实和StatusBar的属性一模一样，方便我们传递给它
const StatusBarShape = {// 注意整个项目的StatusBar只可能有一种配置，后设置的会覆盖先设置的
	barStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
	hidden: PropTypes.bool,
};

class ProjectNavigationBar extends React.Component {
	// 为该组件的属性设置类型检查：一个组件有很多属性，有些属性我们想给它指定为特定的类型，就是通过这种办法。设置之后，外界在使用该组件时，如果给某个属性赋的值的类型，跟我们这里类型检查设置的类型不一样，编译器就会报警告。
	// 注意：这里仅仅是对组件的部分属性做了类型检查，而不是添加属性（添加属性还是在外界使用组件的时候，那里写什么就是添加了什么属性），也就是一个组件的属性是要做类型检查属性的父集
	static propTypes = {
		// 每个组件不是都有个style属性嘛，它也必须是某种特定的类型————ViewPropTypes.style
		style: ViewPropTypes.style,

		// 我们封装的导航栏组件也包含了状态栏，它们统称为导航栏，这里这个属性其实只是用来配置statusBar的，而不是直接接收一个statusBar组件
		statusBarProps: PropTypes.shape(StatusBarShape),

		// 导航栏标题
		title: PropTypes.string,
		// 导航栏标题位置的自定义组件
		titleView: PropTypes.element,

		// 左item
		leftButton: PropTypes.element,
		// 右item
		rightButton: PropTypes.element,

		// 导航栏是否隐藏
		hide: PropTypes.bool,
	};

	// 为该组件的属性设置默认值：一个组件有很多属性，有些属性我们想给它设置默认值，就是通过这种办法。
	// 注意：static defaultProps和static propTypes一样，它们是兄弟关系，各自负责不同的功能，不存在谁包含谁，这里仅仅是为该组件的部分属性设置了默认值而已，也不是添加属性（添加属性还是在外界使用组件的时候，那里写什么就是添加了什么属性），也就是说一个组件的属性是要设置默认值的属性的父集
	static defaultProps = {
		// 这里我们只设置一下statusBarProps的默认值，如果用户不设置statusBar的属性的话，我们让项目的statusBar的属性有个默认值
		statusBarProps: {
			barStyle: 'light-content',
			hidden: false,
		},

		hasLeftButton: true,
	};

	render() {
		// 创建状态栏
		let statusBar = this.props.statusBarProps.hidden ? null :
			<View style={styles.statusBar}>
				<StatusBar {...this.props.statusBarProps}/>
			</View>;

		// 创建导航栏
		let navigationBar = this.props.hide ? null :
			<View style={styles.navigationBar}>
				{/* 创建左item */}
				{this.getButtonElement(this.props.leftButton)}

				{/* 中间title或titleView */}
				{this.getTitleView(this.props.titleView)}

				{/* 创建右item */}
				{this.getButtonElement(this.props.rightButton)}
			</View>;

		return (
			// 注意：this.props.style是外界传进来的style，一定要放在styles.container我们内部定义的style后面，否则外面设置的覆盖不了前面的，用户设置的就没效果了
			// AllThemeColor[this.props.themeState.themeColor]

			<View style={[styles.container, this.props.style, {backgroundColor: this.props.themeState.themeColor}]}>
				{/* 状态栏 */}
				{statusBar}
				{/* 导航栏 */}
				{navigationBar}
			</View>
		);
	}

	getButtonElement(element) {
		// 外界已经写好leftButton和rightButton传进来了，这里我们为了好布局它们俩，给它俩外面包一层View来做它俩的style
		return (
			<View style={styles.navigationBarButton}>
				{element ? element : null}
			</View>
		);
	}

	getTitleView(element) {
		// 外界已经写好titleView传进来了，这里我们为了好布局它，给它外面包一层View来做它的style
		return (
			<View style={this.props.hasLeftButton ? {
				...styles.titleView
			} : {
				...styles.titleView1
			}}>
				{element ?
					(element) : (
					<Text
					style={styles.title}
					numberOfLines={1}
					// 一行显示不下时，省略号的模式，'head'前省略，'tail'后省略，'middle'中间省略，'clip'裁切能显示的部分显示、而不显示省略号
					ellipsizeMode={'tail'}
				>
					{this.props.title}
				</Text>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {},

	statusBar: {
		height: STATUS_BAR_HEIGHT,
	},
	navigationBar: {
		flexDirection: 'row',
		// navigationBar上所有的东西，竖向都不会撑满，因此外界无法自适应高度，只能给固定高度
		alignItems: 'center',
		justifyContent: 'space-between',
		height: NAVIGATION_BAR_HEIGHT,
	},
	titleView: {
		alignItems: 'center',
		justifyContent: 'center',

		// 为了避免navigationBar上左右内容宽度不一样时，titleView无法居中
		position: 'absolute',
		left: 40,
		right: 40,
	},
	titleView1: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 17,
		color: 'white',
	},
	navigationBarButton: {
		alignItems: 'center',
	},
});

function mapStateToProps(state) {
	return {
		themeState: state.themeState,
	}
}

function mapDispatchToProps(dispatch) {
	return {}
}

const ProjectNavigationBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(ProjectNavigationBar);

export default ProjectNavigationBarContainer;