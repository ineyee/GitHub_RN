/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	FlatList,
	RefreshControl,
	DeviceEventEmitter,
	ActivityIndicator,
} from 'react-native';
import NavigationUtil from "../../Project/Util/NavigationUtil";
import ProjectNavigationBar from '../../Project/View/ProjectNavigationBar.js';
import ViewUtil from "../../Project/Util/ViewUtil";
import ProjectBackPressComponent from "../../Project/Util/ProjectBackPressComponent";
import Macro from "../../Const/Macro";
import ProjectNoDataView from "../../Project/View/ProjectNoDataView";
import FavoriteUtil from "../../Project/Util/FavoriteUtil";
import {FLAG_STORAGE} from "../../Dao/Request/ProjectRequestWithCache";
import ProjectSingleton from "../../Project/Util/ProjectSingleton";
import ProjectRequest from "../../Dao/Request/ProjectRequest";
import PopularCell from '../../View/Popular/PopularCell';
import Toast from 'react-native-easy-toast';
import ProjectHUD from "../../Project/View/ProjectHUD";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {wrappedIsFavoriteKeyData} from '../../Redux/action/popularAction'
import NotificationName from "../../Const/NotificationName";
import ProjectSafeAreaView from "../../Project/View/ProjectSafeAreaView";

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=starts'

export default class SearchPage extends Component {
	/*-----------生命周期-----------*/

	constructor(props) {
		super(props);

		// 处理安卓物理返回键
		this.backPress = new ProjectBackPressComponent({backPress: () => this.onBackPress()});

		// 本页全部的数据，接口总共给了30条，我们来自己模拟分页的效果
		this.allData = [];
		// 一页加载几条数据
		this.pageSize = 10;
		// 加载第几页数据
		this.pageIndex = 1;

		// 搜索的内容
		this.searchText = '';

		this.state = {
			// 本页数据
			dataArray: [],

			// 本页是否正处于刷新状态中，即是否展示下拉刷新组件
			isRefreshing: false,
			// 本页是否还有更多数据，即是否展示上拉加载组件
			noMoreData: false,
		};
	}

	// 处理安卓物理返回键
	onBackPress() {
		this._rightButtonAction();
		return true;
	}

	render() {
		return (
			<ProjectSafeAreaView style={styles.container} topViewColor={ProjectSingleton.sharedSingleton().themeColor}>
				<ProjectNavigationBar
					hasLeftButton={false}
					titleView={this._renderTitleView()}
					rightButton={this._getRightButton(() => this._rightButtonAction())}
				/>

				{this._renderContentView()}

				<ProjectHUD
					ref={hud => this.hud = hud}
					color={ProjectSingleton.sharedSingleton().themeColor}
				/>

				<Toast
					ref={toast => this.toast = toast}
					position={'bottom'}
				/>
			</ProjectSafeAreaView>
		);
	}

	componentDidMount() {
		// 处理安卓物理返回键
		this.backPress.componentDidMount();
	}

	componentWillUnmount() {
		// 处理安卓物理返回键
		this.backPress.componentWillUnmount();
	}


	/*-----------网络请求-----------*/

	_fetchData() {
		// 展示hud
		this.hud.show();

		const url = URL + this.searchText + QUERY_STR;
		ProjectRequest.get(url)
			.then(JsonData => {
				// 隐藏hud
				this.hud.dismiss();

				wrappedIsFavoriteKeyData(JsonData.items, (wrappedIsFavoriteKeyJsonData) => {
					this.allData = wrappedIsFavoriteKeyJsonData;

					// 截取第1页的数据
					if (this.allData.length < this.pageIndex * this.pageSize) {
						this.setState({
							dataArray: this.allData.slice((this.pageIndex - 1) * this.pageSize, this.allData.length),
						});
					} else {
						this.setState({
							dataArray: this.allData.slice((this.pageIndex - 1) * this.pageSize, (this.pageIndex - 1) * this.pageSize + this.pageSize),
						});
					}
				});


			})
			.catch(error => {
				// 隐藏hud
				this.hud.dismiss();

				this.toast.show('搜索，请求数据失败');
			})
	}

