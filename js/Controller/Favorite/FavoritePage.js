/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import NavigationUtil from '../../Project/Util/NavigationUtil';
import FavoriteTopNavigator from '../../View/Favorite/FavoriteTopNavigator';
import Action from '../../Redux/action/rootAction';
import ProjectNavigationBar from '../../Project/View/ProjectNavigationBar.js';
import {connect} from "react-redux";
import ProjectSafeAreaView from "../../Project/View/ProjectSafeAreaView";

class FavoritePage extends Component {
	render() {
		return (
			<ProjectSafeAreaView style={styles.container} topViewColor={this.props.themeState.themeColor}>
				<ProjectNavigationBar
					title={'收藏'}
				/>
				{/*顶部添加一个TopNavigator，会自动帮我们添加到顶部*/}
				<FavoriteTopNavigator
					themeColor={this.props.themeState.themeColor}
				/>
			</ProjectSafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
});

function mapStateToProps(state) {
	return {
		themeState: state.themeState,
	}
}

function mapDispatchToProps(dispatch) {
	return {

	}
}

const FavoritePageContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(FavoritePage);

export default FavoritePageContainer;

