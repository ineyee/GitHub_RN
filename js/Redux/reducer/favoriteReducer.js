import Type from '../action/actionTypes';

/**
 * 收藏模块的state结构：
 *
 * favoriteState: {
 * 	popular: {
 * 		data: [...],
 * 	},
 *
 * 	trending: {
 * 		data: [...],
 * 	},
 * }
*/

const defaultState = {};
const favoriteReducer = (state = defaultState, action) => {
	switch (action.type) {
		case Type.FAVORITE_FETCH_DATA:// 加载数据，和刷新区别开来，不想一进界面就出现刷新的那个菊花
			return {
				...state,
			};
		case Type.FAVORITE_FETCH_DATA_SUCCESS:// 加载数据成功，我们返回的state就应该是页面加载成功后需要的数据
			return {
				...state,
				// 这里的写法你可能觉得奇怪，因为[]在这里不再是一个数组的标识符，而是一个运算符，只有使用它才可以成功地使用一个变量作为对象的属性
				[action.selectedType]: {
					// 数据结构树的一层一层都要打碎
					...state[action.selectedType],// 打碎原数据
					data: action.data,// 新数据
				},
			};
		case Type.FAVORITE_FETCH_DATA_FAILURE:// 加载数据失败，返回原数据以免界面刷新时白屏，还要返回一个error
			return {
				...state,
				[action.selectedType]: {
					...state[action.selectedType],
				},
				error: action.error,
			};
		case Type.FAVORITE_REFRESH_HEADER:// 刷新中，返回原数据刷新过程中界面白屏，同时返回正在刷新中的标识
			return {
				...state,
				[action.selectedType]: {
					...state[action.selectedType],
				},
				isRefreshing: true,
			};
		case Type.FAVORITE_REFRESH_HEADER_SUCCESS:// 刷新成功，返回新数据，并置位正在刷新中的标识
			return {
				...state,
				[action.selectedType]: {
					...state[action.selectedType],
					data: action.data,// 新数据
				},
				isRefreshing: false,
			};
		case Type.FAVORITE_REFRESH_HEADER_FAILURE:// 刷新失败，返回原数据，并置位正在刷新中的标识，还要返回一个error
			return {
				...state,
				[action.selectedType]: {
					...state[action.selectedType],
				},
				error: action.error,
				isRefreshing: false,
			};
		default:
			return state;
	}
};

export default favoriteReducer;

// 好，编写好了模块reducer，我们就可以直接跳到第四步去编写具体的模块action了（第三步我们是确定了该模块需要哪些action，但是没做具体编写）。