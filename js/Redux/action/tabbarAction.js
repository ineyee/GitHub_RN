/**
 * 主题的action，用来描述主题如何变化
 */


import Type from './actionTypes';

// 创建一个主题的Action Creator
function changeTheme(themeColor) {
	// 返回一个action
	return {
		type: Type.CHANGE_THEME_COLOR,
		themeColor,
	}
}

export {changeTheme};