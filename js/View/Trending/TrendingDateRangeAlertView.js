import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Modal, TouchableOpacity, DeviceInfo} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DateRange = [{showText: '今天', searchText: 'since=daily'}, {
	showText: '本周',
	searchText: 'since=weekly'
}, {showText: '本月', searchText: 'since=monthly'}];

export default class TrendingDateRangeAlertView extends Component {
	// 这里你就感受到了，如果一个组件的state只是它自己使用，不为别人所使用的，则可以不放在应用State里
	constructor(props) {
		super(props);

		this.state = {
			visible: false,
		}
	}

	render() {
		// 该组件要向外界提供回调，所以就要定义回调函数（类似于block）作为属性，并在合适的地方调用
		// 选择了某个条目之后的回调
		const {didSelect} = this.props;
		return (
			<Modal// Modal组件其实是那个背景层
				// 背景层是否显示
				visible={this.state.visible}
				// 背景层显示和消失时的动画效果
				animationType={'fade'}
				// 背景层是否透明
				transparent={true}
				// 在安卓上用户按下设备的后退按键时触发，该属性在安卓设备上为必填，且会在modal处于开启状态时阻止BackHandler事件
				onRequestClose={() => {
					this.dismiss();
				}}
			>
				<TouchableOpacity
					// 背景层的最底层添加一个TouchableOpacity组件，目的是为了点击整个背景层时可以隐藏背景层
					onPress={() => this.dismiss()}
					// 我们需要让TouchableOpacity占满全屏幕
					style={styles.container}
				>
					<MaterialIcons
						name={'arrow-drop-up'}
						size={36}
						style={{color: 'white', marginTop: DeviceInfo.isIPhoneX_deprecated ? 40 + 24 : 40, marginBottom: -15}}
					/>
					<View style={styles.content}>
						{DateRange.map((item, index, array) => {
							return <TouchableOpacity
								onPress={() => {
									// 消失掉
									this.dismiss();

									// 传出去
									didSelect(array[index])}}
								underlayColor={'transparent'}// 点击时设置成透明色
							>
								<View style={styles.textContainer}>
									<Text style={styles.text}>{array[index].showText}</Text>
								</View>
								{
									index === DateRange.length - 1 ? null : <View
										style={styles.line}>
									</View>
								}
							</TouchableOpacity>
						})}
					</View>
				</TouchableOpacity>
			</Modal>
		);
	}

	show() {
		this.setState({
			visible: true,
		})
	}

	dismiss() {
		this.setState({
			visible: false,
		})
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		alignItems: 'center',
	},
	content: {
		backgroundColor: 'white',
		borderRadius: 3,
		padding: 3,
	},
	textContainer: {
		alignItems: 'center',
	},
	text: {
		color: 'black',
		fontSize: 16,
		fontWeight: '400',
		paddingVertical: 8,
		paddingHorizontal: 26,
	},
	line: {
		backgroundColor: 'gray',
		height: 0.3,
	}
});