/**
 * 这个东西就可以了，可以应用于所有的请求，当然最好我们可以对get和post请求做一下封装，等有空了再做
 *
 * 但是呢，趋势模块的接口嘛没有，那个视频作者就自己搞了一通，写了个组件出来，当作获取接口数据的来源，所以我们这里会修改。但你要知道，其实真正的项目我们不需要这一部分内容
 */

import AsyncStorage from '@react-native-community/async-storage';
import Trending from 'GitHubTrending';

export const FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'};

export default class ProjectRequestWithCache {
	/**
	 * 请求数据，优先读取缓存数据型策略的思想就在这个方法里实现
	 *
	 * 这里再写一下该策略的思想，方便对比代码理解
	 * 1、客户端发起网络请求，我们拿到这个请求的url
	 * 2、优先读取缓存数据
	 *        读取缓存数据成功，如果缓存数据存在并且未过期，则直接加载，
	 *        读取缓存数据失败、缓存数据不存在或已过期，则请求网络数据并更新缓存。
	 */
	fetchData(url, flag) {
		// 因为我们是对离线缓存做封装，
		// 所以这里就用Promise对象包装了一下异步操作，这样就可以把异步操作成功的数据或失败的信息传递出去，外界就可以通过.then或者.catch来做回调了
		// 注意：返回的数据，已经是可以直接使用的了，我们已经在这个类内部做了处理了
		return new Promise((resolve, reject) => {
			// 优先读取缓存数据
			this._fetchLocalData(url)
				.then(wrapData => {
					// 读取缓存数据成功
					if (wrapData && this._checkTimestampValid(wrapData.timestamp)) {// 缓存数据存在并且未过期
						// 直接返回并加载
						resolve(wrapData.data);
					} else {// 缓存数据不存在或已过期
						this._fetchNetworkData(url, flag)
							.then(data => {
								// 网络请求成功
								resolve(data);

								// 更新缓存
								this._writeData(url, data);
							})
							.catch((error) => {
								// 网络请求失败
								reject(error);
							})
					}
				})
				.catch(error => {
					// 读取缓存数据失败
					this._fetchNetworkData(url, flag)
						.then(data => {
							// 网络请求成功
							resolve(data);

							// 更新缓存
							this._writeData(url, data);
						})
						.catch((error) => {
							// 网络请求失败
							reject(error);
						})
				})
		});
	}

	/**
	 * 读取缓存数据
	 */
	_fetchLocalData(url) {
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem(url, (error, result) => {
				if (!error) {
					try {
						// 因为result是个JSON字符串，所以要序列化为JS对象
						// 把读取成功的结果传递出去
						resolve(JSON.parse(result));
					} catch (e) {
						// 此处代表序列化失败
						// 把读取失败的信息传递出去
						reject(e);
					}
				} else {
					// 把读取失败的信息传递出去
					reject(error);
				}
			})
		})
	}

	/**
	 * 请求网络数据
	 */
	_fetchNetworkData(url, flag) {
		if (flag === FLAG_STORAGE.flag_trending) {// 请求趋势模块数据的话
			return new Promise((resolve, reject) => {
				new Trending().fetchTrending(url)
					.then((data) => {
						// 请求数据为空
						if (!data) {
							throw new Error('趋势页面网络请求失败！');
						}

						// 网络请求成功
						resolve(data);

						// 更新缓存
						this._writeData(url, data);
					})
					.catch((error) => {
						// 网络请求失败
						reject(error);
					})
			})
		} else {
			return new Promise((resolve, reject) => {
				fetch(url)
					.then(response => {
						if (response.ok) {
							// 请求到的response其实是一个Response对象，它是一个很原始的数据格式，我们不能直接使用，先获取它的JSON字符串文本格式
							return response.text();
						}
						throw new Error('网络请求失败！');
					})
					.then(responseText => {

						// 然后把JSON字符串序列化为JS对象
						const responseJSObj = JSON.parse(responseText);

						// 把请求成功的数据传递出去
						resolve(responseJSObj);
					})
					.catch((error) => {
						// 把请求失败的信息传递出去
						reject(error);
					})
			})
		}
	}

	/**
	 * 存储数据，作为缓存数据
	 *
	 * 请求的url作为key，请求到的数据作为value
	 */
	_writeData(url, data, callBack) {
		if (!url || !data) return;

		const wrapData = this._wrapData(data);
		// JSON.stringify为字符串
		AsyncStorage.setItem(url, JSON.stringify(wrapData), callBack);
	}

	/**
	 * 给原数据包裹一个时间戳，以便用来检查缓存数据是否过期
	 */
	_wrapData(data) {
		return {data: data, timestamp: new Date().getTime()};
	}

	/**
	 * 检查缓存数据是否过期，缓存有效期为4个小时
	 */
	_checkTimestampValid(timestamp) {
		const currentData = new Date();
		const targettData = new Date();
		targettData.setTime(timestamp);

		// 月
		if (currentData.getMonth() !== targettData.getMonth()) return false;
		// 日
		if (currentData.getDate() !== targettData.getDate()) return false;
		// 时
		if (currentData.getHours() - targettData.getHours() > 4) return false;

		return true;
	}
}