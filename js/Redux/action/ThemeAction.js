import Type from './actionTypes';
import ThemeDao from "../../Dao/Storage/ThemeDao";

// 同步Action
export function changeThemeColor(themeColor) {
	return {type: Type.THEME_COLOR_DID_CHANGE, themeColor: themeColor};
}

// 异步Action
export function initThemeColor() {
	return dispatch => {
		ThemeDao.getThemeColor()
			.then(themeColor => {
				dispatch({type: Type.INIT_THEME_COLOR, themeColor: themeColor});
			})
	}
}