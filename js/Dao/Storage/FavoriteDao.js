import {AsyncStorage} from 'react-native';

const FAVORITE_KEY_PREFIX = 'favorite_';

export default class FavoriteDao {
	// AsyncStorage存储收藏数据的数据结构，我们设计为（其实我觉得如下设计并不好，当然可以任你设计，只要能实现功能就好）：
	// AsyncStorage = {
	// 	favorite_popular: [item1ID, item2ID, ...],这两个itemID数组存在的意义一是为了方便读取所有的item，我们为此要在收藏和取消收藏时维护它
	// 	favorite_trending: [item3ID, item4ID, ...],二是为了最热和收藏模块能获取所有的key来刷新界面的收藏状态
	// 	item1ID: item1,
	// 	item2ID: item2,
	// 	item3ID: item3,
	// 	item4ID: item4,
	// 	...
	// }

	// 传一个flag进来，拼上一个前缀，拼成this.favoriteFlag属性，
	// 比如：this.favoriteFlag = 'favorite_popular'或this.favoriteFlag = 'favorite_trending'，

	/**
	 * 收藏
	 *
	 * key：item的id
	 * value：item
	 */
	static saveFavoriteItem(flag, key, value, callback) {
		if (!flag) return;

		this.favoriteFlag = FAVORITE_KEY_PREFIX + flag;
		AsyncStorage.setItem(key, value, error => {
			// 收藏成功之后，再更新一下当前选项（最热或趋势）下的itemID数组
			if (error) {
				console.log('写入数据出错：', error);
			} else {
				this.updateFavoriteKeys(key, true);
			}
		});
	}

	/**
	 * 移除收藏
	*/
	static removeFavoriteItem(flag, key) {
		if (!flag) return;

		this.favoriteFlag = FAVORITE_KEY_PREFIX + flag;
		AsyncStorage.removeItem(key, error => {
			// 移除收藏成功之后，再更新一下当前选项（最热或趋势）下的itemID数组
			if (error) {
				console.log('删除数据出错：', error);
			} else {
				this.updateFavoriteKeys(key, false);
			}
		});
	}

	/**
	 * 读取当前选项（最热或趋势）下所有的itemID
	 */
	static getAllItemIDs(flag) {
		if (!flag) return;

		this.favoriteFlag = FAVORITE_KEY_PREFIX + flag;

		return new Promise((resolve, reject) => {
			AsyncStorage.getItem(this.favoriteFlag, (error, value) => {
				if (!error) {
					try {
						resolve(JSON.parse(value));
					} catch (error) {
						reject(error);
					}
				} else {
					reject(error);
				}
			});
		});
	}

	/**
	 * 读取当前选项（最热或趋势）下所有收藏的item
	 */
	static getAllItems(flag) {
		if (!flag) return;

		this.favoriteFlag = FAVORITE_KEY_PREFIX + flag;

		return new Promise((resolve, reject) => {
			// 该方法返回的是当前选项（最热或趋势）下所有的itemID，而不是全部的itemID
			this.getAllItemIDs(flag)
				.then((itemIDs) => {
					// 用来盛放所有的item
					let items = [];

					if (itemIDs) {
						// multiGet(['k1', 'k2'], cb) -> cb([['k1', 'val1'], ['k2', 'val2']])
						AsyncStorage.multiGet(itemIDs, (error, values) => {
							try {
								values.map((item, index, values) => {
									let key = values[index][0];
									let value = values[index][1];

									if (value) {
										items.push(JSON.parse(value))
									}
								});

								resolve(items);
							} catch (error) {
								reject(error);
							}
						});
					} else {
						resolve(items);
					}
				})
				.catch((error) => {
					reject(error);
				})
		})
	}

	/**
	 * 更新当前选项（最热或趋势）下的itemID数组
	 *
	 * key：item的key
	 * isSave：true-收藏item，false-移除item
	 */
	static updateFavoriteKeys(key, isSave) {
		AsyncStorage.getItem(this.favoriteFlag, (error, value) => {
			if (error) {
				console.log('读取数据出错：', error);
			} else {
				// 获取当前选项（最热或趋势）下的itemID数组
				let itemIDs = [];
				if (value) {
					itemIDs = JSON.parse(value);
				}

				// 当前这个key在数组中的index
				let index = itemIDs.indexOf(key);
				if (isSave) {
					// 存储操作，并且当前key不在数组中
					if (index === -1) itemIDs.push(key);
				} else {
					// 移除操作，并且当前key存在于数组中
					if (index !== -1) itemIDs.splice(index, 1);
				}

				// 更新favoriteKey
				AsyncStorage.setItem(this.favoriteFlag, JSON.stringify(itemIDs));
			}
		});
	}
}