/**
 * 最热模块自定义语言、趋势模块自定义标签页面
 *
 * 因为该界面的操作其实就是操作数据库里的数据，会影响最热模块和趋势模块数据的变换，而且该界面的数据来源也是应用State，所以它也需要Redux
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Alert} from 'react-native';
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
import SortKeysAndLanguagesCell from "../../../View/Mine/CustomKeysAndLanguages/SortKeysAndLanguagesCell";
import LanguageDao from "../../../Dao/Storage/LanguageDao";
import SortableListView from 'react-native-sortable-listview';
import ArrayUtil from "../../../Project/Util/ArrayUtil";
import ProjectSafeAreaView from "../../../Project/View/ProjectSafeAreaView";
import ProjectSingleton from "../../../Project/Util/ProjectSingleton.js";

class SortKeysAndLanguagesPage extends Component {
	constructor(props) {
		super(props);
		// 全部的数据
		this.dataDict = this.props.navigation.state.params;

		// 处理安卓物理返回键
		this.backPress = new ProjectBackPressComponent({backPress: () => this.onBackPress()});

		// 数据读取与写入的工具类，因为一会要用它写入数据
		this.languageDao = new LanguageDao(this.dataDict.flag);
		// 当前页面排序前的数据，仅读取选中的就可以
		this.originalDataArray = [];
		// 当前页面排序后的数据，仅读取选中的就可以
		this.sortedDataArray = [];
	}

	// 处理安卓物理返回键
	onBackPress() {
		this._leftButtonAction();
		return true;
	}

	render() {
		if (!this.sortedDataArray || this.sortedDataArray.length <= 0) {// 如果有数据，就不读取了，因为排序排的就是this.dataArray，那拍完后会重新走render
			// 如果再读取的话，就没有排序效果了
			const {languageState} = this.props;
			const tempArray = this.dataDict.flag === FLAG_LANGUAGE.flag_key ? languageState.keys : languageState.languages;
			// JS的includes无法判断是否包含对象类型，此处render方法会走多次，为避免数据重复，我们清空一下
			let dataArray = [];
			tempArray.map((item) => {
				if (!item) return;
				if (item.checked) {
					dataArray.push(item);
				}
			});

			this.originalDataArray = dataArray;
			this.sortedDataArray = ArrayUtil.clone(this.originalDataArray);
		}

		return (
			<ProjectSafeAreaView style={styles.container} topViewColor={ProjectSingleton.sharedSingleton().themeColor}>
				<ProjectNavigationBar
					title={this.dataDict.title}
					titleViewStyle={this.dataDict.title.length > 20 ? {paddingRight: 40} : null}
					leftButton={ViewUtil.getLeftButton(() => this._leftButtonAction())}
					rightButton={this._getRightButton(() => this._rightButtonAction())}
				/>

				<SortableListView
					data={this.sortedDataArray}
					order={Object.keys(this.sortedDataArray)}
					onRowMoved={e => {
						// 排序的还是this.dataArray
						this.sortedDataArray.splice(e.to, 0, this.sortedDataArray.splice(e.from, 1)[0])
						this.forceUpdate()
					}}
					renderRow={item => this._renderItem(item)}
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
		if (ArrayUtil.isEqual(this.originalDataArray, this.sortedDataArray)) {
			NavigationUtil.goBack();
		} else {
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
		if (ArrayUtil.isEqual(this.originalDataArray, this.sortedDataArray)) {
			Alert.alert('提示', '没有修改需要保存', [
				{
					'text': '确定',
				}
			]);

			return;
		}

		// 存储
		this.languageDao.save(this._getAllSortedDataArray());

		// 发出action，更新应用State，以便最热模块和趋势模块及时更新数据
		this.props.loadLanguage(this.dataDict.flag);

		// 一切ok，返回去
		NavigationUtil.goBack();
	}

	_renderItem(item) {
		return (
			<SortKeysAndLanguagesCell
				dataDict={item}
			/>
		);
	}

	// 计算排序后全部的数据，即我们要保存的数据（选中+未选中）
	_getAllSortedDataArray() {
		// 读取排序前全部的数据
		const {languageState} = this.props;
		let originalAllDataArray = this.dataDict.flag === FLAG_LANGUAGE.flag_key ? languageState.keys : ArrayUtil.clone(languageState.languages);
		let sortedAllDataArray = ArrayUtil.clone(originalAllDataArray);

		for (let i = 0, len = this.originalDataArray.length; i < len; i++) {
			let item = this.originalDataArray[i];

			let index = this._findIndex(item, originalAllDataArray);

			sortedAllDataArray.splice(index, 1, this.sortedDataArray[i]);
		}

		// 得到排序后全部的数据，我们就可以拿着去存储了
		return sortedAllDataArray;
	}

	// 不知道为啥indexOf这里取不到下标，所以自己用笨办法写了一个
	_findIndex(samllArrItem, largeArr) {
		for (let j = 0, len = largeArr.length; j < len; j++) {
			if (samllArrItem.name === largeArr[j].name) {
				return j;
			}
		}
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

const SortKeysAndLanguagesPageContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(SortKeysAndLanguagesPage);

export default SortKeysAndLanguagesPageContainer;

