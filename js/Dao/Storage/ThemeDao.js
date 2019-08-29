/**
 * AsyncStorage和NSUserDefaults是一样的，它们的写入和读取操作都是异步的
 */

import {AsyncStorage} from "react-native";
import AllThemeColor from "../../Const/AllThemeColor";

// 持久化时的key
const THEME_COLOR = 'themeColor';

export default class ThemeDao {
	/**
	 * 存储主题色
	 * @param themeColor 本身就是个颜色字符串，所以可以直接存储
	 */
	static saveThemeColor(themeColor) {
		AsyncStorage.setItem(THEME_COLOR, themeColor, error => {
			if (error) {
				console.log('更换主题色，写入数据出错：', error);
			}
		});
	}

	/**
	 * 读取主题色：因为读取主题色是异步操作，所以我们得用Promise把读取结果给它传出去
	 * @returns {Promise<any> | Promise}
	 */
	static getThemeColor() {
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem(THEME_COLOR, (error, value) => {
				if (error) {
					reject(error);
				} else {
					if (!value) {// 数据库中还没有存主题色
						// 那就搞个默认的主题色
						value = AllThemeColor.Default;

						// 存起来
						this.saveThemeColor(value);
					}

					// 传出去
					resolve(value);
				}
			});
		});
	}
}