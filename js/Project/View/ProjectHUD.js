import React, {Component} from 'react';
import {StyleSheet, Text, View, ActivityIndicator, Modal} from 'react-native';
import Macro from "../../Const/Macro";

export default class ProjectHUD extends Component {
	// 这里你就感受到了，如果一个组件的state只是它自己使用，不为别人所使用的，则可以不放在应用State里
	constructor(props) {
		super(props);

		this.state = {
			visible: false,
		}
	}

	render() {
		console.log(this.props.verticalOffSet);
		console.log(this.props.verticalOffSet ? this.props.verticalOffSet : 0);
		return (
			// 因为外界有可能用Redux，有可能不用Redux
			// 不用的时候就用show和dismiss方法来控制hud的显隐，用的时候就用this.props.visible属性来控制hud的显隐
			this.state.visible || this.props.visible ?
				// 通常情况下style是没问题的，但有些情况下需要做偏移
				<View style={[styles.container, {top: Macro.NAVIGATION_BAR_HEIGHT + (this.props.verticalOffSet ? this.props.verticalOffSet : 0)}]}>
					<ActivityIndicator
						size={'large'}
						animating={true}
						color={this.props.color ? this.props.color : 'gray'}
						style={{flex: 1}}
					/>
				</View> : null
		);
	}

	show() {
		this.setState({
			visible: true,
		})
	}

	dismiss() {
		this.setState({
			visible: false,
		})
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'rgba(255, 255, 255, 0)',

		// 是因为用了绝对布局的原因，才使得ProjectHUD具备了覆盖在别的组件上的能力，否则它也是乖乖沿着主轴布局在别的组件后面的
		position: 'absolute',
		top: Macro.NAVIGATION_BAR_HEIGHT,
		width: '100%',
		height: Macro.SCREEN_HEIGHT - Macro.NAVIGATION_BAR_HEIGHT,
	},
});