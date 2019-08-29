import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {PropTypes} from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Macro from "../../Const/Macro";
import GlobalStyle from "../../Const/GlobalStyle";


export default class MineCell extends Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
	};

	render() {
		let IconComponent = this.props.iconComponent ? this.props.iconComponent : Ionicons;
		let arrowIconName = this.props.arrowIconName ? this.props.arrowIconName : 'ios-arrow-forward';
		let titleColor = this.props.titleColor ? this.props.titleColor : '#333333';
		let contentColor =  this.props.contentColor ? this.props.contentColor : Macro.THEME_COLOR;
		let {iconName, title} =  this.props;

		return(
			<TouchableOpacity
				onPress={() => this.props.didTapCell()}
				activeOpacity={0.2}
			>
				<View style={styles.backgroundView}>
					<View style={styles.leftView}>
						<IconComponent
							name={iconName}
							size={22}
							style={{color: contentColor}}
						/>
						<Text style={[styles.title, {color: titleColor}]}>
							{title}
						</Text>
					</View>

					<Ionicons
						name={arrowIconName}
						size={16}
						style={{color: contentColor}}
					/>
				</View>

				<View
					style={GlobalStyle.line}
				/>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	backgroundView: {
		backgroundColor: 'white',

		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',

		paddingHorizontal: 15,

		height: 60,
	},
	leftView: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	title: {
		paddingLeft: 10,
	}
});