	_refreshHeader() {
		// 加载第几页数据置位
		this.pageIndex = 1;
		// 本页是否还有更多数据置位
		this.setState({
			noMoreData: false,
		});
		// 展示刷新小圈
		this.setState({
			isRefreshing: true,
		});

		const url = URL + this.searchText + QUERY_STR;
		ProjectRequest.get(url)
			.then(JsonData => {
				// 隐藏刷新小圈
				this.setState({
					isRefreshing: false,
				});

				wrappedIsFavoriteKeyData(JsonData.items, (wrappedIsFavoriteKeyJsonData) => {
					this.allData = wrappedIsFavoriteKeyJsonData;

					// 截取第1页的数据
					if (this.allData.length < this.pageIndex * this.pageSize) {
						this.setState({
							dataArray: this.allData.slice((this.pageIndex - 1) * this.pageSize, this.allData.length),
						});
					} else {
						this.setState({
							dataArray: this.allData.slice((this.pageIndex - 1) * this.pageSize, (this.pageIndex - 1) * this.pageSize + this.pageSize),
						});
					}
				});


			})
			.catch(error => {
				// 隐藏刷新小圈
				this.setState({
					isRefreshing: false,
				});

				this.toast.show('搜索，请求数据失败');
			})
	}

	_refreshFooter() {
		// 加载第几页数据加1
		this.pageIndex++;

		// 截取第N页的数据
		if (this.allData.length < this.pageIndex * this.pageSize) {
			const tempDataArray = this.allData.slice((this.pageIndex - 1) * this.pageSize, this.allData.length);

			if (tempDataArray.length === 0) {
				this.setState({
					noMoreData: true,
				});

				this.toast.show('没有更多数据了');

				return;
			}

			this.state.dataArray.push(...tempDataArray);

			this.setState({
				dataArray: this.state.dataArray,
			});
		} else {
			const tempDataArray = this.allData.slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize);
			this.state.dataArray.push(...tempDataArray);

			this.setState({
				dataArray: this.state.dataArray,
			});
		}
	}


	/*-----------私有方法-----------*/

	_getRightButton(callBack) {
		return (
			<TouchableOpacity
				onPress={callBack}
			>
				<Text style={styles.rightButton}>{'取消'}</Text>
			</TouchableOpacity>
		);
	}

	_renderTitleView() {
		return (
			<View style={styles.titleView}>
				<View style={styles.ioniconsView}>
					<Ionicons
						name={'ios-search'}
						size={24}
						style={{color: '#999999'}}
					/>
				</View>

				<TextInput// RN里的TextInput既可以做TextField使用，也可以做TextView使用，区别就是multiline属性的设置
					/**
					 * 默认值为false，当TextField使用，如果为true，就是当作TextView使用。
					 *
					 * 注意安卓上如果设置multiline = {true}，文本默认会垂直居中，可设置textAlignVertical: 'top'样式来使其居顶显示。
					 */
					multiline={false}
					// 引用标记
					ref={searchTextInput => this.searchTextInput = searchTextInput}
					// 做好布局再传给ProjectNavigationBar
					style={styles.searchTextInput}


					/*-----------一些常用属性的配置-----------*/
					// 占位文本
					placeholder={'请输入搜索内容'}
					// 内容，类似于iOS的textFiled.text
					// value={'嗨，你好'}

					// 是否密文输入，默认值为false。multiline={true}时不可用。
					secureTextEntry={false}

					/**
					 * 常用键盘的类型
					 *
					 * default：普通文本键盘
					 * number-pad：数字键盘，不带小数点，仅iOS能用
					 * numeric：数字键盘，带小数点
					 * phone-pad：电话键盘
					 * email-address：邮件键盘
					 */
					keyboardType={'default'}

					// 类似于iOS的becomeFirstResponder，如果设置为true，textInput会自动在界面的componentDidMount执行后获得焦点，默认为false
					autoFocus={true}

					/**
					 * 是否要在文本框右侧显示小叉号按钮，仅在单行模式下可用，默认值为never。
					 *
					 * never
					 * while-editing
					 * unless-editing
					 * always
					 */
					clearButtonMode={'while-editing'}
					// 是否一选中textInput，准备编辑时就清空文本框，默认为false。
					clearTextOnFocus={false}

					// 限制文本框中最多的字符数。使用这个属性而不用JS逻辑去实现，可以避免闪烁的现象。
					maxLength={1111}

					// 文本框是否可编辑，默认值为true。
					editable={true}


					/*-----------常用事件的处理，以下是几个方法触发的先后顺序-----------*/
					// 当文本框获得焦点的时候调用此回调函数，即当输入框开始编辑时。
					onFocus={() => {
						// 清空数据但是不清空搜索内容
						this.setState({
							dataArray: [],
						})
					}}
					// 文本框内容变化时会调用此回调函数，实时调用的，会把改变后的文本会作为参数传递。
					// 注意：通过onChangeText从TextInput里取值这是目前使用TextInput唯一的做法，不要通过别的方法取TextInput的值！
					// 注意：别的事件函数顶多是辅助修改搜索值的作用。
					onChangeText={(text) => {
						this.searchText = text;
					}}
					// 当文本框失去焦点的时候调用此回调函数，即当输入结束收回键盘时。
					onBlur={() => {
						console.log('onBlur')
					}}


					/*-----------键盘右下角“确认”按钮的相关处理-----------*/
					/**
					 * “确认”按钮显示的内容，我们常用的其实就两个
					 *
					 * done：完成
					 * search：搜索
					 */
					returnKeyType={'search'}
					// 如果为true，键盘会在文本框内没有文字的时候禁用确认按钮。默认值为false。
					enablesReturnKeyAutomatically={true}
					// 如果为true，当我们点击键盘上的确认按钮时，TextInput会失焦。对于单行输入框默认值为true，多行则为false。
					// 注意：对于多行输入框来说，如果将blurOnSubmit设为true，则在按下回车键时就会失去焦点同时触发onSubmitEditing事件，而不会换行。
					blurOnSubmit={true}
					// 此回调函数当软键盘的确定/提交按钮被按下的时候调用此函数，所传参数为{nativeEvent: {text, eventCount, target}}。如果multiline={true}，此属性不可用。
					// 如果点这个按钮提交数据，onSubmitEditing会在onBlur方法之前触发
					onSubmitEditing={() => {
						this._fetchData();
					}}
				/>
			</View>
		);
	}

	_rightButtonAction() {
		// 取消搜索
		// this.cancelRequest.cancel();

		// 返回
		NavigationUtil.goBack();
	}

	_renderContentView() {
		if (this.state.dataArray.length === 0) {
			return (
				<ProjectNoDataView/>
			)
		} else {
			return (
				<FlatList
					data={this.state.dataArray}
					renderItem={({item, index}) => this._renderItem({item, index})}
					keyExtractor={(item) => '' + item.id}

					// 下拉刷新
					refreshControl={(
						<RefreshControl
							title={'刷新中...'}
							titleColor={ProjectSingleton.sharedSingleton().themeColor}
							tintColor={ProjectSingleton.sharedSingleton().themeColor}

							onRefresh={() => {
								this._refreshHeader()
							}}

							refreshing={this.state.isRefreshing}
						/>
					)}

					// 上拉加载
					ListFooterComponent={() => this._createRefreshFooter()}
					onEndReachedThreshold={0}
					// 注意：但是这里有两个问题
					// 1、这个方法每次上拉会被触发两次，不知道为什么
					// 2、达不到iOS、安卓的效果，即一滑到底部就刷新，而不是我确确实实松手后才刷新（这个不予解决，其实这不能算是一个bug，只是效果不同而已）
					onEndReached={() => {
						// 延迟100ms，这是一个经验值，以确保onEndReached执行前，onMomentumScrollBegin肯定已经执行了
						setTimeout(() => {
							if (this.shouldRefreshFooter) {
								this._refreshFooter();
								this.shouldRefreshFooter = false;
							}
						}, 100);
					}}
					onMomentumScrollBegin={() => {// flatlist开始滚动时调用，修复一进界面就会调用onEndReached方法的bug，即上面的第一个bug
						this.shouldRefreshFooter = true;
					}}
				/>
			)
		}
	}

	// 上拉加载组件
	_createRefreshFooter() {
		if (!this.state.noMoreData) {
			return (
				<View style={{justifyContent: 'center', alignItems: 'center'}}>
					<ActivityIndicator
						size={'large'}
						color={ProjectSingleton.sharedSingleton().themeColor}
						animating={true}
					/>
					<Text style={{color:ProjectSingleton.sharedSingleton().themeColor, fontSize: 12, margin: 5}}>{'加载更多中...'}</Text>
				</View>
			);
		} else {
			return null;
		}
	}

	_renderItem({item, index}) {
		return (
			<PopularCell
				themeColor={ProjectSingleton.sharedSingleton().themeColor}
				cellDict={item}
				didSelectedCell={() => {
					// 下个界面需要这个item，我们给它传过去
					NavigationUtil.navigate('DetailPage', {
						dataDict: item,
						flag: FLAG_STORAGE.flag_popular,
						callback: (newItem) => {
							// 详情界面传过来的newItem
							// 替换本页数据
							this.state.dataArray.splice(index, 1, newItem);

							// 刷新UI
							this.setState({
								dataArray: this.state.dataArray,
							});

							// 持久化
							FavoriteUtil.didSelectedFavorite(FLAG_STORAGE.flag_popular, newItem);

							// 发出通知，详情界面点的话，也发一下
							DeviceEventEmitter.emit(NotificationName.DID_CHANGE_FAVORITE_STATE_POPULAR, {
								newItem,
							})
						}
					});
				}}
				didSelectedFavorite={() => {
					// 假设这里请求了接口并返回了新数据
					const newItem = {
						...item,
						isFavorite: !item.isFavorite,
					};

					// 替换本页数据
					this.state.dataArray.splice(index, 1, newItem);

					// 刷新UI
					this.setState({
						dataArray: this.state.dataArray,
					});

					// 持久化
					FavoriteUtil.didSelectedFavorite(FLAG_STORAGE.flag_popular, newItem);

					// 发出通知，详情界面点的话，也发一下
					DeviceEventEmitter.emit(NotificationName.DID_CHANGE_FAVORITE_STATE_POPULAR, {
						newItem,
					})
				}}
			/>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	rightButton: {
		fontSize: 14,
		color: '#ffffff',
		padding: 5,
		paddingRight: 15,
	},
	titleView: {
		flexDirection: 'row',
		borderRadius: 4,
	},
	ioniconsView: {
		justifyContent: 'center',
		alignItems: 'center',

		width: Platform.OS === 'ios' ? 30 : 36,
		height: Platform.OS === 'ios' ? 30 : 36,

		opacity: 0.8,
		backgroundColor: 'white',

		borderTopLeftRadius: 4,
		borderBottomLeftRadius: 4,
	},
	searchTextInput: {
		// 因为ProjectNavigationBar里面是横向排列的，所以我们这里用flex: 1是撑满横向的剩余空间，让它自适应宽度
		width: Macro.SCREEN_WIDTH - 100,
		// 上下给个固定高度就可以了，因为导航栏就是固定高度的嘛，而且ProjectNavigationBar里面设置了竖向居中显示，是没法自适应高度的，就是让你给固定高度
		height: (Platform.OS === 'ios') ? 30 : 36,

		opacity: 0.8,
		backgroundColor: 'white',

		borderTopRightRadius: 4,
		borderBottomRightRadius: 4,
	},
});

