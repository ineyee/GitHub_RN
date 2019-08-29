import React, {Component} from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Button,
	FlatList,
	RefreshControl,
	ActivityIndicator,
} from 'react-native';
import {createAppContainer, createMaterialTopTabNavigator} from "react-navigation";
import NavigationUtil from '../../Project/Util/NavigationUtil';
import Toast from 'react-native-easy-toast';
import TrendingCell from "../Trending/TrendingCell";
import Notification from '../../Const/NotificationName';
import {DeviceEventEmitter} from 'react-native';

// 一些常量
const URL = 'https://github.com/trending/';
const DateRange = [{showText: '今天', searchText: 'since=daily'}, {
	showText: '本周',
	searchText: 'since=weekly'
}, {showText: '本月', searchText: 'since=monthly'}];
const kTopNavigatorHeight = 49;// iOS上默认就是49

class TrendingTopNavigator extends Component {
	render() {
		// 读取标签
		const {languages} = this.props;

		// 创建路由
		let dynamicRouteConfigs = {};
		languages.map((item) => {
			if (item.checked) {// 数据里有checked=true代表选中要显示，checked=false代表未选中不要显示
				dynamicRouteConfigs[item.name] = {
					// 很重要的一点，TopNavigator怎么给它下面的页面传递参数，就用下面这样的写法，用一个箭头函数
					screen: () => <DynamicTopNavigatorTabPageContainer {...this.props} selectedType={item.name}/>,
					navigationOptions: {
						tabBarLabel: item.name,
					},
				}
			}
		});

		const TrendingTopNavigatorAppContainer = languages.length > 0 ? createAppContainer(
			createMaterialTopTabNavigator(dynamicRouteConfigs, {
				// TopNavigator的样式
				tabBarOptions: {
					// 整个TopNavigator的样式
					style: {
						// 这样写的话，是整个TopNavigator距离屏幕顶部20，上面有一段空隙，类似安卓，不好看
						// marginTop: 20,
						// 整个TopNavigator的背景色
						backgroundColor: this.props.themeColor,
					},
					// 每个tab的样式
					tabStyle: {
						// 这样写的话，整个TopNavigator距离屏幕顶部是0，只不过所有的tab会距离屏幕顶部20，这个和我们iOS效果很像，好看
						// marginTop: 20,
					},
					// 下面滚动的那一小条的样式
					indicatorStyle: {
						height: 2,
						backgroundColor: 'white',
					},
					// 文字的样式
					labelStyle: {
						fontSize: 14,
					},
					scrollEnabled: true,// 默认为false，TopNavigator所有的tab都会挤在一屏上，不能滑动，内容较多时屏幕就不好看了，设置为true之后，就会自己适应宽度，可滑动
					upperCaseLabel: false,// 默认为true，如果有英文的前提下全大写，这里不要全大写，
				},
				lazy: true,// 一次只渲染一个tab，选到相应的tab，再渲染相应的tab
			})
		) : null;

		return TrendingTopNavigatorAppContainer && <TrendingTopNavigatorAppContainer/>;
	}

	componentDidMount() {
		this.props.loadLanguage(FLAG_LANGUAGE.flag_language);
	}
}

function mapStateToProps_TopNavigator(state) {
	return {
		languages: state.languageState.languages,
	}
}

function mapDispatchToProps_TopNavigator(dispatch) {
	return {
		loadLanguage: (flag) => dispatch(Action.loadLanguage(flag)),
	}
}

const TrendingTopNavigatorContainer = connect(
	mapStateToProps_TopNavigator,
	mapDispatchToProps_TopNavigator,
)(TrendingTopNavigator);

export default TrendingTopNavigatorContainer;

const styles = StyleSheet.create({
	trendingTabPageStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},

	cellStyle: {
		marginBottom: 10,
	}
});

// 使用React-Redux
import {connect} from 'react-redux';
import Action from "../../Redux/action/rootAction";
import FavoriteUtil from "../../Project/Util/FavoriteUtil";
import {FLAG_STORAGE} from "../../Dao/Request/ProjectRequestWithCache";
import {FLAG_LANGUAGE} from "../../Dao/Storage/LanguageDao";
import ProjectHUD from "../../Project/View/ProjectHUD";
import ProjectSingleton from "../../Project/Util/ProjectSingleton.js";
import Macro from "../../Const/Macro";

// 第1步：编写UI组件，我们知道现在响应模块State变化的其实是界面，而不是topTabNavigator，所以就包装TabPage了
// 自定义一个UI组件，TopNavigator的Tab对应的界面
class DynamicTopNavigatorTabPage extends Component<Props> {
	constructor(props) {
		super(props);

		this.dateRange = DateRange[0];// 设置一个初始值
		this.data = [];
		this.state = {
			reloadFlatList: 1,
		}
	}

