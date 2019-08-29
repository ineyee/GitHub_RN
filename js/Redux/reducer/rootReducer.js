/**
 * 项目的根reducer
 *
 * 1、因为创建store的时候只能填写一个reducer，而项目中通常会有很多reducer，
 * 所以我们就专门创建了这个reducer专门用来合并其它所有的子reducer，它不负责应用state具体的变化，只负责合并操作
 * 我们把它称为根reducer了，供创建store时使用
 *
 * 2、请注意：
 * 这个根reducer是个极其重要的东西，因为正是它合并子reducer的过程，决定了应用state里到底存放着什么东西，即什么组件的state要被放在它里面，
 * 什么组件的state想要交由应用的state来统一管理，我们就为该组件编写一个对应的子reducer来描述它state具体变化的过程并返回一个state，然后把这个reducer作为value存放在应用state里（即合并子reducer的时候）
 * 刚创建根reducer时，我们可能不知道将来会有那些组件的state会被放在应用state里来统一管理，所以可以先空着，什么时候需要什么时候往这里添加就可以。
 */
import {combineReducers} from 'redux';
import navigatorReducer from './navigatorReducer';
import tabbarReducer from './tabbarReducer';
import popularReducer from './popularReducer';
import trendingReducer from "./trendingReducer";
import favoriteReducer from "./favoriteReducer";
import languageReducer from "./languageReducer";
import themeReducer from "./themeReducer";

// 创建根reducer，合并所有子reducer（为了方便管理，我们会把子reduce分别写在单独的文件里）
const rootReducer = combineReducers({// 这个对象就是应用的state
	// 应用state里的属性名当然可以随便起，但是为了好理解，我们就起做xxxState，为什么这么起呢？
	// 因为应用state的定义就是，它里面存放着项目中所有想被统一管理state的组件的state，所以我们起做xxxState，将来使用时很方便理解，比如state.counterState，就代表从应用state里取出counterState
	// 而且它的值就是对应的该组件的那个子reducer嘛，而reducer函数又总是返回一个state，这样xxxState = 某个state值，也很好理解
	navigatorState: navigatorReducer,
	tabbarState: tabbarReducer,
	popularState: popularReducer,
	trendingState: trendingReducer,
	favoriteState: favoriteReducer,
	languageState: languageReducer,
	themeState: themeReducer,
});

export default rootReducer;

// 接下来第3步，就是结合各个子组件reducer里action.type的规定，为各个组件创建对应的action，预备好action，到时候组件一被触摸就dispatch一个action，详见rootAction.js文件
