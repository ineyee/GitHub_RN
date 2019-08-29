/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {AppContainer_ReduxContainer_Container} from './js/Navigator/AppContainer';
import store from './js/Redux/store/store';
import {Provider} from 'react-redux';

export default class App extends Component {
	render() {
		return (
			// 2.4 在根组件外面包一层Provider组件，记得一定要把store={store}传递进去，
			// 这个一定要在App.js里包裹，不要想着在这里包裹完直接供外界使用了，否则因为界面的加载有先后顺序，可能会导致意外的问题
			<Provider store={store}>
				<AppContainer_ReduxContainer_Container/>
			</Provider>
		);
	}
}