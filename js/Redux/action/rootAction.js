/**
 * 项目的根aciton
 *
 * 因为项目中可能有很多action，所以我们统一到这个地方，外界导入使用的时候就方便了
 */


// 导入所有的Action Creator
import {changeTheme} from './tabbarAction';
import {popularFetchData, popularRefreshHeader, popularRefreshFooter} from './popularAction';
import {trendingFetchData, trendingRefreshHeader, trendingRefreshFooter} from './trendingAction';
import {favoriteFetchData, favoriteRefreshHeader} from './favoriteAction';
import {loadLanguage} from './languageAction';
import {initThemeColor, changeThemeColor} from './ThemeAction';


// 再导出
export default {
	changeTheme,
	// 最热模块
	popularFetchData,
	popularRefreshHeader,
	popularRefreshFooter,

	// 趋势模块
	trendingFetchData,
	trendingRefreshHeader,

	// 收藏模块
	favoriteFetchData,
	favoriteRefreshHeader,

	// 最热模块读取标签或趋势模块语言
	loadLanguage,

	// 自定义主题
	initThemeColor,
	changeThemeColor,
}