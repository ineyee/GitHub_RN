import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class PopularCell extends Component<Props> {
	render() {
		// 把数据传进来，类似于我们iOS在自定义cell时的那个dataDict
		const {cellDict} = this.props;
		if (!cellDict) return null;

		let favoriteButton = (
			<TouchableOpacity
				onPress={() => this.props.didSelectedFavorite()}
				// 增大点击区域
				style={{padding: 6}}
				// 按下去的颜色，透明
				underlayColor={'transparent'}
			>
				<FontAwesome
					name={cellDict.isFavorite ? 'star' : 'star-o'}
					size={22}
					color={this.props.themeColor}
				/>
			</TouchableOpacity>
		)

		return (
			<TouchableOpacity style={styles.container} onPress={() => this.props.didSelectedCell()}>
				<Text style={styles.full_name}>{cellDict.full_name}</Text>

				<Text style={styles.description}>{cellDict.description}</Text>

				<View style={styles.bottomView}>
					<View style={styles.bottomViewSmallContainer}>
						<Text style={styles.bottomViewText}>{'Author:'}</Text>
						<Image
							style={styles.avatar}
							source={{uri: cellDict.owner.avatar_url}}
						/>
					</View>

					<View style={{flexDirection: 'row'}}>
						<Text style={styles.bottomViewText}>{'Star:'}</Text>
						<Text style={styles.bottomViewText}>{cellDict.stargazers_count}</Text>
					</View>

					{favoriteButton}
				</View>
			</TouchableOpacity>
		);
	}
}

// 注意RN里虽然和我们iOS布局的思路是一样的，但是我发现它们布局更喜欢让控件去自适应宽高，所以如果不是必要，就可以让组件自适应宽高，即不专门写宽高这个约束
// RN里更多的是让组件自适应宽高，我们着重去关心组件的Flex布局那些属性和组件之间的间距什么的就可以了
const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',

		// 外边距
		marginTop: 3,
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 3,

		// 内边距
		padding: 10,

		// 边框
		borderWidth: 0.5,
		borderColor: '#dddddd',
		borderRadius: 2,

		// iOS的阴影
		shadowColor: 'gray',
		shadowOffset: {width: 3, height: 2},
		shadowOpacity: 0.4,
		shadowRadius: 1,
		// 安卓的阴影
		elevation: 2,
	},
	full_name: {
		fontSize: 16,
		color: '#212121',
		marginBottom: 2,
	},
	description: {
		fontSize: 14,
		color: '#757575',
		marginBottom: 5,
	},
	bottomView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	bottomViewSmallContainer:{
		flexDirection: 'row',
		alignItems: 'center',
	},
	bottomViewText:{
		fontSize:14
	},
	// Image必须给宽高，否则无法显示
	avatar: {
		width: 22,
		height: 22,
	}
});