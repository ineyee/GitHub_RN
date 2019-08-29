import Type from '../action/actionTypes';

const defaultState = {};

const themeReducer = (state = defaultState, action) => {
	switch (action.type) {
		case Type.THEME_COLOR_DID_CHANGE:
			return {
				...state,
				themeColor: action.themeColor,
			};
		case Type.INIT_THEME_COLOR:
			return {
				...state,
				themeColor: action.themeColor,
			};
		default:
			return state;
	}
};

export default themeReducer;