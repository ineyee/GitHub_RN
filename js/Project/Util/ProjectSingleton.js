/**
 * 单例
 */

let singleton = null;

export default class ProjectSingleton {
	themeColor;

	constructor(){
		if (!singleton) {
			singleton = this;
		}
		return singleton;
	}

	static sharedSingleton(){
		singleton = new ProjectSingleton();
		return singleton;
	}
}