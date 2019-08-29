import Type from './actionTypes';
import LanguageDao from "../../Dao/Storage/LanguageDao";

// 读取数据库也是异步action
export function loadLanguage(flag) {
	// 要同步获取，确保读取完毕，因为我们这里只给了一个成功的状态
	return async dispatch => {
		try {
			let language = await new LanguageDao(flag).fetch();

			dispatch({type: Type.LANGUAGE_LOAD_SUCCESS, flag: flag, data: language});
		} catch (e) {
			console.log('loadLanguage出错：', e);
		}
	}
}