/**
 * 因为好多地方的收藏和取消收藏按钮的事件是一样的，所以我们抽出来
 */
import {FLAG_STORAGE} from "../../Dao/Request/ProjectRequestWithCache";
import FavoriteDao from "../../Dao/Storage/FavoriteDao";

export default class FavoriteUtil {
	static didSelectedFavorite(flag, item) {
		const id = flag === FLAG_STORAGE.flag_popular ? item.id.toString() : item.fullName;
		if (item.isFavorite) {
			FavoriteDao.saveFavoriteItem(flag, id, JSON.stringify(item));
		} else {
			FavoriteDao.removeFavoriteItem(flag, id);
		}
	}
}