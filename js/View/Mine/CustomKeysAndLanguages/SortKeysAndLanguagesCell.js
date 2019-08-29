import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import {PropTypes} from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Macro from "../../../Const/Macro";
import CheckBox from 'react-native-check-box';
import ProjectSingleton from "../../../Project/Util/ProjectSingleton.js";

export default class SortKeysAndLanguagesPage extends Component {
	constructor(props) {
		super(props);

		// this.dataDict = this.props.dataDict;
		this.dataDict = {};
		this.state = {
			isChecked: this.dataDict.checked,
		}
	}

	render() {
		// 这个读取数据要写在这里，写在constructor里是不行的，因为数据改变后重新渲染时只走render方法，写在上面就无法读取到最新的数据
		this.dataDict = this.props.dataDict;
		if (!this.dataDict) return null;


		return (
			<TouchableHighlight
				underlayColor={'#eee'}
				style={{
					padding: 25,
					backgroundColor: '#F8F8F8',
					borderBottomWidth: 1,
					borderColor: '#eee',
				}}
				{...this.props.sortHandlers}
			>
				<View style={styles.backgroundView}>
					<FontAwesome
						name={'sort'}
						size={22}
						style={{color: ProjectSingleton.sharedSingleton().themeColor, marginRight: 10}}
					/>

					<Text>{this.dataDict.name}</Text>
				</View>
			</TouchableHighlight>
		)
	}
}

const styles = StyleSheet.create({
	backgroundView: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
});