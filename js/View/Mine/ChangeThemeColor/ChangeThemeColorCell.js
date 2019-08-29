import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

export default class ChangeThemeColorCell extends Component {
	render() {
		// 这个读取数据要写在这里，写在constructor里是不行的，因为数据改变后重新渲染时只走render方法，写在上面就无法读取到最新的数据
		this.dataDict = this.props.dataDict;
		if (!this.dataDict) return null;

		return (
			<TouchableOpacity
				style={[styles.container, {backgroundColor: this.dataDict.color}]}
				// 暴露一个回调出去
				onPress={() => this.props.didSelectThemeColor()}
			>
				<Text style={styles.text}>{this.dataDict.colorKey}</Text>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: 120,

		justifyContent: 'center',
		alignItems: 'center',

		margin: 3,
	},
	text: {
		color: 'white',
		fontWeight: '400',
	},
});