import React, {Component} from 'react';
import {View} from 'react-native';

import {createBottomTabNavigator, createAppContainer} from "react-navigation";
import {BottomTabBar} from 'react-navigation-tabs';
import {DeviceEventEmitter} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import Macro from '../Const/Macro';

import FavoritePage from "../Controller/Favorite/FavoritePage";
import TrendingPage from "../Controller/Trending/TrendingPage";
import PopularPage from "../Controller/Popular/PopularPage";
import MyPage from "../Controller/Mine/MinePage";

// 我们会首先定义好所有可能显示的界面的路由配置，然后再去服务端请求要显示那些界面，动态地修改路由配置就能达到动态加载tabBar要显示界面的效果
const allRouteConfigs = {
	// 路由配置
	PopularPage: {
		screen: PopularPage,
		navigationOptions: {
			tabBarLabel: '最热',
			tabBarIcon: ({tintColor}) => (
				<MaterialIcons
					name={'whatshot'}
					size={26}
					style={{color: tintColor}}
				/>
			),
		},
	},
	TrendingPage: {
		screen: TrendingPage,
		navigationOptions: {
			tabBarLabel: '趋势',
			tabBarIcon: ({tintColor}) => (
				<Ionicons
					name={'md-trending-up'}
					size={26}
					style={{color: tintColor}}
				/>
			),
		},
	},
	FavoritePage: {
		screen: FavoritePage,
		navigationOptions: {
			tabBarLabel: '收藏',
			tabBarIcon: ({tintColor}) => (
				<MaterialIcons
					name={'favorite'}
					size={26}
					style={{color: tintColor}}
				/>
			),
		},
	},
	MyPage: {
		screen: MyPage,
		navigationOptions: {
			tabBarLabel: '我的',
			tabBarIcon: ({tintColor}) => (
				<Entypo
					name={'user'}
					size={26}
					style={{color: tintColor}}
				/>
			),
		},
	},
}

// 这个数据的请求，肯定不是在这里请求的，如果在这里请求，那用户就会看到tabbar数量变化的过程
// 肯定是外面提前请求好，存下来，这里直接读取使用
// 读取要展示的界面
const visibleRoutes = ['PopularPage', 'TrendingPage', 'FavoritePage', 'MyPage'];
// const visibleRoutes = ['PopularPage', 'TrendingPage', 'FavoritePage'];
// const visibleRoutes = ['PopularPage', 'TrendingPage'];
// const visibleRoutes = ['PopularPage'];

// 动态加载BottomNavigator的模块，本质就是动态赋值createBottomTabNavigator的路由配置属性而已，没什么神秘的
// 将数组里的数据转换为RouteConfigs
// 这里采用ES6里JS对象属性的简洁写法，JS对象里可以直接写变量，此时属性的名字就是变量名，属性的值就是变量的值
let dynamicRouteConfigs = {};
visibleRoutes.map((route) => {
	dynamicRouteConfigs[route] = allRouteConfigs[route];
});

const DynamicBottomTabNavigator = createBottomTabNavigator(dynamicRouteConfigs, {
	// 自定义TabBar
	// tabBarComponent可以直接接受一个组件，即tabBarComponent: TabBarComponent
	// tabBarComponent也可以接受一个函数返回一个组件，如下，接受一个函数时，会把用createBottomTabNavigator创建的tabbar的props作为参数传给这个函数
	// 因为TabBarComponent完全是我们自定义的一个组件，所以要想让它具备tabbar的功能，就得把用createBottomTabNavigator创建的tabbar的所有props都传递给它，否则它根本就是一个普通组件
	tabBarComponent: (props) => {
		return (
			<TabBarComponentContainer {...props}/>
		)
	},

	tabBarOptions: {
		// 选中颜色
		activeTintColor: Macro.THEME_COLOR,
		// 未选中颜色
		inactiveTintColor: Macro.INACTIVE_TINT_COLOR,
	}
});

