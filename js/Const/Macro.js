/**
 * 全局样式
 */
import {Platform, Dimensions} from 'react-native';

// 你可以修改这里的
const THEME_COLOR = '#4caf50';

// 下面的这些一般就不要动了
const Macro = {
	// 系统
	SYSTEM_IS_IOS: Platform.OS === 'ios',

	// 宽高
	SCREEN_WIDTH: Dimensions.get('window').width,
	SCREEN_HEIGHT: Dimensions.get('window').height,
	STATUS_BAR_HEIGHT: Platform.OS === 'ios' ? 20 : 0,
	NAVIGATION_BAR_HEIGHT: Platform.OS === 'ios' ? 20 + 44 : 50,

	// 颜色
	THEME_COLOR: THEME_COLOR,
	INACTIVE_TINT_COLOR: '#A8A8A8',
	VC_BACKGROUND_COLOR: 'rgba(234, 234, 234, 1)',
};

export default Macro;