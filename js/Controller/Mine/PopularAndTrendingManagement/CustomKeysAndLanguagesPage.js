/**
 * 最热模块自定义语言、趋势模块自定义标签页面
 *
 * 因为该界面的操作其实就是操作数据库里的数据，会影响最热模块和趋势模块数据的变换，而且该界面的数据来源也是应用State，所以它也需要Redux
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, FlatList, Alert} from 'react-native';
import NavigationUtil from "../../../Project/Util/NavigationUtil";
import ProjectNavigationBar from '../../../Project/View/ProjectNavigationBar.js';
import ViewUtil from "../../../Project/Util/ViewUtil";
import {WebView} from 'react-native-webview';
import ProjectBackPressComponent from "../../../Project/Util/ProjectBackPressComponent";
import FavoriteUtil from "../../../Project/Util/FavoriteUtil";
import {FLAG_STORAGE} from "../../../Dao/Request/ProjectRequestWithCache";
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NotificationName from "../../../Const/NotificationName";
import {connect} from "react-redux";
import Action from "../../../Redux/action/rootAction";
import {FLAG_LANGUAGE} from "../../../Dao/Storage/LanguageDao";
import CustomKeysAndLanguagesCell from "../../../View/Mine/CustomKeysAndLanguages/CustomKeysAndLanguagesCell";
import LanguageDao from "../../../Dao/Storage/LanguageDao";
import ProjectSingleton from "../../../Project/Util/ProjectSingleton.js";
import ProjectSafeAreaView from "../../../Project/View/ProjectSafeAreaView";

class CustomKeysAndLanguagesPage extends Component {
	constructor(props) {
		super(props);
		// 全部的数据
		this.dataDict = this.props.navigation.state.params;

		// 处理安卓物理返回键
		this.backPress = new ProjectBackPressComponent({backPress: () => this.onBackPress()});

		// 数据读取与写入的工具类，因为一会要用它写入数据
		this.languageDao = new LanguageDao(this.dataDict.flag);
		// 当前页面所有的数据
		this.dataArray = [];
		// 其实这个数组仅仅是用来标识这个界面是否有数据变化
		this.changedDataArray = [];
	}

	// 处理安卓物理返回键
	onBackPress() {
		this._leftButtonAction();
		return true;
	}

	render() {
		const {languageState} = this.props;
		this.dataArray = this.dataDict.flag === FLAG_LANGUAGE.flag_key ? languageState.keys : languageState.languages;

		return (
			<ProjectSafeAreaView
				style={styles.container}
				topViewColor={ProjectSingleton.sharedSingleton().themeColor}
				showBottomView={true}
			>
				<ProjectNavigationBar
					title={this.dataDict.title}
					titleViewStyle={this.dataDict.title.length > 20 ? {paddingRight: 40} : null}
					leftButton={ViewUtil.getLeftButton(() => this._leftButtonAction())}
					rightButton={this._getRightButton(() => this._rightButtonAction())}
				/>

				<FlatList
					data={this.dataArray}
					renderItem={({item, index}) => this._renderItem({item, index})}
					keyExtractor={(item) => item.name}// 转换成字符串

					numColumns={2}
				/>
			</ProjectSafeAreaView>
		);
	}

	componentDidMount() {
		// 处理安卓物理返回键
		this.backPress.componentDidMount();

		// 读取数据
		this.props.loadLanguage(this.dataDict.flag);
	}

	componentWillUnmount() {
		// 处理安卓物理返回键
		this.backPress.componentWillUnmount();
	}

	_getRightButton(callBack) {
		return (
			<TouchableOpacity
				onPress={callBack}
			>
				<Text style={styles.comfirm}>{'保存'}</Text>
			</TouchableOpacity>
		);
	}

	_leftButtonAction() {
		if (this.changedDataArray.length === 0) {// 无数据变更
			NavigationUtil.goBack();
		} else {// 有数据变更
			Alert.alert('提示', '要保存修改吗？', [
				{
					'text': '否',
					onPress: () => {
						NavigationUtil.goBack();
					},
				},
				{
					'text': '是',
					onPress: () => {
						this._rightButtonAction();
					},
				}
			]);

		}
	}

	// 保存
	_rightButtonAction() {
		if (this.changedDataArray.length === 0) {
			Alert.alert('提示', '没有修改需要保存', [
				{
					'text': '确定',
				}
			]);

			return;
		}

		// 存储
		this.languageDao.save(this.dataArray);

		// 发出action，更新应用State，以便最热模块和趋势模块及时更新数据
		this.props.loadLanguage(this.dataDict.flag);

		// 一切ok，返回去
		NavigationUtil.goBack();
	}

	_renderItem({item, index}) {
		return (
			<CustomKeysAndLanguagesCell
				dataDict={item}
				didChange={(dataDict) => {
					// 把新的数据替换掉旧数据
					this.dataArray.splice(index, 1, dataDict);
					// 更新changedDataArray数组
					this._updateChangedDataArray(item);
				}}
			/>
		);
	}

	// 更新changedDataArray数组
	_updateChangedDataArray(item) {
		for (let i = 0, len = this.changedDataArray.length; i < len; i++) {
			let tempDict = this.changedDataArray[i];
			if (tempDict === item) {
				this.changedDataArray.splice(i, 1);
				return;
			}
		}
		this.changedDataArray.push(item);
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	comfirm: {
		fontSize: 14,
		color: '#ffffff',
		paddingRight: 15,
	}
});

function mapStateToProps(state) {
	return {
		languageState: state.languageState,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		loadLanguage: (flag) => dispatch(Action.loadLanguage(flag)),
	}
}

const CustomKeysAndLanguagesPageContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(CustomKeysAndLanguagesPage);

export default CustomKeysAndLanguagesPageContainer;

