import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {PropTypes} from 'prop-types';
import Macro from '../../Const/Macro';

export default class ProjectNoDataView extends Component {
	render() {
		return(
			<View style={styles.container}>
				<TouchableOpacity
					activeOpacity={0.2}
					onPress={() => {if (this.props.didTapNoDataView) this.props.didTapNoDataView()}}
				>
					<Image style={styles.image} source={require('../../Source/Image/noData.png')}/>
				</TouchableOpacity>
				<Text style={styles.text}>
					{'暂无数据'}
				</Text>
			</View>

		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,

		backgroundColor: Macro.VC_BACKGROUND_COLOR,

		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		width: 64,
		height: 64,
	},
	text: {
		marginTop: 10,

		color: '#666666',
		fontSize: 14,
	}
});