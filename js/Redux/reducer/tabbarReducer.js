/**
 * theme的reducer，用来完成theme的state的修改
 */

import Type from '../action/actionTypes';
import Macro from "../../Const/Macro";

// tabbar的初始state
const defaultState = {
	themeColor: Macro.THEME_COLOR,
};
// tabbar的state具体变化的过程
const tabbarReducer = (state = defaultState, action) => {
	switch (action.type) {
		case Type.CHANGE_THEME_COLOR:
			const newState = {
				...state,
				themeColor: action.themeColor,
			}
			return newState;
		default:
			return state;
	}
};

export default tabbarReducer;