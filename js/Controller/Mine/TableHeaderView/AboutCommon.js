import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Dimensions, DeviceInfo} from 'react-native';
import NavigationUtil from "../../../Project/Util/NavigationUtil";
import ProjectBackPressComponent from "../../../Project/Util/ProjectBackPressComponent";
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ViewUtil from "../../../Project/Util/ViewUtil";
import Macro from "../../../Const/Macro";
import {PropTypes} from 'prop-types';
import ProjectSingleton from "../../../Project/Util/ProjectSingleton.js";

const AVATAR_SIZE = 90;
const PARALLAX_HEADER_HEIGHT = 300;
const Top = DeviceInfo.isIPhoneX_deprecated ? 24 : 0;
const STICKY_HEADER_HEIGHT = Platform.OS === 'ios' ? 44 + 20 + Top : 50;
const window = Dimensions.get('window');

export default class AboutCommon extends Component {
	static propTypes = {
		params: PropTypes.object.isRequired,
		contentView: PropTypes.element.isRequired,
	};

	constructor(props) {
		super(props);

		// 处理安卓物理返回键
		this.backPress = new ProjectBackPressComponent({backPress: () => this.onBackPress()});
	}

	render() {
		const {params, contentView} = this.props;

		const config = this.getParallaxRenderConfig(params);

		return (
			<ParallaxScrollView
				// 上面可拉伸区域的背景色，以及划上去后出现的导航栏的颜色
				backgroundColor={ProjectSingleton.sharedSingleton().themeColor}
				// 下面不可拉伸区域的背景色
				contentBackgroundColor={Macro.VC_BACKGROUND_COLOR}
				// 可拉伸的区头的高度
				parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
				// 划上去，出现的导航栏的高度
				stickyHeaderHeight={STICKY_HEADER_HEIGHT}
				// 拉伸效果的速度
				backgroundScrollSpeed={1}
				// 渲染各个部分，因为东西多，我们专门在一个方法里写好了，现在打散就行了
				{...config}
			>

				{/*上面是可拉伸区域，这个contentView是界面下面的tableViewCell的内容区域，这也是外面传进来的*/}
				{contentView}
			</ParallaxScrollView>
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

	// 处理安卓物理返回键
	onBackPress() {
		NavigationUtil.goBack();
		return true;
	}

	getParallaxRenderConfig(params) {
		// 读取出要显示的那个头像
		let avatar = typeof(params.avatar) === 'string' ? {uri: params.avatar} : params.avatar;

		let config = {};

		// 可拉伸区域的那个图片
		config.renderBackground = () => (
			<View key="background">
				<Image source={{
					uri: params.backgroundImg,
					width: window.width,
					height: PARALLAX_HEADER_HEIGHT
				}}/>
				<View style={{
					position: 'absolute',
					top: 0,
					width: window.width,
					backgroundColor: 'rgba(0,0,0,.4)',
					height: PARALLAX_HEADER_HEIGHT
				}}/>
			</View>
		);

		// 可拉伸区域那个图片上要显示的元素
		config.renderForeground = () => (
			<View key="parallax-header" style={styles.parallaxHeader}>
				<Image
					style={styles.avatar}
					source={avatar}/>
				<Text style={styles.sectionSpeakerText}>
					{params.name}
				</Text>
				<Text style={styles.sectionTitleText}>
					{params.description}
				</Text>
			</View>
		);

		// 本来隐藏，但是换上去会显示出来的那部分，类似于导航栏的title那个地方
		config.renderStickyHeader = () => (
			<View key="sticky-header" style={styles.stickySection}>
				<Text style={styles.stickySectionText}>{params.name}</Text>
			</View>
		);

		// 固定在顶部不动的东西，例如返回按钮和分享按钮
		config.renderFixedHeader = () => (
			<View key="fixed-header" style={styles.fixedSection}>
				<View style={{justifyContent: 'center', paddingTop:Platform.OS === 'ios' ? 20 : 0}}>
					{ViewUtil.getLeftButton(() => NavigationUtil.goBack())}
				</View>
			</View>
		);

		return config;
	}

	onShare() {

	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black'
	},
	background: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: window.width,
		height: PARALLAX_HEADER_HEIGHT
	},
	stickySection: {
		height: STICKY_HEADER_HEIGHT,
		width: window.width,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	stickySectionText: {
		color: 'white',
		fontSize: 17,
		margin: 10
	},
	fixedSection: {
		position: 'absolute',
		top: Top,
		right: 0,
		bottom: 0,
		left: 0,
	},
	fixedSectionText: {
		color: '#999',
		fontSize: 20
	},
	parallaxHeader: {
		alignItems: 'center',
		flex: 1,
		flexDirection: 'column',
		paddingTop: 100
	},
	avatar: {
		marginBottom: 10,
		borderRadius: AVATAR_SIZE / 2,
		width: AVATAR_SIZE,
		height: AVATAR_SIZE,
	},
	sectionSpeakerText: {
		color: 'white',
		fontSize: 16,
		paddingVertical: 5
	},
	sectionTitleText: {
		color: 'white',
		fontSize: 14,
		paddingVertical: 5,
		paddingHorizontal:5,
	},
});