import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class ViewUtil {
	static getLeftButton(callback) {
		return (
			<TouchableOpacity
				style={{padding: 10, paddingLeft: 15}}// 其实设置marginLeft不如设置paddingLeft，因为图标本身很小，marginLeft只是负责位置，而paddingLeft还能让组件变大，所以padding还有是点击区域就会变大的功能
				onPress={() => {
					callback();
				}}
			>
				<Ionicons
					name={'ios-arrow-back'}
					size={24}
					style={{color: 'white'}}
				/>
			</TouchableOpacity>
		);
	}
}