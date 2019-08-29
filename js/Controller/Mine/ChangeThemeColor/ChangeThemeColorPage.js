import React, {Component} from 'react';
import {Platform, StyleSheet, View, Modal, FlatList, DeviceInfo} from 'react-native';
import AllThemeColor from '../../../Const/AllThemeColor';
import ProjectNavigationBar from '../../../Project/View/ProjectNavigationBar.js';
import ChangeThemeColorCell from '../../../View/Mine/ChangeThemeColor/ChangeThemeColorCell';
import ThemeDao from "../../../Dao/Storage/ThemeDao";
import {connect} from "react-redux";
import Action from "../../../Redux/action/rootAction";
import ProjectSafeAreaView from "../../../Project/View/ProjectSafeAreaView";
import ProjectSingleton from "../../../Project/Util/ProjectSingleton.js";

// 获取所有主题色的key，组成颜色数组
const allThemeColorArray = Object.keys(AllThemeColor);

class ChangeThemeColorPage extends React.Component {
	// 这里你就感受到了，如果一个组件的state只是它自己使用，不为别人所使用的，就不用放在应用State里，那样反而使得编码复杂
	constructor(props) {
		super(props);

		this.state = {
			visible: false,
		}
	}

	render() {
		return (
				<Modal// Modal组件其实是那个背景层
					// 背景层是否显示，即是否显示这个界面
					visible={this.state.visible}
					// 背景层是否透明
					transparent={true}
					// 背景层显示和消失时的动画效果
					animationType={'slide'}
					// 在安卓上用户按下设备的后退按键时触发，该属性在安卓设备上为必填，且会在modal处于开启状态时阻止BackHandler事件
					onRequestClose={() => {
						this.dismiss();
					}}
				>
					<ProjectNavigationBar/>
					<View style={{backgroundColor: 'white', flex: 1}}>
						<View style={styles.container}>
							<FlatList// 整个界面用FlatList来实现九宫格的效果
								style={styles.flatList}
								data={allThemeColorArray}
								renderItem={({item, index}) => this._renderItem({item, index})}
								keyExtractor={(item) => item}
								showsVerticalScrollIndicator={false}
								// 显示三列
								numColumns={3}
							/>
						</View>
					</View>
				</Modal>
		);
	}

	// 显示该界面
	show() {
		this.setState({
			visible: true,
		})
	}

	// 消失该界面
	dismiss() {
		this.setState({
			visible: false,
		})
	}

	_renderItem({item, index}) {
		return (
			<ChangeThemeColorCell
				dataDict={{colorKey: item, color: AllThemeColor[item]}}
				didSelectThemeColor={() => {
					// 修改主题色
					this.props.changeThemeColor(AllThemeColor[item]);

					// 持久化该主题色
					ThemeDao.saveThemeColor(AllThemeColor[item]);

					// 该界面消失
					this.dismiss();
				}}
			/>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		margin: 10,
		marginTop: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? -20 : -44) : -50,
		marginBottom: DeviceInfo.isIPhoneX_deprecated ? 34 + 10 : 10,
		padding: 3,

		borderRadius: 4,
		shadowColor: 'gray',
		shadowOffset: {width: 2, height: 2},
		shadowOpacity: 0.5,
		shadowRadius: 2,
	},
	flatList: {
		flex: 1,
		backgroundColor: 'white',
	},
});

function mapStateToProps(state) {
	return {}
}

function mapDispatchToProps(dispatch) {
	return {
		changeThemeColor: (themeColor) => dispatch(Action.changeThemeColor(themeColor)),
	}
}

const ChangeThemeColorPageContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
	null,
	// 注意：这里千万要写上这句话，否则用了Redux后的组件是无法使用ref获取该组件的
	{forwardRef: true}
)(ChangeThemeColorPage);

export default ChangeThemeColorPageContainer;