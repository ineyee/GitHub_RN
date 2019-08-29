import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {PropTypes} from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Macro from "../../../Const/Macro";
import GlobalStyle from "../../../Const/GlobalStyle";
import CheckBox from 'react-native-check-box';
import ProjectSingleton from "../../../Project/Util/ProjectSingleton.js";

export default class CustomKeysAndLanguagesCell extends Component {
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
			<View>
				<CheckBox
					style={styles.checkBox}
					onClick={() => {
						// 改变数据
						this.dataDict.checked = !this.dataDict.checked;
						// 这个的功能其实就是刷新一下界面，对勾会从改变后的数据里读取数据
						this.setState({
							isChecked: !this.state.isChecked,
						});
						// 调用block将这个变化后的数据传出去
						this.props.didChange(this.dataDict);
					}}
					isChecked={this.dataDict.checked}
					leftText={this.dataDict.name}
					checkedImage={<Ionicons name={'ios-checkbox'} size={22} style={{color: ProjectSingleton.sharedSingleton().themeColor}}/>}
					unCheckedImage={<Ionicons name={'ios-checkbox-outline'} size={22}
											  style={{color: ProjectSingleton.sharedSingleton().themeColor}}/>}
				/>

				<View style={GlobalStyle.line}/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	checkBox: {
		backgroundColor: 'white',

		padding: 10,
		width: Macro.SCREEN_WIDTH / 2.0,
	},
});