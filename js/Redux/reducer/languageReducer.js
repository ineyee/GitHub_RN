import Type from '../action/actionTypes';
import {FLAG_LANGUAGE} from "../../Dao/Storage/LanguageDao";

// languageState的默认state
const defaultState = {
	keys: [],
	languages: [],
};
const languageReducer = (state = defaultState, action) => {
	switch (action.type) {
		case Type.LANGUAGE_LOAD_SUCCESS:
			if (action.flag === FLAG_LANGUAGE.flag_key) {
				return {
					...state,
					keys: action.data,
				};
			} else {
				return {
					...state,
					languages: action.data,
				};
			}
		default:
			return state;
	}
};

export default languageReducer;