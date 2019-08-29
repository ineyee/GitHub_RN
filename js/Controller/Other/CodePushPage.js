import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	Modal,
} from 'react-native';

import CodePush from "react-native-code-push";
import ProjectSingleton from "../../Project/Util/ProjectSingleton.js";
import * as Progress from 'react-native-progress';

export default class CodePushPage extends Component {
	/*-----------生命周期方法-----------*/

	constructor(props) {
		super(props);

		this.state = {
			// 状态提示文本
			syncMessage: '',
			// 因为我们并非纯自定义更新提示的那一套额，而是在CodePush.sync那个弹出框的下面又塞了一个这样的CodePushPage，
			// 所以有些界面的逻辑需要通过一些属性来控制一下，而这些界面逻辑正好可以由CodePush的状态来控制
			showUpdateView: false,
			// 下载进度
			currentProgress: 0,
			currentProgressPercent: '',
		};
	}

	render() {
		return (
			this._genContent()
		);
	}

	componentDidMount() {
		this.syncImmediate();
	}


	/*-----------CodePush相关方法-----------*/

	// syncImmediate
	syncImmediate() {
		// CodePush会通过该方法帮我们自动完成检查更新、弹出更新提示框、下载、安装、是否立即重启App呈现更新等一系列操作。
		CodePush.sync({
				// 弹出更新提示框
				updateDialog: {
					// 标题
					title: '发现新版本',
					// 是否显示更新description，默认false
					appendReleaseDescription: true,
					// 更新description的前缀
					descriptionPrefix: '\n更新内容：\n',

					// 强制更新的message
					mandatoryUpdateMessage: '',
					// 强制更新的按钮文本
					mandatoryContinueButtonLabel: '立即更新',

					// 非强制更新的message
					optionalUpdateMessage: '',
					// 非强制更新的取消按钮文本
					optionalIgnoreButtonLabel: '残忍拒绝',
					// 非强制更新的更新按钮文本
					optionalInstallButtonLabel: '立即更新',
				},

				// 立即重启App呈现更新
				installMode: CodePush.InstallMode.IMMEDIATE,
			},

			// CodePush状态的变化
			this.codePushStatusDidChange.bind(this),
			// CodePush下载进度的检测
			this.codePushDownloadDidProgress.bind(this)
		);
	}

	// CodePush状态的变化
	codePushStatusDidChange(syncStatus) {
		switch (syncStatus) {
			case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
				this.setState({syncMessage: "检测更新中...", showUpdateView: false});
				break;
			case CodePush.SyncStatus.AWAITING_USER_ACTION:
				this.setState({syncMessage: "请做出你的选择...", showUpdateView: false});
				break;
			case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
				this.setState({syncMessage: "下载更新中...", showUpdateView: true});
				break;
			case CodePush.SyncStatus.INSTALLING_UPDATE:
				this.setState({syncMessage: "安装更新中...", showUpdateView: true});
				break;
			case CodePush.SyncStatus.UP_TO_DATE:
				this.setState({syncMessage: "已经是最新的了...", showUpdateView: false});
				break;
			case CodePush.SyncStatus.UPDATE_IGNORED:
				this.setState({syncMessage: "您选择了残忍拒绝", showUpdateView: false});
				break;
			case CodePush.SyncStatus.UPDATE_INSTALLED:
				this.setState({syncMessage: "您选择了立即更新", showUpdateView: false});
				break;
			case CodePush.SyncStatus.UNKNOWN_ERROR:
				this.setState({syncMessage: "出错啦...", showUpdateView: false});
				break;
		}
	}

	// CodePush下载进度的检测
	codePushDownloadDidProgress(progress) {
		// number转小数，并四舍五入保留指定位数
		const currentProgress = (parseFloat(progress.receivedBytes / progress.totalBytes)).toFixed(2);
		const currentProgressPercent = progress.receivedBytes + '/' + progress.totalBytes + ' bytes';
		this.setState({
			currentProgress,
			currentProgressPercent,
		});
	}


	/*-----------私有方法-----------*/

	_genContent() {
		return(
			this.state.showUpdateView ? (
				<Modal
					// 背景层是否显示
					visible={true}
					// 背景层显示和消失时的动画效果
					animationType={'fade'}
					// 背景层是否透明
					transparent={true}
					// 在安卓上用户按下设备的后退按键时触发，该属性在安卓设备上为必填，且会在modal处于开启状态时阻止BackHandler事件
					onRequestClose={() => {

					}}
				>
					<View style={styles.container}>
						<Progress.Bar
							style={styles.progress}
							progress={this.state.currentProgress}
							indeterminate={false}
							color={'white'}
						/>
						<View style={{flexDirection: 'row'}}>
							<Text style={[styles.text, {textAlign: 'right'}]}>{this.state.syncMessage}</Text>
							<Text style={[styles.text, {textAlign: 'left'}]}>{this.state.currentProgressPercent}</Text>
						</View>
					</View>
				</Modal>
			) : null
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
	},
	progress: {
		margin: 10,
	},
	text: {
		marginTop: 30,
		color: 'white',
	},
});