	render() {
		/**
		 * trendingState大概的数据结构
		 *
		 * trendingState: {
		 * 		iOS: {
		 * 			data: action.data,
		 * 		},
		 * 		error: null,
		 * 		isRefreshing: false,
		 * }
		 */

			// trendingState是Redux关联出来的
			// selectedType是创建该组件时我们自己添加的
		const {trendingState, selectedType} = this.props;
		if (trendingState[selectedType]) {
			this.data = trendingState[selectedType].data;
		}

		return (
			<View style={styles.trendingTabPageStyle}>
				<FlatList
					style={{width: Macro.SCREEN_WIDTH}}// 不知道为什么FlatList横向撑不满，这里解决一下
					data={this.data}
					renderItem={({item, index}) => this._renderItem({item, index})}
					keyExtractor={(item) => item.fullName}// 转换成字符串

					// 下拉刷新
					refreshControl={(
						<RefreshControl
							title={'刷新中...'}
							titleColor={this.props.themeColor}
							tintColor={this.props.themeColor}

							// 第4步：在需要发出action的地方，通过调用props里方法的形式发出一个action就可以了
							onRefresh={() => {
								this._refreshHeader()
							}}// 注意不要忘了写this._fetchData()外面的大括号，否则就与返回值了

							// 注意：因为这里是UI组件，UI组件不能有State，所以是否刷新也应该交给模块State来管理，而不能写在这里
							// 这也是一个例子：我们无法在写模块reducer的一开始就确定该模块的数据结构是怎样的，后面遇到什么就添加什么
							refreshing={trendingState.isRefreshing}
						/>
					)}
				/>

				<ProjectHUD
					color={ProjectSingleton.sharedSingleton().themeColor}
					visible={trendingState.showHUD}
					verticalOffSet={-Macro.NAVIGATION_BAR_HEIGHT + -kTopNavigatorHeight}
				/>
			</View>
		);
	}

	// 界面加载成功之后，发起网络请求
	componentDidMount() {
		this._fetchData();

		// 在通知中心注册观察者
		this.listener = DeviceEventEmitter.addListener(
			// 通知的名字
			Notification.DID_CHANGE_DATE_RANGE,
			// 通知的回调
			(notificationData) => {
				this.dateRange = notificationData;
				this._refreshHeader();
			});

		// 在通知中心注册观察者
		this.listener1 = DeviceEventEmitter.addListener(
			// 通知的名字
			Notification.DID_CHANGE_FAVORITE_STATE_TRENDING,
			// 通知的回调
			(notificationData) => {
				let newItem = notificationData.newItem;
				for (let index in this.data) {
					if (this.data[index].fullName === newItem.fullName) {
						// 详情界面传过来的newItem
						// 替换本页数据
						this.data.splice(index, 1, newItem);

						break;
					}
				}

				// 刷新UI
				this.setState({
					reloadFlatList: this.state.reloadFlatList++,
				});

				// 持久化
				FavoriteUtil.didSelectedFavorite(FLAG_STORAGE.flag_trending, newItem);
			});
	}

	componentWillUnmount() {
		// 移除通知的观察者
		if (this.listener) {
			this.listener.remove();
		}

		if (this.listener1) {
			this.listener1.remove();
		}
	}

	_fetchData() {
		// this.props能获取到selectedType，我们传进来的
		const {selectedType, fetchData} = this.props;

		const url = this._genUrl(selectedType);

		// 第4步：在需要发出action的地方，通过调用props里方法的形式发出一个action就可以了
		fetchData(url, selectedType);
	}

	_refreshHeader() {
		const {selectedType, refreshHeader} = this.props;

		const url = this._genUrl(selectedType);

		refreshHeader(url, selectedType);
	}

	_genUrl(selectedType) {
		return URL + selectedType + '?' + this.dateRange.searchText;
	}

	_renderItem({item, index}) {
		return (
			<TrendingCell
				themeColor={this.props.themeColor}
				cellDict={item}
				didSelectedCell={() => {
					// 下个界面需要这个item，我们给它传过去
					NavigationUtil.navigate('DetailPage', {
						dataDict: item,
						flag: FLAG_STORAGE.flag_trending,
						callback: (newItem) => {
							// 详情界面传过来的newItem
							// 替换本页数据
							this.data.splice(index, 1, newItem);
							// 刷新UI
							this.setState({
								reloadFlatList: this.state.reloadFlatList++,
							});

							// 持久化
							FavoriteUtil.didSelectedFavorite(FLAG_STORAGE.flag_trending, newItem);
						}
					});
				}}
				didSelectedFavorite={() => {
					// 假设这里请求了接口并返回了新数据
					const newItem = {
						...item,
						isFavorite: !item.isFavorite,
					}
					// 替换本页数据
					this.data.splice(index, 1, newItem);
					// 刷新UI
					this.setState({
						reloadFlatList: this.state.reloadFlatList++,
					});

					// 持久化
					FavoriteUtil.didSelectedFavorite(FLAG_STORAGE.flag_trending, newItem);
				}}
			/>
		);
	}
}


// 第2步：建立UI组件的props与外界的映射关系
// 你可能会问“这个UI组件是什么添加上这些props的呢”？没错，正是这个添加映射关系的过程为该UI组件添加上了这些props
// 输入逻辑类属性要和应用state里该组件state里的属性建立映射关系
function mapStateToProps(state) {
	return {
		trendingState: state.trendingState,
	}
}

// 输出逻辑类属性要和dispatch(action)建立映射关系
function mapDispatchToProps(dispatch) {
	return {
		fetchData: (url, selectedType) => dispatch(Action.trendingFetchData(url, selectedType)),
		refreshHeader: (url, selectedType) => dispatch(Action.trendingRefreshHeader(url, selectedType)),
	}
}

// 第3步：使用connect方法生成UI组件对应的容器组件
// 将来我们就是使用UI组件的容器组件了，而不是使用UI组件
const DynamicTopNavigatorTabPageContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(DynamicTopNavigatorTabPage);