// 当我们开发到趋势界面的时候，发现需要自定导航栏的titleView，即RN里的header属性，在这里自定义倒是也没问题，实现倒是能实现，但是有一个弊端
// 那就是导航栏上面显示的东西，可能跟界面的数据有联系，即导航栏需要和界面通信，
// 那要是把自定义导航栏写在这里的话，真得很难受，通信起来会很麻烦
// 于是我们考虑是不是用react-navigation的导航栏在各个界面自己设置，这种想法是对的，但是由于StackNavigator和BottomNavigator这种导航框架的嵌套方式，使得我们无法实现在每个界面分别做导航栏的配置
// 于是，实际开发中我们只能自定义一个导航栏了，就像一个普通的View一样放在每个页面头部，这样导航栏就在当前界面中，通信起来好通信，而把StackNavigator的导航栏全部隐藏掉
DynamicBottomTabNavigator.navigationOptions = ({navigation}) => {
	const {routeName} = navigation.state.routes[navigation.state.index];

	switch (routeName) {
		case 'PopularPage':
			return {header: null};
		case 'TrendingPage':
			return {header: null};
		case 'FavoritePage':
			return {header: null};
		case 'MyPage':
			return {header: null};
	}

	// 每次切换tab都会触发这里
};


// 我们的目的是修改TabBar的主题色，所以我们把TabBarComponent的state交由Redux管理
// 使用React-Redux
import {connect} from 'react-redux';
import NotificationName from "../Const/NotificationName";
import Action from "../Redux/action/rootAction";
import ProjectSingleton from "../Project/Util/ProjectSingleton.js";
import CodePush from "react-native-code-push";
import CodePushPage from "../Controller/Other/CodePushPage";

// staging：'Hqspd-sYzTo-FrAfpR7py9P0pBnF7627d37f-ad25-47e2-a0ef-8a9b98f656cc'
// release：'sMIGG-ocNzGwkB2ZoxpnT1Sr62-47627d37f-ad25-47e2-a0ef-8a9b98f656cc'
const CODEPUSH_KEY = 'sMIGG-ocNzGwkB2ZoxpnT1Sr62-47627d37f-ad25-47e2-a0ef-8a9b98f656cc';

// 第1步：编写UI组件
// 仅负责UI的渲染工作，所需数据只能通过props获得
// 不能处理业务逻辑，不能使用Redux的API
class TabBarComponent extends Component<Props> {
	render() {
		// 搞个单例存储主题色，以便二级、三级界面使用
		ProjectSingleton.sharedSingleton().themeColor = this.props.themeState.themeColor;

		return (
			// TabBarComponent是我们自定义的组件，内部真正实现tabbar效果的其实是BottomTabBar，所以它也需要接收所有的props
			<BottomTabBar
				// BottomTabBar，其实才是真正的TabBar，我们将TabBarComponent.props传递给BottomTabBar组件
				{...this.props}
				// BottomTabBar选中时的颜色
				activeTintColor={this.props.themeState.themeColor}
			/>
		);
	}

	componentDidMount() {
		// 初始化主题色
		this.props.initThemeColor();

		// 去掉报黄
		console.disableYellowBox = true;
	}
}

// 第2步：建立UI组件的props与外界的映射关系
// 你可能会问“这个UI组件是什么添加上这些props的呢”？没错，正是这个添加映射关系的过程为该UI组件添加上了这些props
// 输入逻辑类属性要和应用state里该组件state里的属性建立映射关系
function mapStateToProps(state) {
	return {
		themeState: state.themeState,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		initThemeColor: () => dispatch(Action.initThemeColor()),
	}
}

// 第3步：使用connect方法生成UI组件对应的容器组件
// 将来我们就是使用UI组件的容器组件了，而不是使用UI组件
const TabBarComponentContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(TabBarComponent);

const DynamicBottomNavigatorContainer = createAppContainer(DynamicBottomTabNavigator);

class DynamicBottomNavigatorClass extends Component {
	constructor(props) {
		super(props);

		this.state = {
			// 检测是否有更新
			update: false,
		};
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<DynamicBottomNavigatorContainer
					// 切换tab会触发
					onNavigationStateChange={(preState, newState, action) => {
						// 发出通知
						DeviceEventEmitter.emit(NotificationName.DID_CHANGE_TAB, {
							preState,
							newState,
						})
					}}
				/>

				{/*是否modal出更新提示界面*/}
				{this.state.update ? <CodePushPage/> : null}
			</View>
		)
	}

	componentDidMount() {
		// 检测是否有更新
		CodePush.checkForUpdate(CODEPUSH_KEY)
			.then((update) => {
				if (update) {
					this.setState({update});
				}
			})
	}
}

export default DynamicBottomNavigatorClass;

