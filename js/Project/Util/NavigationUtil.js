/**
 * 我们专门写一个负责跳转的工具类，方便项目中跳转的统一管理
 */

export default class NavigationUtil {
	// 一个静态变量，记录根容器StackNavigator的navigation，因为项目的根容器是一个StackNavigator嘛，所以项目中的跳转都是用它的navigation
	static navigation;

	/**
	 * 跳转到上一页
	 */
	static goBack() {
		// 根navigation无法goBack，但是它可以pop
		this.navigation.pop();
	}

	/**
	 * 跳转到指定页面
	 *
	 * @param page 要传递的参数
	 * @param params 要跳转的页面路由名
	 */
	static navigate(page, params) {
		// 但是请注意：
		// App中所有界面的跳转都是通过这个方法来跳转的，包括启动页、引导页、广告页跳转到StackNavigator，那就要想到这个时候也用StackNavigator的navigation属性做跳转能成功吗？
		// 答案是：能成功！
		// 你可以回想一下，我们只要在同一个导航栈中的界面，其实不一定非要拿栈底那个根容器的navigation属性来做跳转，其实拿其中任意一个界面的navigation属性做跳转都可以
		// 此处也是同理的，因为SwitchNavigator没有作为别人的路由存在，所以SwitchNavigator没有navigation属性，我们就只能那栈内界面的navigation属性做跳转了，那WelcomePage或者StackNavigator的navigation都行，但为了项目的统一性，我们就拿StackNavigator的了

		if (!this.navigation) {
			console.log('NavigationUtil.navigation不能为空！');
			return;
		}

		this.navigation.navigate(page, params);
	}
}