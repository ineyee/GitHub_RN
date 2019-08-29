// 编写最热模块，第四步：编写具体的模块action
// 第二步我们在模块reducer的地方，已经知道了每种action下，reducer需要什么样的数据，那么此时我们就可以编写具体的action，把reducer需要的数据提供给它了
// 通常情况下，我们会编写一个action creator来为每个action type创建它对应的action
// 但是针对网络请求来说，我们通常是直接编写一个异步action，这个异步action里会包含通常情况下会编写的那多个同步action，并且里面还要一个网络请求的操作

import Type from './actionTypes';
// 使用离线缓存
import ProjectRequestWithCache, {FLAG_STORAGE} from '../../Dao/Request/ProjectRequestWithCache';
import FavoriteDao from "../../Dao/Storage/FavoriteDao";

// 获取最热模块数据
// 因为我们用的Github这个接口它没有提供分页，而是一页都给我们返回来了，所以我们这里会手动地给它把数据切成10条一页，模拟分页


// FetchData
// 一个网络请求就是一个异步action，我们就把一个异步action当作一个网络请求的函数来编写就好了，事实上它也确实就是这样，只不过该函数比起普通的网络请求函数，它的返回值了是一个箭头函数——即一个异步action而已
// 该异步action需要的参数 = 网络请求需要的参数 + action负载信息需要的参数
// 网络请求需要的参数：url、pageNum、pageSize
// action是需要一个selectedType的传给reducer使用
export function popularFetchData(url, selectedType) {
	return dispatch => {
		// 异步操作开始前，发出一个action
		dispatch({type: Type.POPULAR_FETCH_DATA, selectedType: selectedType});

		// 发起网络请求，该网络请求需要一个完整的请求的url作为参数（因为我们是这么封装的，当然我们以后可能会修改这个封装）
		const dataStore = new ProjectRequestWithCache();
		dataStore.fetchData(url, FLAG_STORAGE.flag_popular)
			.then(JsonData => {// 该网络请求返回JsonData
				// 异步操作结束后（成功），再发出一个action
				// 因为接口的数据结构里JsonData对应所有的数据，而JsonData.items对应我们真正需要的数据
				// dispatch({
				// 	type: Type.POPULAR_FETCH_DATA_SUCCESS,
				// 	// 第一波数据，外面会把pageNum传进来1的
				// 	data: pageSize >= JsonData.items.length ? JsonData.items : JsonData.items.slice(0, pageSize),
				// 	selectedType: selectedType
				// });

				// 由于接口不是我们后台写的，所以可能少某些字段，我们要自己为它添上去，比如这里我们就要为数据添上“是否收藏”这个字段
				wrappedIsFavoriteKeyData(JsonData.items, wrappedIsFavoriteKeyData => {
					dispatch({
						type: Type.POPULAR_FETCH_DATA_SUCCESS,
						data: wrappedIsFavoriteKeyData,
						selectedType: selectedType,
					});
				})
			})
			.catch(error => {
				console.log('popularLoadData失败：', error);
				// 异步操作结束后（失败），再发出一个action
				dispatch({type: Type.POPULAR_FETCH_DATA_FAILURE, selectedType: selectedType, error});
			})
	}
}

// RefreshHeader
export function popularRefreshHeader(url, selectedType) {
	return dispatch => {
		dispatch({type: Type.POPULAR_REFRESH_HEADER, selectedType: selectedType});

		const dataStore = new ProjectRequestWithCache();
		dataStore.fetchData(url, FLAG_STORAGE.flag_popular)
			.then(JsonData => {
				// dispatch({
				// 	type: Type.POPULAR_REFRESH_HEADER_SUCCESS,
				// 	data: pageSize >= JsonData.items.length ? JsonData.items : JsonData.items.slice(0, pageSize),
				// 	selectedType: selectedType
				// });
				// 由于接口不是我们后台写的，所以可能少某些字段，我们要自己为它添上去，比如这里我们就要为数据添上“是否收藏”这个字段
				wrappedIsFavoriteKeyData(JsonData.items, wrappedIsFavoriteKeyData => {
					dispatch({
						type: Type.POPULAR_REFRESH_HEADER_SUCCESS,
						data: wrappedIsFavoriteKeyData,
						selectedType: selectedType
					});
				})
			})
			.catch(error => {
				console.log('popularLoadData失败：', error);
				dispatch({type: Type.POPULAR_REFRESH_HEADER_FAILURE, selectedType: selectedType, error});
			})
	}
}

/**
 * 给原数据包装一个isFavorite的key
 *
 * @param JsonData 原数据
 * @param callback 该函数是个异步函数，即一个异步操作，所以你给它返回值时没有意义的，接收的地方肯定接收不到，所以只能让异步函数暴露回调。执行完成后触发回调才行，iOS的网络请求不都是这样嘛
 * @returns {Promise<void>} 注意：wrappedIsFavoriteKeyData这个函数是异步的
 */
export async function wrappedIsFavoriteKeyData(JsonData, callback) {
	// 我们封装的getAllItemIDs这个操作本身是异步的，因为读取数据库的操作就应该是异步
	// 但是这个地方，我们给item包装isFavorite，那读取所有的key就必须同步，要不然都包装完了，你才读出来，就赶不上了
	// 所以这个地方我们用async-await来将这个异步操作在包装一下，在这个异步操作同步化，但外面这整个函数还是个异步操作
	let keys = [];
	try {
		// 同步读取，即一直卡在这读取，直到读取完再走下面的代码，要是不转同步的话，这一步直接就跳过去了
		keys = await FavoriteDao.getAllItemIDs(FLAG_STORAGE.flag_popular);
	} catch (e) {
		console.log('trendingAtion界面，FavoriteDao.getAllItemIDs();读取出错');
	}

	let wrappedIsFavoriteKeyJsonData = [];

	for (let i = 0, length = JsonData.length; i < length; i++) {
		wrappedIsFavoriteKeyJsonData.push({
			...JsonData[i],// 原数据，打散它
			isFavorite: isFavorite(JsonData[i], keys),// 包裹的isFavorite这个key
		})
	}

	if (typeof callback === 'function') {
		callback(wrappedIsFavoriteKeyJsonData);
	}
}

/**
 * 检查item是否被收藏（逼不得已，因为接口不是咱们后台写的，本质就是看看keys里面有没有这个item的id或fullName）
 *
 * @param item 当前展示一条的item
 * @param keys AsyncStorage里存储的，当前选项（最热或趋势）下所有收藏的key
 * @returns {boolean} 该item是否被收藏
 */
function isFavorite(item, keys = []) {
	if (!keys || !item) {
		return false;
	}

	// 同样由于接口不是咱们后台写的，所以最热模块我们拿的是item.id作为唯一标识，而趋势模块拿的是item.fullName作为唯一标识
	let id = item.id ? item.id : item.fullName;
	if (keys.includes(id.toString())) {
		return true;
	} else {
		return false;
	}
}

// action写好之后，我们就经过四步完成了Redux的部分，接下来我们就可以去真正的界面那里去搞React-Redux的部分了（详见DynamicTopNavigator）。