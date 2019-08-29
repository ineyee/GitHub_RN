import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Macro from "../../Const/Macro";

export default class HeaderView extends Component {
	render() {
		let {title} = this.props;

		return (
			<View style={styles.container}>
				<Text style={styles.title}>
					{title}
				</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Macro.VC_BACKGROUND_COLOR,
		justifyContent: 'center',
		height: 22,
	},
	title: {
		paddingHorizontal: 15,
		color: 'gray',
	}
});