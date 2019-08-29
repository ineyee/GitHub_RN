/**
 * 所有本地持久化的数据都通过dao文件给外界写入和读取
 *
 * 这里的这个dao为的是最热和趋势模块顶部标签栏数据的写入和读取，数据库里存的结构是：
 *
 * language_dao_key：最热模块的数据
 * language_dao_language：趋势模块的数据
 */
import keys from '../../Source/Data/keys';
import langs from '../../Source/Data/langs';
import {AsyncStorage} from "react-native";

// 最热模块的是标签，不一定是某种开发语言，用language_dao_key
// 趋势模块肯定是某种开发语言，用language_dao_language
export const FLAG_LANGUAGE = {flag_key: 'language_dao_key', flag_language: 'language_dao_language'};

export default class LanguageDao {
	constructor(flag) {
		// 标识一下是最热模块还是趋势模块
		this.flag = flag;
	}

	/**
	 * 从数据库读取最热模块的标签或趋势模块的语言，异步的
	 * @returns {Promise<any> | Promise}
	 */
	fetch() {
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem(this.flag, (error, value) => {
				if (!error) {
					// 数据库如果数据为空的话（一般是第一次），我们就从keys和langs两个文件里读取出来作为初始化数据，并存入数据库中
					if (!value) {
						let data = this.flag === FLAG_LANGUAGE.flag_key ? keys : langs;
						resolve(data);

						// 存入数据库中
						this.save(data);
					} else {// 数据库有数据
						try {
							resolve(JSON.parse(value));
						} catch (error) {
							reject(error);
						}
					}
				} else {
					reject(error);
				}
			});
		});
	}

	/**
	 * 往数据库写入最热模块的标签或趋势模块的语言
	 * @param data
	 */
	save(data) {
		let value = JSON.stringify(data);
		AsyncStorage.setItem(this.flag, value, error => {
			if (error) {
				console.log('写入数据出错：', error);
			}
		});
	}
}