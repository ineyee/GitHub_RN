import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {PropTypes} from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Macro from "../../Const/Macro";
import GlobalStyle from "../../Const/GlobalStyle";


export default class TableHeaderView extends Component {
	static propTypes = {
		iconName: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
	};

	render() {
		let IconComponent = this.props.iconComponent ? this.props.iconComponent : Ionicons;
		let contentColor = this.props.contentColor ? this.props.contentColor : Macro.THEME_COLOR;
		let {iconName, title} = this.props;

		return (
			<TouchableOpacity
				onPress={() => this.props.didTapTableHeaderView()}
				activeOpacity={0.2}
			>
				<View style={styles.backgroundView}>
					<View style={styles.leftView}>
						<IconComponent
							name={iconName}
							size={48}
							style={{color: contentColor}}
						/>
						<Text style={styles.title}>
							{title}
						</Text>
					</View>

					<Ionicons
						name={'ios-arrow-forward'}
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

		height: 88,
	},
	leftView: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	title: {
		paddingLeft: 10,
	}
});