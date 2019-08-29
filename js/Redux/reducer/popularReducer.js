/**
 * 编写最热模块，第一步：设计模块State的数据结构
 *
 * State其实就是一些数据的集合，那么模块State就是该模块数据的集合，
 * 首先我们会考虑Store里存储的应用State下该模块的State该有怎么样的数据结构，那这个数据结构怎么来设计呢？
 * （注意：我们设计时，一般首先考虑该界面正常加载时，要展示给用户什么样的数据那种情况，这是该模块State的主体数据，然后再根据其它状态，给主体数据做字段上的补充）
 * 这个就要靠自己了，就像后台接口给我们传数据那样考虑就可以了，我们需要看界面需要哪些数据，那么该模块State里就必须包含这些数据，以提供界面获取使用
 *
 * 比如，最热模块，因为系统的TopNavigator一加载就会加载全部item对应的界面，所以我们希望的数据应该是这样：
 *
 * popularState: {
 * 	java: {
 * 		data: [...],
 * 	},
 *
 * 	iOS: {
 * 		data: [...],
 * 	},
 *
 * 	......
 * }
 *
 * 好，这样就大概确定了应用State下该模块State的数据结构是什么样子了，这是reducer该我们提供的模块State。
 *
 * 接下来，我们再往前一步，就是reducer了，那么在reducer这里，我们就要根据不同的action type返回不同的模块State
 */

/**
 * 编写最热模块，第二步：编写模块reducer
 *
 * 好，有了第一步，我们已经知道reducer该返回怎样数据结构的模块State了，现在我们就来写该模块的reducer，就是下面的1、2、3、...
 */

import Type from '../action/actionTypes';

// 1、通常情况下，我们会给定模块state一个初始值，但是因为这里我们的选项卡是动态变化的，所以无法确定它的初始值应该是怎样，所有就不给具体数据了，这是没问题的，不是说一定要给
const defaultState = {};
// 2、编写模块reducer函数：
// 此时，我们突然发现需要action传递过来的type和数据才能编写reducer函数啊，于是我们就可以先停下模块reducer的编写，去考虑一下该模块的action，一会再回来继续编写reducer，（因为我们上面其实只是考虑了加载成功这种state下的数据结构而已，还有好多状态需要我们考虑的）
// 也就是说模块action的编写和模块reducer的编写是穿插编写的，但此处我们还是称模块action的编写为第三步，此时我们前往action/type.js文件下去考虑该模块的action，
// 每种action，可以只传该action下外界关心的数据就可以了，但每种状态都必须打碎原state
const popularReducer = (state = defaultState, action) => {
	// 我们从第三步穿越回来了，这次可以根据那一步确定好的action来编写reducer返回相应的模块state了
	switch (action.type) {
		case Type.POPULAR_FETCH_DATA:// 加载数据，和刷新区别开来，不想一进界面就出现刷新的那个菊花
			return {
				...state,
				showHUD: true,
			};
		case Type.POPULAR_FETCH_DATA_SUCCESS:// 加载数据成功，我们返回的state就应该是页面加载成功后需要的数据
			return {
				...state,
				// 这里的写法你可能觉得奇怪，因为[]在这里不再是一个数组的标识符，而是一个运算符，只有使用它才可以成功地使用一个变量作为对象的属性
				[action.selectedType]: {
					// 数据结构树的一层一层都要打碎
					...state[action.selectedType],// 打碎原数据
					data: action.data,// 新数据
				},

				showHUD: false,
			};
		case Type.POPULAR_FETCH_DATA_FAILURE:// 加载数据失败，返回原数据以免界面刷新时白屏，还要返回一个error
			return {
				...state,
				[action.selectedType]: {
					...state[action.selectedType],
				},
				error: action.error,
				showHUD: false,
			};
		case Type.POPULAR_REFRESH_HEADER:// 刷新中，返回原数据刷新过程中界面白屏，同时返回正在刷新中的标识
			return {
				...state,
				[action.selectedType]: {
					...state[action.selectedType],
				},
				isRefreshing: true,
			};
		case Type.POPULAR_REFRESH_HEADER_SUCCESS:// 刷新成功，返回新数据，并置位正在刷新中的标识
			return {
				...state,
				[action.selectedType]: {
					...state[action.selectedType],
					data: action.data,// 新数据
				},
				isRefreshing: false,
			};
		case Type.POPULAR_REFRESH_HEADER_FAILURE:// 刷新失败，返回原数据，并置位正在刷新中的标识，还要返回一个error
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

export default popularReducer;

// 好，编写好了模块reducer，我们就可以直接跳到第四步去编写具体的模块action了（第三步我们是确定了该模块需要哪些action，但是没做具体编写）。